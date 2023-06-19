export class SuccessfulSignInDto {
  accessToken: string;

  constructor({ accessToken }: SuccessfulSignInDto) {
    this.accessToken = accessToken;
  }
}
