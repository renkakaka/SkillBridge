import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/earnings - Получить данные о заработках пользователя
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const period = searchParams.get('period') || 'month'
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Определяем период для фильтрации
    let dateFilter: any = {}
    const now = new Date()
    
    switch (period) {
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        dateFilter = {
          gte: weekAgo,
          lte: now
        }
        break
      case 'month':
        const monthAgo = new Date(now.getFullYear(), now.getMonth(), 1)
        dateFilter = {
          gte: monthAgo,
          lte: now
        }
        break
      case 'quarter':
        const quarterStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1)
        dateFilter = {
          gte: quarterStart,
          lte: now
        }
        break
      case 'year':
        const yearStart = new Date(now.getFullYear(), 0, 1)
        dateFilter = {
          gte: yearStart,
          lte: now
        }
        break
      default:
        if (startDate && endDate) {
          dateFilter = {
            gte: new Date(startDate),
            lte: new Date(endDate)
          }
        }
    }

    // Получаем транзакции пользователя
    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        ...(Object.keys(dateFilter).length > 0 && { createdAt: dateFilter })
      },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            client: {
              select: {
                name: true,
                avatar: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Получаем проекты пользователя для расчета статистики
    const projects = await prisma.project.findMany({
      where: {
        userId,
        ...(Object.keys(dateFilter).length > 0 && { createdAt: dateFilter })
      },
      select: {
        id: true,
        budget: true,
        status: true,
        createdAt: true,
        completedAt: true
      }
    })

    // Рассчитываем статистику
    const totalEarnings = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)
    
    const monthlyEarnings = transactions
      .filter(t => {
        const transactionDate = new Date(t.createdAt)
        const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        return t.type === 'income' && transactionDate >= currentMonth
      })
      .reduce((sum, t) => sum + t.amount, 0)
    
    const pendingAmount = projects
      .filter(p => p.status === 'in-progress')
      .reduce((sum, p) => sum + (p.budget || 0), 0)
    
    const availableBalance = totalEarnings - pendingAmount
    
    // Рассчитываем рост по сравнению с предыдущим периодом
    let previousPeriodEarnings = 0
    let growthRate = 0
    
    if (period === 'month') {
      const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
      
      const previousMonthTransactions = await prisma.transaction.findMany({
        where: {
          userId,
          type: 'income',
          createdAt: {
            gte: previousMonth,
            lt: currentMonthStart
          }
        }
      })
      
      previousPeriodEarnings = previousMonthTransactions.reduce((sum, t) => sum + t.amount, 0)
    }
    
    if (previousPeriodEarnings > 0) {
      growthRate = ((monthlyEarnings - previousPeriodEarnings) / previousPeriodEarnings) * 100
    }

    // Получаем данные для графиков
    const monthlyData = await getMonthlyEarningsData(userId, period)
    const categoryData = await getCategoryEarningsData(userId, period)

    const stats = {
      totalEarnings,
      monthlyEarnings,
      pendingAmount,
      availableBalance,
      growthRate: Math.round(growthRate * 10) / 10,
      projectCount: projects.length,
      completedProjects: projects.filter(p => p.status === 'completed').length
    }

    return NextResponse.json({
      transactions,
      stats,
      charts: {
        monthly: monthlyData,
        category: categoryData
      }
    })
  } catch (error) {
    console.error('Earnings API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch earnings data' },
      { status: 500 }
    )
  }
}

// POST /api/earnings - Создать новую транзакцию
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, type, amount, description, projectId, metadata = {} } = body

    if (!userId || !type || !amount || !description) {
      return NextResponse.json({ 
        error: 'User ID, type, amount and description are required' 
      }, { status: 400 })
    }

    const transaction = await prisma.transaction.create({
      data: {
        userId,
        type,
        amount,
        description,
        projectId,
        metadata,
        status: 'completed',
        createdAt: new Date()
      }
    })

    return NextResponse.json({ 
      transaction, 
      message: 'Transaction created successfully' 
    })
  } catch (error) {
    console.error('Transaction creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create transaction' },
      { status: 500 }
    )
  }
}

