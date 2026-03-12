class AppError {
  message: string;
  statusCode: number;

  constructor(message: string, statuscode: number) {
    this.message = message;
    this.statusCode = statuscode;
  }
}

export { AppError };
