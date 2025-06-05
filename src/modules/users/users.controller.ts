import { Controller, Post, Body, Get, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // 테스트용 보호된 경로
  @UseGuards(JwtAuthGuard)
  @Get('protected')
  getProtected(@Req() req) {
    return {
      message: '이곳은 인증된 사용자만 접근할 수 있는 보호된 경로입니다.',
      user: req.user, // 인증된 사용자 정보
    };
  }

  @Post('signup')
  async create(@Body() createUserDto: CreateUserDto) {
    const newUser = await this.usersService.create(createUserDto);
    return { data: newUser, message: '회원가입이 완료되었습니다.' };
  }
}