// PUT /api/earnings - Обновить транзакцию
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, userId, data } = body

    if (!id || !userId) {
      return NextResponse.json({ error: 'Transaction ID and User ID are required' }, { status: 400 })
    }

    const transaction = await prisma.transaction.update({
      where: { id, userId },
      data: {
        ...data,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({ 
      transaction, 
      message: 'Transaction updated successfully' 
    })
  } catch (error) {
    console.error('Transaction update error:', error)
    return NextResponse.json(
      { error: 'Failed to update transaction' },
      { status: 500 }
    )
  }
}

// DELETE /api/earnings - Удалить транзакцию
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const userId = searchParams.get('userId')

    if (!id || !userId) {
      return NextResponse.json({ error: 'Transaction ID and User ID are required' }, { status: 400 })
    }

    await prisma.transaction.delete({
      where: { id, userId }
    })

    return NextResponse.json({ message: 'Transaction deleted successfully' })
  } catch (error) {
    console.error('Transaction deletion error:', error)
    return NextResponse.json(
      { error: 'Failed to delete transaction' },
      { status: 500 }
    )
  }
}

// Вспомогательные функции для графиков
async function getMonthlyEarningsData(userId: string, period: string) {
  const now = new Date()
  let months: string[] = []
  let earnings: number[] = []

  switch (period) {
    case 'month':
      // Данные за последние 12 месяцев
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
        months.push(date.toLocaleDateString('hy-AM', { month: 'long' }))
        
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1)
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0)
        
        const monthTransactions = await prisma.transaction.findMany({
          where: {
            userId,
            type: 'income',
            createdAt: {
              gte: monthStart,
              lte: monthEnd
            }
          }
        })
        
        earnings.push(monthTransactions.reduce((sum, t) => sum + t.amount, 0))
      }
      break
      
    case 'quarter':
      // Данные за последние 4 квартала
      for (let i = 3; i >= 0; i--) {
        const quarterStart = new Date(now.getFullYear(), Math.floor((now.getMonth() - i * 3) / 3) * 3, 1)
        months.push(`${quarterStart.getFullYear()} Q${Math.floor(quarterStart.getMonth() / 3) + 1}`)
        
        const quarterEnd = new Date(quarterStart.getFullYear(), quarterStart.getMonth() + 3, 0)
        
        const quarterTransactions = await prisma.transaction.findMany({
          where: {
            userId,
            type: 'income',
            createdAt: {
              gte: quarterStart,
              lte: quarterEnd
            }
          }
        })
        
        earnings.push(quarterTransactions.reduce((sum, t) => sum + t.amount, 0))
      }
      break
      
    default:
      // По умолчанию - последние 6 месяцев
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
        months.push(date.toLocaleDateString('hy-AM', { month: 'short' }))
        
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1)
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0)
        
        const monthTransactions = await prisma.transaction.findMany({
          where: {
            userId,
            type: 'income',
            createdAt: {
              gte: monthStart,
              lte: monthEnd
            }
          }
        })
        
        earnings.push(monthTransactions.reduce((sum, t) => sum + t.amount, 0))
      }
  }

  return { labels: months, data: earnings }
}

async function getCategoryEarningsData(userId: string, period: string) {
  const now = new Date()
  let dateFilter: any = {}
  
  // Определяем период для фильтрации
  switch (period) {
    case 'month':
      dateFilter = {
        gte: new Date(now.getFullYear(), now.getMonth(), 1)
      }
      break
    case 'quarter':
      const quarterStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1)
      dateFilter = { gte: quarterStart }
      break
    case 'year':
      dateFilter = { gte: new Date(now.getFullYear(), 0, 1) }
      break
  }

  // Получаем проекты с категориями
  const projects = await prisma.project.findMany({
    where: {
      userId,
      ...(Object.keys(dateFilter).length > 0 && { createdAt: dateFilter })
    },
    select: {
      category: true,
      budget: true
    }
  })

  // Группируем по категориям
  const categoryMap = new Map<string, number>()
  
  projects.forEach(project => {
    const category = project.category || 'other'
    const current = categoryMap.get(category) || 0
    categoryMap.set(category, current + (project.budget || 0))
  })

  // Форматируем для графика
  const labels = Array.from(categoryMap.keys()).map(cat => {
    switch (cat) {
      case 'frontend': return 'Վեբ Զարգացում'
      case 'backend': return 'Backend Զարգացում'
      case 'mobile': return 'Մոբայլ Զարգացում'
      case 'design': return 'Դիզայն'
      case 'other': return 'Այլ'
      default: return cat
    }
  })
  
  const data = Array.from(categoryMap.values())

  return { labels, data }
}
