import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET_KEY,
  tokenTtl: Number(process.env.JWT_TOKEN_TTL_IN_SECONDS) ?? 3600,
}));
