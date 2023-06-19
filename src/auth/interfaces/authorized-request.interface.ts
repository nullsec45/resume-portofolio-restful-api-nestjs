import { Request } from 'express';
import { JwtUserPayloadDto } from '../dto/jwt-user-payload.dto';

export interface AuthorizedRequest extends Request {
  user: JwtUserPayloadDto;
}
