import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Res,
} from '@nestjs/common';
import * as express from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service.js';
import { SignupDto } from './dto/signup.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';


@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) { }

  /**
   * POST /auth/signup
   * Public endpoint: Register a new BRAND user.
   */
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(
    @Body() signupDto: SignupDto,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const result = await this.authService.signup(signupDto);
    this.setCookie(res, result.accessToken);
    return result;
  }

  /**
   * POST /auth/login
   * Public endpoint: Authenticate and receive JWT token.
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const result = await this.authService.login(loginDto);
    this.setCookie(res, result.accessToken);
    return result;
  }

  private setCookie(res: express.Response, token: string) {
    const isProduction = this.configService.get('NODE_ENV') === 'production';
    
    res.cookie('accessToken', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax', // Use 'none' for cross-site in prod
      path: '/',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
  }

  /**
   * GET /auth/profile
   * Protected endpoint: Get current user's profile.
   */
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@CurrentUser('id') userId: string) {
    return this.authService.getProfile(userId);
  }
}
