import prisma from '../src/prisma.js'

async function main() {
  await prisma.company.createMany({
    data: [
      { name: 'Google', industry: 'Tech', revenue: 280000 },
      { name: 'Amazon', industry: 'E-commerce', revenue: 500000 },
      { name: 'Microsoft', industry: 'Software', revenue: 211000 }
    ],
    skipDuplicates: true
  })

  console.log(' Seed data inserted')
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })