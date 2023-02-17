import { HttpException, HttpStatus } from '@nestjs/common';
export class InvalidCpfException extends HttpException {
  constructor() {
    super('Invalid CPF!', HttpStatus.BAD_REQUEST);
  }
}
