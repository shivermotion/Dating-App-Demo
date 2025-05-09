import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { generateEmbedding } from '../server/src/services/ai';

const prisma = new PrismaClient();

async function seed() {
  console.log('🌱 Seeding database...');

  // Create 20 fake users
  const users = [];
  for (let i = 0; i < 20; i++) {
    const bio = faker.lorem.paragraph();
    const embedding = await generateEmbedding(bio);
    
    const user = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        name: faker.person.fullName(),
        bio,
        traits: {
          personality: faker.helpers.arrayElements(['Creative', 'Adventurous', 'Analytical', 'Empathetic', 'Organized'], 3),
          values: faker.helpers.arrayElements(['Family', 'Career', 'Travel', 'Learning', 'Health'], 2),
        },
        interests: faker.helpers.arrayElements(['Hiking', 'Cooking', 'Reading', 'Travel', 'Music', 'Art', 'Sports'], 4),
        embedding,
      },
    });
    users.push(user);
  }

  // Create some matches
  for (let i = 0; i < 10; i++) {
    const userA = users[Math.floor(Math.random() * users.length)];
    const userB = users[Math.floor(Math.random() * users.length)];
    
    if (userA.id !== userB.id) {
      await prisma.match.create({
        data: {
          userA: userA.id,
          userB: userB.id,
          score: Math.random(),
          status: faker.helpers.arrayElement(['pending', 'accepted', 'rejected']),
        },
      });
    }
  }

  console.log('✅ Database seeded!');
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 