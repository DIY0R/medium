class ApiError extends Error {
  constructor(readonly status: number, readonly message: string) {
    super();
  }

  static badRequest(message: string) {
    return new ApiError(404, message);
  }

  static internal(message: string) {
    return new ApiError(500, message);
  }

  static forbidden(message: string) {
    return new ApiError(403, message);
  }
  static clientError(message: string) {
    return new ApiError(400, message);
  }
}

export default ApiError;
