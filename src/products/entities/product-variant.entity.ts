import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'product_variants' })
export class ProductVariantEntity {
  @PrimaryColumn({ name: 'variant_id', type: 'char', length: 36 })
  variantId: string;

  @Column({ name: 'product_id', type: 'char', length: 36 })
  productId: string;

  @Column({ name: 'size_id', type: 'bigint', unsigned: true, nullable: true })
  sizeId: string | null;

  @Column({ name: 'color_id', type: 'bigint', unsigned: true, nullable: true })
  colorId: string | null;

  @Column({ name: 'sku', type: 'varchar', length: 120, nullable: true })
  sku: string | null;

  @Column({ name: 'barcode', type: 'varchar', length: 120, nullable: true })
  barcode: string | null;

  @Column({
    name: 'price',
    type: 'decimal',
    precision: 15,
    scale: 2,
    nullable: true,
  })
  price: string | null;

  @Column({
    name: 'sale_price',
    type: 'decimal',
    precision: 15,
    scale: 2,
    nullable: true,
  })
  salePrice: string | null;

  @Column({ name: 'stock_quantity', type: 'int', default: 0 })
  stockQuantity: number;

  @Column({ name: 'weight_grams', type: 'int', nullable: true })
  weightGrams: number | null;

  @Column({ name: 'is_active', type: 'tinyint', width: 1, default: 1 })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;
}
