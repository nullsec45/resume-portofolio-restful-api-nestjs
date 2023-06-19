export class SuccessfulSignInDto {
  /**
   * JWT access token.
   *
   * @example "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInVzZXJuYW1lIjoidXNlcjEyMyIsImlhdCI6MTY4NzE2MDk5NiwiZXhwIjoxNjg3MTY0NTk2fQ.hClzHOAHe-_yqUzd56TWhEyF7K3NBfdEjwgySWxFSaE"
   */
  accessToken: string;

  constructor({ accessToken }: SuccessfulSignInDto) {
    this.accessToken = accessToken;
  }
}
