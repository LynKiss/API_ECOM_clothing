import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'sizes' })
export class SizeEntity {
  @PrimaryGeneratedColumn({
    name: 'size_id',
    type: 'bigint',
    unsigned: true,
  })
  sizeId: string;

  @Column({ name: 'size_name', type: 'varchar', length: 80 })
  sizeName: string;

  @Column({ name: 'size_code', type: 'varchar', length: 30, nullable: true })
  sizeCode: string | null;

  @Column({ name: 'sort_order', type: 'int', default: 0 })
  sortOrder: number;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;
}
