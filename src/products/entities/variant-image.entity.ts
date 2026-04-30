import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'variant_images' })
export class VariantImageEntity {
  @PrimaryGeneratedColumn({
    name: 'variant_image_id',
    type: 'bigint',
    unsigned: true,
  })
  variantImageId: string;

  @Column({ name: 'variant_id', type: 'char', length: 36 })
  variantId: string;

  @Column({ name: 'image_url', type: 'varchar', length: 500 })
  imageUrl: string;

  @Column({ name: 'sort_order', type: 'int', default: 0 })
  sortOrder: number;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;
}
