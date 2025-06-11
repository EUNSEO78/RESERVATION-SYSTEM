import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { access } from 'fs';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  // ✅ 로그인 및 토큰 발급
  // 사용자 정보와 함께 JWT 토큰을 생성하고, 리프레시 토큰을 DB에 저장
  async login(user: any) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    const acccessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET || 'access',
      expiresIn: process.env.JWT_ACCESS_EXPIRATION,
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET || 'refresh',
      expiresIn: process.env.JWT_REFRESH_EXPIRATION,
    });
    await this.userRepository.update(user.id, { refreshToken });

    return {
      acccessToken,
      refreshToken,
    };
  }

  // ✅ 로그인 시 사용자 검증
  async validateUser(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('이메일 또는 비밀번호가 잘못되었습니다.');
    }
    const isSame = await bcrypt.compare(password, user.password);
    if (!isSame) {
      throw new UnauthorizedException('이메일 또는 비밀번호가 잘못되었습니다.');
    }
    return user;
  }

  // ✅ 로그인 후 토큰 갱신
  // 리프레시 토큰 비교하여 새로운 액세스 토큰 발급
  async refreshTokens(refreshToken: string) {
    try {
      const payload = await this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
      const user = await this.userRepository.findOne({
        where: { id: payload.sub },
      });
      if (!user || user.refreshToken !== refreshToken) {
        throw new UnauthorizedException('유효하지 않은 리프레시 토큰입니다.');
      }
      const newAccessToken = this.jwtService.sign(
        { sub: user.id, email: user.email, role: user.role },
        {
          secret: process.env.JWT_ACCESS_SECRET,
          expiresIn: process.env.JWT_ACCESS_EXPIRATION,
        },
      );
      return { accessToken: newAccessToken };
    } catch (err) {
      throw new UnauthorizedException(
        '리프레시 토큰이 만료되었거나 유효하지 않습니다.',
      );
    }
  }

  // ✅ 로그아웃
  // 리프레시 토큰을 DB에서 삭제하여 로그아웃 처리
  async logout(userId: number) {
    await this.userRepository.update(userId, { refreshToken: null });
  }
}
