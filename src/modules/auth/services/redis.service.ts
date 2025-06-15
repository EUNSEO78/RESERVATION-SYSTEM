import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  // 저장
  async set(key: string, value: string, ttlSeconds: number) {
    await this.redis.set(key, value, 'EX', ttlSeconds);
  }

  // 조회
  async get(key: string): Promise<string | null> {
    return await this.redis.get(key);
  }

  // 삭제
  async del(key: string): Promise<void> {
    await this.redis.del(key);
  }
}
