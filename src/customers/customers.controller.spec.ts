import { CustomersController } from './customers.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../config/prisma.service';
import * as request from 'supertest';
import { CustomersService } from './customers.service';
import { Customer, Prisma, PrismaClient } from '@prisma/client';
import { ConfigService } from '../config/config.service';

describe('CustomersController', () => {
  let controller: CustomersController;
  let service: CustomersService;
  let app;
  const config = new ConfigService();
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
      controllers: [CustomersController],
      providers: [CustomersService, PrismaService],
    }).compile();

    controller = module.get<CustomersController>(CustomersController);
    service = module.get<CustomersService>(CustomersService);
    app = module.createNestApplication();
    await app.init();
    await prisma.customer.deleteMany();
  });

  afterEach(async () => {
    await prisma.customer.deleteMany();
    await app.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a customer', async () => {
      const response = await request(app.getHttpServer())
        .post('/customers')
        .send({
          name: 'name',
          cpf: '111.444.777-35',
          birthday: '25-08-1998',
        })
        .expect(201);

      const createdCustomer = response.body;

      expect(createdCustomer.name).toEqual('name');
      expect(createdCustomer.cpf).toEqual('111.444.777-35');
      expect(createdCustomer.birthday).toEqual('1998-08-25T03:00:00.000Z');
    });
  });

  describe('findAll', () => {
    it('should return an array of customers', async () => {
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

      const response = await request(app.getHttpServer())
        .get('/customers')
        .expect(200);

      const customers: Customer[] = response.body;

      expect(customers).toBeInstanceOf(Array);
      expect(customers.length).toBeGreaterThan(0);
    });
  });

  describe('findOne', () => {
    it('should return a customer with the given CPF', async () => {
      const customer: Customer = await service.create({
        name: 'name',
        cpf: '111.444.777-35',
        birthday: '25-08-1998',
      });

      const response = await request(app.getHttpServer())
        .get(`/customers/${customer.cpf}`)
        .expect(200);

      const foundCustomer = response.body;

      expect(foundCustomer.name).toEqual('name');
      expect(foundCustomer.cpf).toEqual('111.444.777-35');
      expect(foundCustomer.birthday).toEqual('1998-08-25T03:00:00.000Z');
    });
  });
});
