import { registerAs } from '@nestjs/config';

export const jwtValue = registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET_KEY,
  tokenTtl: Number(process.env.JWT_TOKEN_TTL_IN_SECONDS) ?? 3600,
}));
