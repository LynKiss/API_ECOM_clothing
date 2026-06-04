-- Idempotent migration for production-style customer returns and manual refunds.
-- Safe to re-run. Run the whole file, not only the UPDATE section.

USE clothing_ecommerce;
SET SQL_SAFE_UPDATES = 0;

SET @sql := (
  SELECT IF(
    COUNT(*) = 0,
    'ALTER TABLE returns ADD COLUMN return_quantity INT NOT NULL DEFAULT 1 AFTER order_item_id',
    'SELECT 1'
  )
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'returns'
    AND COLUMN_NAME = 'return_quantity'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql := (
  SELECT IF(
    COUNT(*) = 0,
    'ALTER TABLE returns ADD COLUMN max_refundable_amount DECIMAL(15,2) NOT NULL DEFAULT 0.00 AFTER refund_amount',
    'SELECT 1'
  )
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'returns'
    AND COLUMN_NAME = 'max_refundable_amount'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql := (
  SELECT IF(
    COUNT(*) = 0,
    'ALTER TABLE returns ADD COLUMN refunded_quantity INT NOT NULL DEFAULT 0 AFTER max_refundable_amount',
    'SELECT 1'
  )
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'returns'
    AND COLUMN_NAME = 'refunded_quantity'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

CREATE TABLE IF NOT EXISTS order_refunds (
  refund_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  order_id CHAR(36) NOT NULL,
  return_id BIGINT UNSIGNED NULL,
  reason ENUM('return', 'cancel_paid_order', 'short_delivery', 'manual_adjustment') NOT NULL,
  refund_status ENUM('pending', 'approved', 'completed', 'failed') NOT NULL DEFAULT 'pending',
  amount DECIMAL(15,2) NOT NULL,
  payment_provider VARCHAR(50) NULL,
  manual_reference VARCHAR(120) NULL,
  note VARCHAR(500) NULL,
  created_by CHAR(36) NULL,
  updated_by CHAR(36) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (refund_id),
  INDEX idx_order_refunds_order (order_id),
  INDEX idx_order_refunds_return (return_id),
  INDEX idx_order_refunds_status (refund_status),
  INDEX idx_order_refunds_reason (reason)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

UPDATE returns r
JOIN order_items oi ON oi.order_item_id = r.order_item_id
SET
  r.return_quantity = CASE
    WHEN r.return_quantity IS NULL OR r.return_quantity <= 0 THEN oi.quantity
    ELSE r.return_quantity
  END,
  r.max_refundable_amount = CASE
    WHEN r.max_refundable_amount IS NULL OR r.max_refundable_amount = 0 THEN oi.line_total
    ELSE r.max_refundable_amount
  END,
  r.refunded_quantity = CASE
    WHEN r.return_status = 'refunded' AND (r.refunded_quantity IS NULL OR r.refunded_quantity = 0) THEN
      CASE
        WHEN r.return_quantity IS NULL OR r.return_quantity <= 0 THEN oi.quantity
        ELSE r.return_quantity
      END
    ELSE r.refunded_quantity
  END
WHERE r.return_id > 0;

SELECT
  'returns/refunds migration verified' AS message,
  SUM(COLUMN_NAME = 'return_quantity') AS has_return_quantity,
  SUM(COLUMN_NAME = 'max_refundable_amount') AS has_max_refundable_amount,
  SUM(COLUMN_NAME = 'refunded_quantity') AS has_refunded_quantity
FROM information_schema.COLUMNS
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME = 'returns'
  AND COLUMN_NAME IN ('return_quantity', 'max_refundable_amount', 'refunded_quantity');

SET SQL_SAFE_UPDATES = 1;
