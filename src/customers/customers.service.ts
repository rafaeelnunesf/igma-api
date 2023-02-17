import { InvalidCpfException } from './exceptions/invalidCPF.excpetion';
import { InsufficientFieldsException } from './exceptions/insufficientFields.exception';
import { Injectable } from '@nestjs/common';
import { Customer, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { InvalidDateException } from './exceptions/invalidDate.exception';
import cpfValidation from '../validation/cpf.validation';
import { DuplicateCpfException } from './exceptions/duplicateCPF.exception';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.CustomerCreateInput): Promise<Customer> {
    if (!data.birthday || !data.cpf || !data.name) {
      throw new InsufficientFieldsException();
    }

    if (!cpfValidation(data.cpf)) throw new InvalidCpfException();

    const existentCPF = await this.findOne(data.cpf);
    if (existentCPF) throw new DuplicateCpfException();

    const date = this.string2Date(data.birthday);

    return this.prisma.customer.create({
      data: {
        ...data,
        birthday: date,
      },
    });
  }

  async findAll(): Promise<Customer[]> {
    return this.prisma.customer.findMany({});
  }

  async findOne(cpf: string): Promise<Customer> {
    return this.prisma.customer.findUnique({
      where: { cpf },
    });
  }

  string2Date(date) {
    const match = /^(\d{2})([-\/.]?)(\d{2})\2(\d{4})$/.exec(date);

    if (match) {
      const day = parseInt(match[1]);
      const month = parseInt(match[3]);
      const year = parseInt(match[4]);

      const validDate = new Date(year, month - 1, day);

      const validation =
        validDate.getFullYear() == year &&
        validDate.getMonth() + 1 == month &&
        validDate.getDate() == day;

      if (!validation) throw new InvalidDateException();

      return validDate;
    } else {
      throw new InvalidDateException();
    }
  }
}
