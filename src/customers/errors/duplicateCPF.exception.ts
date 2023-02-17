import { HttpException, HttpStatus } from '@nestjs/common';
export class DuplicateCpfException extends HttpException {
  constructor() {
    super('This CPF is already registered!', HttpStatus.CONFLICT);
  }
}
