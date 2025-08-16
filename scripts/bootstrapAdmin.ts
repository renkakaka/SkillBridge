import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = 'qaramyanv210@gmail.com'
  const password = 'Ren191909@'
  const fullName = 'Admin'
  const userType: 'client' | 'mentor' | 'newcomer' | 'admin' = 'admin'

  const hashedPassword = await bcrypt.hash(password, 12)

  const existing = await prisma.user.findUnique({ where: { email } })

  if (existing) {
    await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        fullName,
        userType,
        emailVerified: true,
        verificationToken: null,
      }
    })
    console.log('✅ Admin updated & verified:', email)
  } else {
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName,
        userType,
        experienceLevel: 'expert',
        skills: JSON.stringify(['Administration']),
        emailVerified: true,
        verificationToken: null,
      }
    })
    console.log('✅ Admin created & verified:', email)
  }
}

main()
  .catch((e) => { console.error('❌ Error:', e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
