import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { PermissionEntity } from './permission.entity';
import { UserEntity } from '../../users/entities/user.entity';

@Entity({ name: 'user_permissions' })
export class UserPermissionEntity {
  @PrimaryColumn({ name: 'user_id', type: 'char', length: 36 })
  userId: string;

  @PrimaryColumn({ name: 'permission_id', type: 'bigint', unsigned: true })
  permissionId: string;

  @Column({ name: 'granted_by', type: 'varchar', length: 80, nullable: true })
  grantedBy: string | null;

  @Column({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'userId' })
  user: UserEntity;

  @ManyToOne(() => PermissionEntity, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'permission_id', referencedColumnName: 'permissionId' })
  permission: PermissionEntity;
}
