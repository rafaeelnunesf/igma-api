import { HttpException, HttpStatus } from '@nestjs/common';
export class NotFoundCustomerException extends HttpException {
  constructor() {
    super('Customer not found!', HttpStatus.NOT_FOUND);
  }
}
