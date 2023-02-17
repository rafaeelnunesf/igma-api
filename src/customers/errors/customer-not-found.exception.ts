import { HttpException, HttpStatus } from '@nestjs/common';
export class CustomerNotFoundException extends HttpException {
  constructor() {
    super('Customer not found!', HttpStatus.NOT_FOUND);
  }
}
