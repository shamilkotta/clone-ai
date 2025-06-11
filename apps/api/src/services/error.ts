class ErrorResponse extends Error {
  status: number;
  data?: object;
  constructor(status: number, message: string, data?: object) {
    super(message);
    this.status = status;
    this.message = message;
    this.data = data;
  }

  static badRequest(msg: string) {
    return new ErrorResponse(400, msg);
  }

  static unauthorized(msg: string) {
    return new ErrorResponse(401, msg);
  }

  static forbidden(msg: string) {
    return new ErrorResponse(403, msg);
  }

  static notFound(msg = "Not found") {
    return new ErrorResponse(404, msg);
  }

  static internalError(msg: string) {
    return new ErrorResponse(500, msg);
  }
}

export default ErrorResponse;
