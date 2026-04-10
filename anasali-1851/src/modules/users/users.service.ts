import {
  Injectable,
  ConflictException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { Role } from '../../common/enums/role.enum.js';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  private readonly SALT_ROUNDS = 12;

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  /**
   * Creates a new user with hashed password.
   * Throws ConflictException if email already exists.
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email.toLowerCase() },
    });

    if (existingUser) {
      throw new ConflictException('A user with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      this.SALT_ROUNDS,
    );

    const user = this.usersRepository.create({
      ...createUserDto,
      email: createUserDto.email.toLowerCase(),
      password: hashedPassword,
      role: createUserDto.role || Role.BRAND,
    });

    const savedUser = await this.usersRepository.save(user);
    this.logger.log(`User created: ${savedUser.email} with role ${savedUser.role}`);

    return savedUser;
  }

  /**
   * Finds user by email. Used internally for authentication.
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email: email.toLowerCase() },
    });
  }

  /**
   * Finds user by ID. Throws NotFoundException if not found.
   */
  async findById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    return user;
  }

  /**
   * Returns all users. Admin-only operation.
   */
  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Seeds the default admin user if it doesn't exist.
   */
  async seedAdmin(email: string, password: string): Promise<void> {
    const existingAdmin = await this.findByEmail(email);

    if (existingAdmin) {
      this.logger.log(`Admin user already exists: ${email}`);
      return;
    }

    const hashedPassword = await bcrypt.hash(password, this.SALT_ROUNDS);

    const admin = this.usersRepository.create({
      name: 'Admin',
      email: email.toLowerCase(),
      password: hashedPassword,
      role: Role.ADMIN,
    });

    await this.usersRepository.save(admin);
    this.logger.log(`Admin user seeded successfully: ${email}`);
  }
}
