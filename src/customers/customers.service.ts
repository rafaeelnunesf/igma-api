import { Injectable } from '@nestjs/common';
import { Customer, Prisma } from '@prisma/client';
import { PrismaService } from '../config/prisma.service';
import cpfValidation from '../validation/cpf.validation';
import {
  CustomerNotFoundException,
  DuplicateCpfException,
  InsufficientFieldsException,
  InvalidCpfException,
  InvalidDateException,
} from './errors/';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.CustomerCreateInput): Promise<Customer> {
    if (!data.birthday || !data.cpf || !data.name) {
      throw new InsufficientFieldsException();
    }

    if (!cpfValidation(data.cpf)) throw new InvalidCpfException();

    const existentCPF = await this.prisma.customer.findUnique({
      where: { cpf: data.cpf },
    });

    if (existentCPF) throw new DuplicateCpfException();

    const date = this.stringToDate(data.birthday);

    return this.prisma.customer.create({
      data: {
        ...data,
        birthday: date,
      },
    });
  }

  async findAll(params): Promise<Customer[]> {
    let { limit, page } = params;

    if (params.limit) limit = parseInt(params.limit);
    else limit = 10;

    if (params.page) page = parseInt(params.page);
    else page = 1;

    const offset = (page - 1) * limit;

    return this.prisma.customer.findMany({
      skip: offset,
      take: limit,
    });
  }

  async findOne(cpf: string): Promise<Customer> {
    const customer = await this.prisma.customer.findUnique({
      where: { cpf },
    });

    if (!customer) throw new CustomerNotFoundException();

    return customer;
  }

  stringToDate(date) {
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
