import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'warehouse_stock' })
export class WarehouseStockEntity {
  @PrimaryGeneratedColumn({
    name: 'warehouse_stock_id',
    type: 'bigint',
    unsigned: true,
  })
  stockId!: string;

  @Column({ name: 'warehouse_id', type: 'char', length: 36 })
  warehouseId!: string;

  @Column({ name: 'product_id', type: 'char', length: 36 })
  productId!: string;

  @Column({ name: 'variant_id', type: 'char', length: 36, nullable: true })
  variantId!: string | null;

  @Column({ name: 'quantity', type: 'int', default: 0 })
  quantity!: number;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt!: Date;
}
