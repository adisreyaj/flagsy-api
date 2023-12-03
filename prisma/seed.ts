import { FeatureValueType, PrismaClient } from '@prisma/client';
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

  const FEATURES = [
    {
      id: 'clpns82nv0000jgwyl0fuxc4e',
      key: 'google-login',
      type: FeatureValueType.BOOLEAN,
      projectId: 'clpns61fm00029ixc3qq0bj9e',
      description: 'Enable google based login.',
      value: false,
    },
    {
      id: 'clpnudkn40003g9547wdqdz3l',
      key: 'saml',
      type: FeatureValueType.BOOLEAN,
      projectId: 'clpns61fm00029ixc3qq0bj9e',
      description: 'Saml based SSO.',
      value: true,
    },
    {
      id: 'clpo2wlza0001ji7zxe44cb6n',
      key: 'agent-version',
      type: FeatureValueType.STRING,
      projectId: 'clpns61fm00029ixc3qq0bj9e',
      description: '',
      value: '2.1',
    },
    {
      id: 'clpo30jov0003ji7zgah0zgn2',
      key: 'licence-count',
      type: FeatureValueType.NUMBER,
      projectId: 'clpns61fm00029ixc3qq0bj9e',
      description: 'Total allocated licences.',
      value: '100',
    },
  ];

  await prisma.feature.createMany({
    data: FEATURES.map((feature) => ({
      id: feature.id,
      key: feature.key,
      type: feature.type,
      description: feature.description,
      value: feature.value,
      projectId: PROJECT_ID,
      ownerId: USER_ID,
      orgId: ORG_ID,
    })),
  });
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
