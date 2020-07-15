export class ErrorHandler extends Error {
  constructor(statusCode: number, message: string) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }

  statusCode: number;
}
