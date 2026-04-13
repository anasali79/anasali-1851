import { Module } from '@nestjs/common';
import { AdminSeeder } from './admin.seeder.js';
import { UsersModule } from '../users/users.module.js';

@Module({
  imports: [UsersModule],
  providers: [AdminSeeder],
})
export class SeedsModule {}
