-- Cleanup old return notifications saved without Vietnamese accents.
-- Safe to re-run. Run this after selecting/creating the clothing database.

USE clothing_ecommerce;
SET SQL_SAFE_UPDATES = 0;

UPDATE notifications_v2
SET
  title = 'Yêu cầu trả hàng đã được tạo',
  message = REPLACE(
    REPLACE(
      message,
      'Yeu cau tra hang cho don',
      'Yêu cầu trả hàng cho đơn'
    ),
    'da duoc tiep nhan',
    'đã được tiếp nhận'
  ),
  metadata = JSON_SET(
    COALESCE(metadata, JSON_OBJECT()),
    '$.type', 'return_status_changed',
    '$.targetUrl', CONCAT(
      '/client/returns?returnId=',
      COALESCE(JSON_UNQUOTE(JSON_EXTRACT(COALESCE(metadata, JSON_OBJECT()), '$.returnId')), '')
    )
  )
WHERE notification_id > 0
  AND (
    title = 'Yeu cau tra hang da duoc tao'
    OR title = 'Yêu cầu trả hàng đã được tạo'
  );

UPDATE notifications_v2
SET
  title = 'Yêu cầu trả hàng đã cập nhật',
  message = REPLACE(
    REPLACE(
      REPLACE(
        REPLACE(
          REPLACE(
            REPLACE(
              message,
              'Yeu cau tra hang',
              'Yêu cầu trả hàng'
            ),
            'da chuyen sang requested',
            'đã chuyển sang Đã gửi yêu cầu'
          ),
          'da chuyen sang approved',
          'đã chuyển sang Đã duyệt'
        ),
        'da chuyen sang received',
        'đã chuyển sang Đã nhận hàng trả về'
      ),
      'da chuyen sang refunded',
      'đã chuyển sang Đã hoàn tiền'
    ),
    'da chuyen sang rejected',
    'đã chuyển sang Từ chối'
  ),
  metadata = JSON_SET(
    COALESCE(metadata, JSON_OBJECT()),
    '$.type', 'return_status_changed',
    '$.targetUrl', CONCAT(
      '/client/returns?returnId=',
      COALESCE(JSON_UNQUOTE(JSON_EXTRACT(COALESCE(metadata, JSON_OBJECT()), '$.returnId')), '')
    )
  )
WHERE notification_id > 0
  AND (
    title = 'Yeu cau tra hang da thay doi trang thai'
    OR title = 'Yêu cầu trả hàng đã cập nhật'
    OR JSON_UNQUOTE(JSON_EXTRACT(COALESCE(metadata, JSON_OBJECT()), '$.type')) = 'return_status_changed'
  );

SET SQL_SAFE_UPDATES = 1;
