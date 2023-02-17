import { HttpException, HttpStatus } from '@nestjs/common';
export class InvalidDateException extends HttpException {
  constructor() {
    super('Invalid date!', HttpStatus.BAD_REQUEST);
  }
}
