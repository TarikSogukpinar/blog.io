import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    try {
      console.log('Connecting to database');
      await this.$connect();
    } catch (error) {
      console.error('Error connecting to the database:', error.message);
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
    } catch (error) {
      console.error('Error disconnecting from the database:', error.message);
    }
  }
}
