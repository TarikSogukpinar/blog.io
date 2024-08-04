import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import validate = require('uuid-validate');

@Injectable()
export class UuidService {
  generateUuid(): string {
    return uuidv4();
  }

  async validateUuid(uuid: string) {
    return validate(uuid);
  }
}
