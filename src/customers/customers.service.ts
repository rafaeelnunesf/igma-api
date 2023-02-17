import { InvalidCpfException } from './exceptions/invalidCPF.excpetion';
import { InsufficientFieldsException } from './exceptions/insufficientFields.exception';
import { Injectable } from '@nestjs/common';
import { Customer, Prisma } from '@prisma/client';
import cpfValidation from '../validation/cpf.validation';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.CustomerCreateInput): Promise<Customer> {
    if (!data.birthday || !data.cpf || !data.name) {
      throw new InsufficientFieldsException();
    }

    if (!cpfValidation(data.cpf)) throw new InvalidCpfException();

    return this.prisma.customer.create({
      data: {
        ...data,
        birthday: date,
      },
    });
  }

  async findAll(): Promise<Customer[]> {
  }

  async findOne(cpf: string): Promise<Customer> {
  }
}
