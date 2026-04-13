import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { User } from '../modules/users/entities/user.entity';
import { Brand } from '../modules/brands/entities/brand.entity';

config();

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '12345',
  database: process.env.DB_NAME || 'anasali_1851',
  entities: [User, Brand],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});
