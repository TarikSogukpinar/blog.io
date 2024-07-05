import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../../node_modules/@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    try {
      console.log('Connecting to database')
      await this.$connect();
    } catch (error) {
      console.log(error.message);
    }
  }
}
