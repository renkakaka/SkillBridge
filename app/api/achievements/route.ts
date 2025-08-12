import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/achievements - Получить достижения пользователя
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Получаем все достижения пользователя
    const userAchievements = await prisma.userAchievement.findMany({
      where: { userId },
      include: {
        achievement: true
      },
      orderBy: { unlockedAt: 'desc' }
    })

    // Получаем все доступные достижения
    const allAchievements = await prisma.achievement.findMany({
      orderBy: { points: 'asc' }
    })

    // Получаем текущий уровень пользователя
    const userLevel = await prisma.userLevel.findUnique({
      where: { userId }
    })

    // Рассчитываем статистику
    const totalPoints = userAchievements.reduce((sum, ua) => sum + ua.achievement.points, 0)
    const unlockedCount = userAchievements.length
    const totalCount = allAchievements.length
    const progressPercentage = totalCount > 0 ? (unlockedCount / totalCount) * 100 : 0

    // Определяем следующий уровень
    const nextLevel = userLevel ? userLevel.level + 1 : 1
    const nextLevelPoints = nextLevel * 100 // Простая формула: каждый уровень требует level * 100 очков
    const pointsToNextLevel = Math.max(0, nextLevelPoints - totalPoints)

    const stats = {
      totalPoints,
      unlockedCount,
      totalCount,
      progressPercentage: Math.round(progressPercentage * 10) / 10,
      currentLevel: userLevel?.level || 1,
      nextLevel,
      pointsToNextLevel,
      levelProgress: userLevel ? ((totalPoints % (userLevel.level * 100)) / (userLevel.level * 100)) * 100 : 0
    }

    return NextResponse.json({
      achievements: userAchievements,
      allAchievements,
      stats
    })
  } catch (error) {
    console.error('Achievements API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch achievements' },
      { status: 500 }
    )
  }
}

// POST /api/achievements - Разблокировать достижение
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, achievementId } = body

    if (!userId || !achievementId) {
      return NextResponse.json({ 
        error: 'User ID and Achievement ID are required' 
      }, { status: 400 })
    }

    // Проверяем, не разблокировано ли уже достижение
    const existingAchievement = await prisma.userAchievement.findUnique({
      where: {
        userId_achievementId: {
          userId,
          achievementId
        }
      }
    })

    if (existingAchievement) {
      return NextResponse.json({ 
        error: 'Achievement already unlocked' 
      }, { status: 400 })
    }

    // Получаем информацию о достижении
    const achievement = await prisma.achievement.findUnique({
      where: { id: achievementId }
    })

    if (!achievement) {
      return NextResponse.json({ 
        error: 'Achievement not found' 
      }, { status: 404 })
    }

    // Разблокируем достижение
    const userAchievement = await prisma.userAchievement.create({
      data: {
        userId,
        achievementId,
        unlockedAt: new Date(),
        progress: 100
      }
    })

    // Обновляем уровень пользователя
    await updateUserLevel(userId)

    // Создаем уведомление о достижении
    await prisma.notification.create({
      data: {
        userId,
        type: 'achievement',
        title: 'Նոր հաջողություն բացահայտվել է',
        message: `Դուք բացահայտել եք "${achievement.title}" հաջողությունը և ստացել ${achievement.points} միավոր`,
        isImportant: true,
        metadata: JSON.stringify({
          achievementId: achievement.id,
          achievementName: achievement.title,
          points: achievement.points
        })
      }
    })

    return NextResponse.json({ 
      userAchievement, 
      message: 'Achievement unlocked successfully' 
    })
  } catch (error) {
    console.error('Achievement unlock error:', error)
    return NextResponse.json(
      { error: 'Failed to unlock achievement' },
      { status: 500 }
    )
  }
}

