import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Очищаем базу данных
  await prisma.review.deleteMany()
  await prisma.session.deleteMany()
  await prisma.application.deleteMany()
  await prisma.project.deleteMany()
  await prisma.user.deleteMany()

  console.log('🗑️  Database cleared')

  // Создаем пользователей
  // Администратор
  const adminEmail = process.env.ADMIN_EMAIL || 'qaramyanv210@gmail.com'
  const adminPassword = process.env.ADMIN_PASSWORD || 'Ren191909@'
  const adminHashed = '$2b$12$iQHtW9Wfopx82wi8g/mLAuh0eg1xZ6EbTsfpUNwjzyrKHkeTPPOcq'
  try {
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: adminPassword === 'password123' ? adminHashed : adminHashed,
        fullName: 'Admin',
        userType: 'client',
        experienceLevel: 'expert',
        skills: JSON.stringify(['Administration']),
        emailVerified: true,
        verificationToken: null,
      }
    })
  } catch {}
  const client = await prisma.user.create({
    data: {
      email: 'client@example.com',
      password: '$2b$12$iQHtW9Wfopx82wi8g/mLAuh0eg1xZ6EbTsfpUNwjzyrKHkeTPPOcq', // password123
      fullName: 'John Client',
      userType: 'client',
      experienceLevel: 'intermediate',
      skills: JSON.stringify(['Project Management', 'Business Analysis'])
    }
  })

  const mentor = await prisma.user.create({
    data: {
      email: 'mentor@example.com',
      password: '$2b$12$iQHtW9Wfopx82wi8g/mLAuh0eg1xZ6EbTsfpUNwjzyrKHkeTPPOcq', // password123
      fullName: 'Sarah Mentor',
      userType: 'mentor',
      experienceLevel: 'expert',
      skills: JSON.stringify(['React', 'Node.js', 'TypeScript', 'Mentoring']),
      bio: 'Senior Full Stack Developer with 8+ years of experience'
    }
  })

  const newcomer = await prisma.user.create({
    data: {
      email: 'newcomer@example.com',
      password: '$2b$12$iQHtW9Wfopx82wi8g/mLAuh0eg1xZ6EbTsfpUNwjzyrKHkeTPPOcq', // password123
      fullName: 'Alex Newcomer',
      userType: 'newcomer',
      experienceLevel: 'beginner',
      skills: JSON.stringify(['HTML', 'CSS', 'JavaScript'])
    }
  })

  console.log('👥 Users created')

  // Создаем проекты
  const project1 = await prisma.project.create({
    data: {
      title: 'E-commerce Website',
      description: 'Modern e-commerce website with React frontend and Node.js backend',
      projectType: 'Web Development',
      requiredSkills: JSON.stringify(['React', 'Node.js', 'MongoDB']),
      budgetMin: 2000,
      budgetMax: 5000,
      durationWeeks: 8,
      difficultyLevel: 'intermediate',
      clientId: client.id
    }
  })

  const project2 = await prisma.project.create({
    data: {
      title: 'Mobile App Design',
      description: 'UI/UX design for a fitness tracking mobile application',
      projectType: 'Design',
      requiredSkills: JSON.stringify(['Figma', 'UI/UX Design', 'Prototyping']),
      budgetMin: 1500,
      budgetMax: 3000,
      durationWeeks: 6,
      difficultyLevel: 'beginner',
      clientId: client.id
    }
  })

  console.log('📁 Projects created')

  // Создаем заявки
  await prisma.application.create({
    data: {
      projectId: project1.id,
      userId: newcomer.id,
      coverLetter: 'I am excited to work on this e-commerce project. I have been learning React and Node.js for the past 6 months and would love to apply my skills.',
      proposedTimeline: 10
    }
  })

  console.log('📝 Applications created')

  // Создаем сессии
  await prisma.session.create({
    data: {
      mentorId: mentor.id,
      userId: newcomer.id,
      startTime: new Date('2024-01-15T10:00:00Z'),
      endTime: new Date('2024-01-15T11:00:00Z'),
      notes: 'Code review session for React components'
    }
  })

  console.log('⏰ Sessions created')

  // Создаем отзывы
  await prisma.review.create({
    data: {
      reviewerId: newcomer.id,
      reviewedId: mentor.id,
      rating: 5,
      comment: 'Sarah is an excellent mentor! She helped me understand React concepts clearly and provided practical examples.'
    }
  })

  console.log('⭐ Reviews created')

  console.log('✅ Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
