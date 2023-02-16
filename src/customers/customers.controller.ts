import { Controller, Get, Post, Body, Param } from '@nestjs/common';
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
  findAll(): Promise<Customer[]> {
    return this.customersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Customer> {
    return this.customersService.findOne(id);
  }
}
