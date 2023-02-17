import { DuplicateCpfException } from './exceptions/duplicateCPF.exception';
import { InvalidCpfException } from './exceptions/invalidCPF.excpetion';
import { PrismaService } from '../prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { Prisma, PrismaClient } from '@prisma/client';
import { CustomersService } from './customers.service';
import { InsufficientFieldsException } from './exceptions/insufficientFields.exception';
import { ConfigService } from '../config/config.service';

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
