import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Bundle / Combo sáº£n pháº©m â€” gá»™p nhiá»u SP thÃ nh 1 SKU bÃ¡n theo gÃ³i.
 *
 * VÃ­ dá»¥: "Combo trá»“ng rau" = 1 háº¡t giá»‘ng + 1 phÃ¢n + 1 bÃ¬nh tÆ°á»›i vá»›i giÃ¡ Æ°u Ä‘Ã£i.
 *
 * Khi user mua bundle:
 *   - Trá»« kho tá»«ng SP con theo qty * componentQty
 *   - HoÃ¡ Ä‘Æ¡n ghi tÃªn bundle + breakdown
 *
 * Hiá»‡n táº¡i entity foundation. Logic checkout sáº½ resolve á»Ÿ phase tiáº¿p theo.
 */
@Entity({ name: 'product_bundles' })
export class ProductBundleEntity {
  @PrimaryColumn({ name: 'bundle_id', type: 'char', length: 36 })
  bundleId: string;

  @Index('idx_bundle_code', { unique: true })
  @Column({ name: 'bundle_code', type: 'varchar', length: 50 })
  bundleCode: string;

  @Column({ name: 'bundle_name', type: 'varchar', length: 255 })
  bundleName: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string | null;

  @Column({
    name: 'bundle_price',
    type: 'decimal',
    precision: 15,
    scale: 2,
  })
  bundlePrice: string;

  @Column({ name: 'image_url', type: 'varchar', length: 500, nullable: true })
  imageUrl: string | null;

  @Column({ name: 'is_active', type: 'tinyint', width: 1, default: 1 })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;
}

@Entity({ name: 'product_bundle_items' })
export class ProductBundleItemEntity {
  @PrimaryColumn({ name: 'bundle_item_id', type: 'char', length: 36 })
  bundleItemId: string;

  @Index('idx_bundle_item_bundle')
  @Column({ name: 'bundle_id', type: 'char', length: 36 })
  bundleId: string;

  @Index('idx_bundle_item_product')
  @Column({ name: 'product_id', type: 'char', length: 36 })
  productId: string;

  /** Sá»‘ lÆ°á»£ng SP con trong 1 bundle */
  @Column({ name: 'component_qty', type: 'int', default: 1 })
  componentQty: number;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;
}

