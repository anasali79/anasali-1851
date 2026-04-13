import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service.js';

@Injectable()
export class AdminSeeder implements OnModuleInit {
  private readonly logger = new Logger(AdminSeeder.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.seed();
  }

  async seed(): Promise<void> {
    const email = this.configService.get<string>(
      'ADMIN_EMAIL',
      'admin@email.com',
    );
    const password = this.configService.get<string>(
      'ADMIN_PASSWORD',
      'admin',
    );

    try {
      await this.usersService.seedAdmin(email, password);
      this.logger.log('Admin seeding completed');
    } catch (error) {
      this.logger.error(
        `Admin seeding failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }
}
