import { HttpException, HttpStatus } from '@nestjs/common';
export class InvalidDateException extends HttpException {
  constructor() {
    super(
      'Invalid date! Make sure you are entering the date in dd-mm-yyyy format.',
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }
}
