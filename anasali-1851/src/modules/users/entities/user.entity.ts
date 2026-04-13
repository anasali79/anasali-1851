import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Role } from '../../../common/enums/role.enum';
import { Exclude } from 'class-transformer';

import { Brand } from '../../brands/entities/brand.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  @Exclude()
  password: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.BRAND,
  })
  role: Role;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'brand_id', type: 'int', nullable: true })
  brandId: number;

  @ManyToOne(() => Brand, (brand) => brand.users)
  @JoinColumn({ name: 'brand_id' })
  brand: Brand;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
