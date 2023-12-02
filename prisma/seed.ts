import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import cuid from 'cuid';

const prisma = new PrismaClient();

async function main() {
  const USER_ID = cuid();
  const ORG_ID = cuid();
  const hashedPassword = await bcrypt.hash('password', 10);
  const user = await prisma.user.create({
    data: {
      id: USER_ID,
      firstName: 'John',
      lastName: 'Doe',
      email: 'hi@adi.so',
      password: hashedPassword,
      orgs: {
        create: {
          id: ORG_ID,
          name: 'Adi',
          key: 'adi',
        },
      },
    },
  });

  console.log('User created', { user });

  const PROJECT_ID = cuid();
  const project = await prisma.project.create({
    data: {
      id: PROJECT_ID,
      key: 'flagsy',
      name: 'Flagsy',
      ownerId: USER_ID,
      orgId: ORG_ID,
    },
  });

  console.log('Project created', { project });

  const ENVIRONMENT_ID = cuid();
  const environment = await prisma.environment.create({
    data: {
      id: ENVIRONMENT_ID,
      key: 'production',
      name: 'Production',
      projectId: PROJECT_ID,
      ownerId: USER_ID,
      orgId: ORG_ID,
    },
  });
  console.log('Environment created', { environment });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
