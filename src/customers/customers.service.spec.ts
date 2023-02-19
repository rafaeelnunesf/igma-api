import { Test, TestingModule } from '@nestjs/testing';
import { Prisma, PrismaClient } from '@prisma/client';
import { CustomersService } from './customers.service';
import { PrismaService } from '../config/prisma.service';
import { ConfigService } from '../config/config.service';
import generateCpf from '../utils/generate-cpf';

import {
  CustomerNotFoundException,
  DuplicateCpfException,
  InsufficientFieldsException,
  InvalidCpfException,
  InvalidDateException,
} from './errors/';

describe('CustomersService', () => {
  const config = new ConfigService();
  let service: CustomersService;
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: config.get('DATABASE_URL'),
      },
    },
  });

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomersService, PrismaService],
    }).compile();

    service = module.get<CustomersService>(CustomersService);
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.customer.deleteMany();
    await prisma.$disconnect();
  });

  afterEach(async () => {
    await prisma.customer.deleteMany();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('CustomersService =>a create method', () => {
    it('should create and return a customer successfuly', async () => {
      //Arrange
      const data: Prisma.CustomerCreateInput = {
        name: 'Rafael',
        cpf: generateCpf(),
        birthday: '25/08/1998',
      };

      const customer = await service.create(data);

      expect(customer).toBeDefined();
      expect(customer.cpf).toEqual(data.cpf);
      expect(customer.name).toEqual(data.name);
      expect(customer.birthday).toEqual(new Date('1998-08-25T03:00:00.000Z'));
    });
    it('should return an error if a invalid date is passed', async () => {
      //Arrange
      const data: Prisma.CustomerCreateInput = {
        name: 'Rafael',
        cpf: generateCpf(),
        birthday: '35/08/1998',
      };

      try {
        await service.create(data);
      } catch (error) {
        expect(error).toEqual(new InvalidDateException());
      }
    });
    it('should return an error if a invalid date is passed in a wrong format', async () => {
      //Arrange
      const data: Prisma.CustomerCreateInput = {
        name: 'Rafael',
        cpf: generateCpf(),
        birthday: 'wrong format',
      };

      try {
        await service.create(data);
      } catch (error) {
        expect(error).toEqual(new InvalidDateException());
      }
    });
    it('should return an error when field cpf is duplicated', async () => {
      //Arrange
      const data: Prisma.CustomerCreateInput = {
        name: 'Rafael',
        cpf: generateCpf(),
        birthday: '25/08/1998',
      };

      try {
        await service.create(data);
        await service.create(data);
      } catch (error) {
        expect(error).toEqual(new DuplicateCpfException());
      }
    });
    it('should return an error with http status 400 when field cpf is not passed', async () => {
      //Arrange
      const data: Prisma.CustomerCreateInput = {
        name: 'Rafael',
        cpf: null,
        birthday: '25/08/1998',
      };

      try {
        //Act
        await service.create(data);
      } catch (error) {
        //Assert
        expect(error).toEqual(new InsufficientFieldsException());
      }
    });
    it('should return an error with http status 400 when field name is not passed', async () => {
      //Arrange
      const data: Prisma.CustomerCreateInput = {
        name: null,
        cpf: generateCpf(),
        birthday: '25/08/1998',
      };

      try {
        //Act
        await service.create(data);
      } catch (error) {
        //Assert
        expect(error).toEqual(new InsufficientFieldsException());
      }
    });
    it('should return an error when field cpf is invalid', async () => {
      //Arrange
      const data: Prisma.CustomerCreateInput = {
        name: 'Rafael',
        cpf: 'invalid cpf',
        birthday: '25/08/1998',
      };

      try {
        //Act
        await service.create(data);
      } catch (error) {
        //Assert
        expect(error).toEqual(new InvalidCpfException());
      }
    });
    it('should return an error with http status 400 when field name is not passed', async () => {
      //Arrange
      const data: Prisma.CustomerCreateInput = {
        name: 'Rafael',
        cpf: generateCpf(),
        birthday: null,
      };

      try {
        //Act
        await service.create(data);
      } catch (error) {
        //Assert
        expect(error).toEqual(new InsufficientFieldsException());
      }
    });
  });
  describe('CustomersService => findAll method', () => {
    it('should create and return an array of customers successfuly', async () => {
      //Arrange
      await prisma.customer.create({
        data: {
          name: 'Rafael',
          cpf: generateCpf(),
          birthday: new Date('2000-01-01'),
        },
      });
      await prisma.customer.create({
        data: {
          name: 'Rafael',
          cpf: generateCpf(),
          birthday: new Date('2000-01-01'),
        },
      });

      //Act
      const test = await service.findAll();

      //Assert
      expect(test).toBeDefined();
      expect(test).toHaveLength(2);
    });
    it('should create and return an array of customers with pagination successfuly', async () => {
      //Arrange
      await prisma.customer.create({
        data: {
          name: 'Rafael',
          cpf: generateCpf(),
          birthday: new Date('2000-01-01'),
        },
      });
      await prisma.customer.create({
        data: {
          name: 'Rafael',
          cpf: generateCpf(),
          birthday: new Date('2000-01-01'),
        },
      });

      const params = { limit: '1', page: '1' };
      //Act
      const test = await service.findAll(params);

      //Assert
      expect(test).toBeDefined();
      expect(test).toHaveLength(1);
    });
  });
  describe('CustomersService => findOne method', () => {
    it('should create and return an unique existent customer', async () => {
      //Arrange
      const data: Prisma.CustomerCreateInput = {
        name: 'Rafael',
        cpf: generateCpf(),
        birthday: new Date('2000-01-01'),
      };

      await prisma.customer.create({ data });

      const test = await service.findOne(data.cpf);

      expect(test).toBeDefined();
      expect(test.cpf).toEqual(data.cpf);
    });
    it('should return an error if a non-existent cpf is passed', async () => {
      //Arrange
      const nonExistentCPF = generateCpf();

      try {
        await service.findOne(nonExistentCPF);
      } catch (error) {
        expect(error).toEqual(new CustomerNotFoundException());
      }
    });
  });
});
