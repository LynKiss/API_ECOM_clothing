import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type SuperAdminRefreshTokenDocument =
  HydratedDocument<SuperAdminRefreshToken>;

@Schema({ collection: 'super_admin_refresh_tokens', timestamps: true })
export class SuperAdminRefreshToken {
  @Prop({ type: Types.ObjectId, required: true, index: true })
  superAdminId: Types.ObjectId;

  @Prop({ required: true })
  refreshTokenHash: string;

  @Prop({ required: true })
  expiredAt: Date;

  @Prop({ default: false, index: true })
  isRevoked: boolean;
}

export const SuperAdminRefreshTokenSchema = SchemaFactory.createForClass(
  SuperAdminRefreshToken,
);
