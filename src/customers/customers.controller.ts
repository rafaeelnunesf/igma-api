import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { Customer, Prisma } from '@prisma/client';
import { CustomersService } from './customers.service';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  create(@Body() data: Prisma.CustomerCreateInput): Promise<Customer> {
    return this.customersService.create(data);
  }

  @Get()
  findAll(@Query() params): Promise<Customer[]> {
    return this.customersService.findAll(params);
  }

  @Get(':cpf')
  findOne(@Param('cpf') cpf: string): Promise<Customer> {
    return this.customersService.findOne(cpf);
  }
}
