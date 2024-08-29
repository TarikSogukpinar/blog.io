import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Redis } from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private redisClient: Redis;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    try {
      const redisConnectionUrl = this.configService.get<string>('REDIS_HOST');
      this.redisClient = new Redis(redisConnectionUrl);
      console.log('Redis connected successfully');
    } catch (error) {
      console.error('Failed to connect to Redis', error);
    }
  }

  async onModuleDestroy() {
    await this.redisClient.quit();
  }

  async getClient(): Promise<Redis> {
    return this.redisClient;
  }

  async setValue(key: string, value: string, ttl?: number) {
    if (ttl) {
      return await this.redisClient.set(key, value, 'EX', ttl);
    }
    return await this.redisClient.set(key, value);
  }

  async getValue(key: string) {
    return await this.redisClient.get(key);
  }

  async deleteKey(key: string) {
    return await this.redisClient.del(key);
  }
}
