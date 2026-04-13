import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from './entities/brand.entity';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { User } from '../users/entities/user.entity';
import { ConflictException } from '@nestjs/common';

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
  ) { }

  async create(createBrandDto: CreateBrandDto, user: User): Promise<Brand> {
    const existing = await this.brandRepository.findOne({
      where: { name: createBrandDto.name },
    });
    if (existing) {
      throw new ConflictException(`Brand "${createBrandDto.name}" already exists`);
    }

    const brand = this.brandRepository.create({
      ...createBrandDto,
      createdById: user.id,
    });
    return await this.brandRepository.save(brand);
  }

  async findAll(page = 1, limit = 10): Promise<{ data: Brand[]; total: number; page: number; limit: number }> {
    const [data, total] = await this.brandRepository.findAndCount({
      relations: ['createdBy'],
      select: {
        createdBy: { id: true, name: true, email: true },
      },
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return { data, total, page, limit };
  }

  async findOne(id: number): Promise<Brand> {
    const brand = await this.brandRepository.findOne({
      where: { id },
      relations: ['createdBy'],
      select: {
        createdBy: { id: true, name: true, email: true },
      },
    });
    if (!brand) {
      throw new NotFoundException(`Brand with ID ${id} not found`);
    }
    return brand;
  }

  async update(id: number, updateBrandDto: UpdateBrandDto, user: User): Promise<Brand> {
    const brand = await this.findOne(id);
    Object.assign(brand, {
      ...updateBrandDto,
      updatedById: user.id,
    });
    return await this.brandRepository.save(brand);
  }

  async remove(id: number): Promise<{ message: string }> {
    const brand = await this.findOne(id);
    await this.brandRepository.remove(brand);
    return { message: `Brand "${brand.name}" deleted successfully` };
  }
}