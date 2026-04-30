import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

// Compatibility adapter: old /origins API now reads/writes clothing brands.
@Entity({ name: 'brands' })
export class OriginEntity {
  @PrimaryGeneratedColumn({
    name: 'brand_id',
    type: 'bigint',
    unsigned: true,
  })
  originId: string;

  @Column({ name: 'brand_name', type: 'varchar', length: 150 })
  originName: string;

  @Column({
    name: 'logo_url',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  originImage: string | null;

  @Column({ name: 'brand_slug', type: 'varchar', length: 180, nullable: true })
  brandSlug: string | null;

  @Column({ name: 'brand_description', type: 'text', nullable: true })
  brandDescription: string | null;

  @Column({ name: 'is_active', type: 'tinyint', width: 1, default: 1 })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;
}
