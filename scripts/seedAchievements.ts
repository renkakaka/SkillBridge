import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding achievements...')

  // Создаем достижения
  const achievements = [
    {
      title: 'Առաջին նախագիծ',
      description: 'Ավարտեք ձեր առաջին նախագիծը',
      points: 50,
      icon: '🎯',
      category: 'project'
    },
    {
      title: 'Փորձառու մշակող',
      description: 'Ավարտեք 5 նախագիծ',
      points: 100,
      icon: '🚀',
      category: 'project'
    },
    {
      title: 'Մասնագետ',
      description: 'Ավարտեք 10 նախագիծ',
      points: 200,
      icon: '🏆',
      category: 'project'
    },
    {
      title: 'Լավ գնահատական',
      description: 'Ստացեք 5-աստղանի գնահատական',
      points: 75,
      icon: '⭐',
      category: 'rating'
    },
    {
      title: 'Հաճախորդների սիրելին',
      description: 'Ստացեք 10 դրական գնահատական',
      points: 150,
      icon: '❤️',
      category: 'rating'
    },
    {
      title: 'Հմտությունների մասնագետ',
      description: 'Հասեք 90% մակարդակի 3 հմտություններում',
      points: 120,
      icon: '🎨',
      category: 'skill'
    },
    {
      title: 'Կապի մասնագետ',
      description: 'Ուղարկեք 50 հաղորդագրություն',
      points: 80,
      icon: '💬',
      category: 'communication'
    },
    {
      title: 'Ժամանակի կառավարիչ',
      description: 'Ավարտեք նախագիծը ժամանակից շուտ',
      points: 90,
      icon: '⏰',
      category: 'time'
    },
    {
      title: 'Ֆինանսական հաջողություն',
      description: 'Հասեք $1000 եկամուտի',
      points: 100,
      icon: '💰',
      category: 'finance'
    },
    {
      title: 'Բարձր եկամուտ',
      description: 'Հասեք $5000 եկամուտի',
      points: 200,
      icon: '💎',
      category: 'finance'
    },
    {
      title: 'Նորեկ',
      description: 'Միանալ SkillBridge-ին',
      points: 25,
      icon: '👋',
      category: 'welcome'
    },
    {
      title: 'Պրոֆիլի կառավարիչ',
      description: 'Լրացրեք ձեր պրոֆիլը 100%-ով',
      points: 60,
      icon: '📝',
      category: 'profile'
    },
    {
      title: 'Սոցիալական ակտիվ',
      description: 'Ունեցեք 100 դիտում ձեր պրոֆիլում',
      points: 70,
      icon: '👁️',
      category: 'social'
    },
    {
      title: 'Հետադարձ կապ',
      description: 'Պատասխանեք հաճախորդի հաղորդագրությանը 24 ժամվա ընթացքում',
      points: 40,
      icon: '⚡',
      category: 'communication'
    },
    {
      title: 'Գաղափարների աղբյուր',
      description: 'Ներկայացրեք 5 նախագծի առաջարկ',
      points: 85,
      icon: '💡',
      category: 'innovation'
    }
  ]

  for (const achievement of achievements) {
    await prisma.achievement.upsert({
      where: { id: achievement.title }, // Using title as id for simplicity
      update: {},
      create: {
        ...achievement,
        id: achievement.title // Set id to title for upsert to work
      }
    })
  }

  console.log(`✅ Created ${achievements.length} achievements`)

  // Создаем несколько уровней для примера
  const levels = [
    { level: 1, title: 'Նորեկ', description: 'Սկսեք ձեր ճանապարհը', requiredPoints: 0 },
    { level: 2, title: 'Սկսնակ', description: 'Դուք արդեն իմանում եք հիմունքները', requiredPoints: 100 },
    { level: 3, title: 'Փորձառու', description: 'Ձեր փորձը աճում է', requiredPoints: 250 },
    { level: 4, title: 'Մասնագետ', description: 'Դուք դարձել եք մասնագետ', requiredPoints: 500 },
    { level: 5, title: 'Վարպետ', description: 'Դուք վարպետ եք ձեր ոլորտում', requiredPoints: 1000 },
    { level: 6, title: 'Գուրու', description: 'Դուք ուսուցանում եք ուրիշներին', requiredPoints: 2000 },
    { level: 7, title: 'Լեգենդ', description: 'Ձեր անունը հայտնի է բոլորին', requiredPoints: 5000 }
  ]

  console.log('🌱 Seeding levels...')

  for (const level of levels) {
    await prisma.level.upsert({
      where: { level: level.level },
      update: {},
      create: {
        level: level.level,
        title: level.title,
        description: level.description,
        requiredPoints: level.requiredPoints
      }
    })
  }

  console.log(`✅ Created ${levels.length} levels`)

  console.log('🎉 Database seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
