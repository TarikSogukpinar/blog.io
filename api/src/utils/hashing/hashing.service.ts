import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class HashingService {
  async hashPassword(
    password: string,
    saltRounds: number = 10,
  ): Promise<string> {
    const salt = await bcrypt.genSalt(saltRounds);
    return bcrypt.hash(password, salt);
  }

  async comparePassword(
    password: string,
    storedPasswordHash: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, storedPasswordHash);
  }
}
