import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';

@Injectable()
export class HashingService {
  async hashPassword(password: string): Promise<string> {
    return argon2.hash(password);
  }

  async comparePassword(
    password: string,
    storedPasswordHash: string,
  ): Promise<boolean> {
    return argon2.verify(storedPasswordHash, password);
  }
}
