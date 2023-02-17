import { HttpException, HttpStatus } from '@nestjs/common';
export class InsufficientFieldsException extends HttpException {
  constructor() {
    super('You must enter all required fields', HttpStatus.BAD_REQUEST);
  }
}
