import { PrismaClient } from '@prisma/client';
import { ConfigService } from 'src/config/config.service';
import generateCpf from '../src/utils/generate-cpf';
const config = new ConfigService();
const prisma = new PrismaClient({
  datasources: { db: { url: config.get('DATABASE_URL') } },
});
async function main(): Promise<void> {
  const numberOfCustomers = 17;
  const arrayOfCpfs: string[] = [];

  for (let i = 0; i < numberOfCustomers; i++) {
    arrayOfCpfs.push(generateCpf());
  }

  for (const [index, cpf] of Object.entries(arrayOfCpfs)) {
    await prisma.customer.upsert({
      where: { cpf },
      update: {},
      create: {
        cpf,
        name: `customer${index}`,
        birthday: new Date('2000-01-01'),
      },
    });
  }
}
main()
  .then(async (): Promise<void> => {
    await prisma.$disconnect();
  })
  .catch(async (e): Promise<void> => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
