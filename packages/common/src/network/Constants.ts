export const DEFAULT_API_TIMEOUT = 1000;
export const DEFAULT_ERROR_MESSAGE = 'Error from API Client';
export const NO_INTERNET_ERROR_MESSAGE = 'We’re having trouble connecting. Please check your internet connectivity!';
export const SESSION_EXPIRED_MESSAGE = 'Session Expired!! Please Login Again!';
export const TOKEN_NOT_VALID = 'token_not_valid';

export const HttpStatusCode = {
  Ok: 200,
  Created: 201,
  Accepted: 202,
  NoContent: 204,
  MovedPermanently: 301,
  MovedTemporarily: 302,
  NotModified: 304,
  TemporaryRedirect: 307,
  PermanentRedirect: 308,
  BadRequest: 400,
  Unauthorized: 401,
  Forbidden: 403,
  NotFound: 404,
  MethodNotAllowed: 405,
  Conflict: 409,
  Gone: 410,
  UnprocessableEntity: 422,
  TooManyRequests: 429,
  InternalServerError: 500,
  BadGateway: 502,
  ServiceUnavailable: 503,
  GatewayTimeout: 504,
};

export const HttpMethod = {
  GET: 'GET',
  HEAD: 'HEAD',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  CONNECT: 'CONNECT',
  OPTIONS: 'OPTIONS',
  TRACE: 'TRACE',
  PATCH: 'PATCH',
};
