import { Payload } from './payload';

export interface CustomRequest extends Request {
  user?: Payload;
}
