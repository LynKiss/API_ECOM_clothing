import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'colors' })
export class ColorEntity {
  @PrimaryGeneratedColumn({
    name: 'color_id',
    type: 'bigint',
    unsigned: true,
  })
  colorId: string;

  @Column({ name: 'color_name', type: 'varchar', length: 100 })
  colorName: string;

  @Column({ name: 'color_code', type: 'varchar', length: 30, nullable: true })
  colorCode: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;
}
