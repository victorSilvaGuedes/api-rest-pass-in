import { prisma } from './../src/lib/prisma'

async function seed() {
  await prisma.event.create({
    data: {
      id: '5d5f5285-c811-4b25-af59-ab69e4f7bbb3',
      title: 'Unite Summit',
      slug: 'unite-summit',
      details: 'Um evento p/ devs apaixonados(as) por código!',
      maximumAttendees: 120,
    },
  })
}

seed().then(() => {
  console.log('Database seeded!')
  prisma.$disconnect()
})
