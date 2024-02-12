class HttpCustomError extends Error {
  statusCode: number;
  url: string | undefined;
  method: string | undefined;
  route: string;
  reason: string;
  details: string | undefined;

  constructor(
    statusCode: number,
    url: string | undefined,
    method: string | undefined,
    reason: string,
    details?: string | undefined,
  ) {
    super(`HTTP Error ${statusCode}: ${reason}`);
    this.statusCode = statusCode;
    this.reason = reason;
    this.url = url;
    this.method = method;
    this.details = details;
  }

  toJSON(): Record<string, string | undefined | number | object> {
    return {
      statusCode: this.statusCode,
      error: {
        reason: this.reason,
        details: this.details,
        url: this.url,
        method: this.method,
      },
    };
  }
}

export { HttpCustomError };
