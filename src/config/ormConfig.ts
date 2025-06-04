import { TypeOrmModuleOptions } from '@nestjs/typeorm';
// 환경변수를 사용하기 위해 dotenv 패키지 사용
import * as dotenv from 'dotenv';
dotenv.config();

export const ormConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT ?? '3306'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [__dirname + '/../modules/**/*.entity.{ts,js}'], // 엔티티 경로 설정
  synchronize: true, // 개발 시 true, 배포할때 false로 변경하기
};