// PUT /api/achievements - Обновить прогресс достижения
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, achievementId, progress } = body

    if (!userId || !achievementId || progress === undefined) {
      return NextResponse.json({ 
        error: 'User ID, Achievement ID and progress are required' 
      }, { status: 400 })
    }

    // Проверяем существование достижения
    const achievement = await prisma.achievement.findUnique({
      where: { id: achievementId }
    })

    if (!achievement) {
      return NextResponse.json({ 
        error: 'Achievement not found' 
      }, { status: 404 })
    }

    // Обновляем или создаем прогресс
    const userAchievement = await prisma.userAchievement.upsert({
      where: {
        userId_achievementId: {
          userId,
          achievementId
        }
      },
      update: {
        progress: Math.min(100, Math.max(0, progress)),
        updatedAt: new Date()
      },
      create: {
        userId,
        achievementId,
        progress: Math.min(100, Math.max(0, progress)),
        unlockedAt: progress >= 100 ? new Date() : null
      }
    })

    // Если достижение разблокировано, обновляем уровень
    if (progress >= 100 && !userAchievement.unlockedAt) {
      await prisma.userAchievement.update({
        where: { id: userAchievement.id },
        data: { unlockedAt: new Date() }
      })
      
      await updateUserLevel(userId)

      // Создаем уведомление
      await prisma.notification.create({
        data: {
          userId,
          type: 'achievement',
          title: 'Նոր հաջողություն բացահայտվել է',
          message: `Դուք բացահայտել եք "${achievement.title}" հաջողությունը և ստացել ${achievement.points} միավոր`,
          isImportant: true,
          metadata: JSON.stringify({
            achievementId: achievement.id,
            achievementName: achievement.title,
            points: achievement.points
          })
        }
      })
    }

    return NextResponse.json({ 
      userAchievement, 
      message: 'Achievement progress updated successfully' 
    })
  } catch (error) {
    console.error('Achievement progress update error:', error)
    return NextResponse.json(
      { error: 'Failed to update achievement progress' },
      { status: 500 }
    )
  }
}

// DELETE /api/achievements - Сбросить достижение
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const achievementId = searchParams.get('achievementId')

    if (!userId || !achievementId) {
      return NextResponse.json({ 
        error: 'User ID and Achievement ID are required' 
      }, { status: 400 })
    }

    // Удаляем достижение пользователя
    await prisma.userAchievement.delete({
      where: {
        userId_achievementId: {
          userId,
          achievementId
        }
      }
    })

    // Обновляем уровень пользователя
    await updateUserLevel(userId)

    return NextResponse.json({ message: 'Achievement reset successfully' })
  } catch (error) {
    console.error('Achievement reset error:', error)
    return NextResponse.json(
      { error: 'Failed to reset achievement' },
      { status: 500 }
    )
  }
}

// Вспомогательная функция для обновления уровня пользователя
async function updateUserLevel(userId: string) {
  try {
    // Получаем все разблокированные достижения пользователя
    const unlockedAchievements = await prisma.userAchievement.findMany({
      where: {
        userId,
        unlockedAt: { not: null }
      },
      include: {
        achievement: true
      }
    })

    // Рассчитываем общие очки
    const totalPoints = unlockedAchievements.reduce((sum, ua) => sum + ua.achievement.points, 0)
    
    // Простая формула уровня: каждые 100 очков = 1 уровень
    const newLevel = Math.floor(totalPoints / 100) + 1

    // Обновляем или создаем уровень пользователя
    await prisma.userLevel.upsert({
      where: { userId },
      update: {
        level: newLevel,
        totalPoints,
        updatedAt: new Date()
      },
      create: {
        userId,
        level: newLevel,
        totalPoints,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })

    // Проверяем, достиг ли пользователь нового уровня
    const currentUserLevel = await prisma.userLevel.findUnique({
      where: { userId }
    })

    if (currentUserLevel && currentUserLevel.level > 1) {
      // Создаем уведомление о новом уровне
      await prisma.notification.create({
        data: {
          userId,
          type: 'achievement',
          title: 'Նոր մակարդակ հասել եք',
          message: `Դուք հասել եք ${currentUserLevel.level} մակարդակին`,
          isImportant: true,
          metadata: JSON.stringify({
            level: currentUserLevel.level,
            totalPoints: currentUserLevel.totalPoints
          })
        }
      })
    }
  } catch (error) {
    console.error('Error updating user level:', error)
  }
}
