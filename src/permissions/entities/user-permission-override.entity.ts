import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'user_permission_overrides' })
export class UserPermissionOverrideEntity {
  @PrimaryColumn({ name: 'user_id', type: 'char', length: 36 })
  userId: string;

  @Column({ name: 'updated_by', type: 'varchar', length: 80, nullable: true })
  updatedBy: string | null;

  @Column({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;
}
