import { Controller, Post, Body, UseGuards, Req, Res } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res) {
    const user = await this.authService.validateUser(loginDto);
    const { acccessToken, refreshToken } = await this.authService.login(user);
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // 프로덕션 환경에서는 secure 설정
      sameSite: 'strict', // CSRF 공격 방지를 위한 SameSite 설정
      path: '/', // 쿠키의 유효 경로 설정
      maxAge: process.env.JWT_REFRESH_EXPIRATION
        ? parseInt(process.env.JWT_REFRESH_EXPIRATION, 10)
        : 7 * 24 * 60 * 60 * 1000, // 기본값: 7일
    });
    return {
      data: { acccessToken, refreshToken },
      message: '로그인이 완료되었습니다.',
    };
  }

  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('refresh')
  async refreshTokens(@Body('refreshToken') @Req() req) {
    const refreshToken = req.cookies['refreshToken'];
    return this.authService.refreshTokens(refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req) {
    const userId = req.user.id;
    await this.authService.logout(userId);
    return { message: '로그아웃이 완료되었습니다.' };
  }

  @Post('email-verify')
  async sendEmailCode(@Body('email') email: string) {
    await this.authService.sendEmailVerificationCode(email);
    return { message: '인증 코드가 전송되었습니다' };
  }
}
