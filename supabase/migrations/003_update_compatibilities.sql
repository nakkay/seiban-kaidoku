-- =============================================
-- 相性診断テーブル更新（先決済フロー対応）
-- =============================================

-- is_paidカラムを追加
ALTER TABLE compatibilities 
ADD COLUMN IF NOT EXISTS is_paid BOOLEAN DEFAULT FALSE;

-- compatibility_readingをNULLableに変更
ALTER TABLE compatibilities 
ALTER COLUMN compatibility_reading DROP NOT NULL;

-- scoreの制約を変更（0も許可）
ALTER TABLE compatibilities 
DROP CONSTRAINT IF EXISTS compatibilities_score_check;

ALTER TABLE compatibilities 
ADD CONSTRAINT compatibilities_score_check CHECK (score >= 0 AND score <= 100);

