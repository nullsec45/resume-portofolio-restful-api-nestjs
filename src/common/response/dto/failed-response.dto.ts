export class FailedResponseDto {
  /**
   * The HTTP status code of the response.
   *
   * @example 400
   */
  statusCode: number;

  /**
   * The message accompanying the response, if any.
   *
   * @example "Bad Request"
   */
  message: string | null;

  /**
   * The error message describing the reason for the failure.
   *
   * @example "Invalid input"
   */
  error: string;
}
