import { Test, TestingModule } from '@nestjs/testing';
import { Prisma, PrismaClient } from '@prisma/client';
import { CustomersService } from './customers.service';
import { PrismaService } from '../config/prisma.service';
import { ConfigService } from '../config/config.service';

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
    await prisma.$connect();
    await prisma.customer.deleteMany();
  });

  afterAll(async () => {
    await prisma.customer.deleteMany();
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomersService, PrismaService],
    }).compile();

    service = module.get<CustomersService>(CustomersService);
  });
  afterEach(async () => {
    await prisma.customer.deleteMany();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should create and return a customer successfuly', async () => {
    //Arrange
    const data: Prisma.CustomerCreateInput = {
      name: 'Rafael',
      cpf: '111.444.777-35',
      birthday: '25/08/1998',
    };

    const customer = await service.create(data);

    expect(customer).toBeDefined();
  });
  it('should create and return an array of customers successfuly', async () => {
    //Arrange
    const data1: Prisma.CustomerCreateInput = {
      name: 'Rafael',
      cpf: '111.444.777-35',
      birthday: '25-08-1998',
    };

    const data2: Prisma.CustomerCreateInput = {
      name: 'Rafael',
      cpf: '823.525.790-40',
      birthday: '25-08-1998',
    };

    await service.create(data1);
    await service.create(data2);

    const test = await service.findAll();

    expect(test).toBeDefined();
    expect(test).toHaveLength(2);
  });
  it('should create and return an unique existent customer', async () => {
    //Arrange
    const data: Prisma.CustomerCreateInput = {
      name: 'Rafael',
      cpf: '111.444.777-35',
      birthday: '25-08-1998',
    };

    await service.create(data);

    const test = await service.findOne(data.cpf);

    expect(test).toBeDefined();
    expect(test.cpf).toEqual(data.cpf);
  });
  it('should return an error if a non-existent cpf is passed', async () => {
    //Arrange
    const nonExistentCPF = '111.444.777-35';

    try {
      await service.findOne(nonExistentCPF);
    } catch (error) {
      expect(error).toEqual(new CustomerNotFoundException());
    }
  });
  it('should return an error if a invalid date is passed', async () => {
    //Arrange
    const data: Prisma.CustomerCreateInput = {
      name: 'Rafael',
      cpf: '111.444.777-35',
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
      cpf: '111.444.777-35',
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
      cpf: '111.444.777-35',
      birthday: '25/08/1998',
    };

    try {
      await service.create(data);
      await service.create(data);
    } catch (error) {
      expect(error).toEqual(new DuplicateCpfException());
    }
  });
  it('should return an error with http status 400 when field name is not passed', async () => {
    //Arrange
    const data: Prisma.CustomerCreateInput = {
      name: null,
      cpf: '111.444.777-35',
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
      cpf: '111.444.777-35',
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
