import { Request } from 'express';
import { JwtUserPayload } from '../types/jwt-user-payload.type';

export interface AuthorizedRequest extends Request {
  user: JwtUserPayload;
}
