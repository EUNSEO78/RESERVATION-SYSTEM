import { Global, Module } from '@nestjs/common';
import { RedisModule as NestRedisModule } from '@nestjs-modules/ioredis';

@Global()
@Module({
  imports: [
    NestRedisModule.forRootAsync({
      useFactory: () => ({
        type: 'single',
        options: {
          host: process.env.REDIS_HOST || 'localhost',
          port: +(process.env.REDIS_PORT || 6379),
        },
      }),
    }),
  ],
  exports: [NestRedisModule],
})
export class RedisModule {}
