-- =============================================
-- 相性診断テーブル追加
-- =============================================

-- 相性診断テーブル
CREATE TABLE IF NOT EXISTS compatibilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Person 1（自分）の結果ID
  person1_reading_id UUID REFERENCES readings(id) ON DELETE CASCADE,
  
  -- Person 2（相手）のチャートデータ
  person2_chart_data JSONB NOT NULL,
  
  -- Person 2の星座（英語）
  person2_zodiac VARCHAR(15) NOT NULL,
  
  -- Person 2のエレメント（英語）
  person2_element VARCHAR(10) NOT NULL,
  
  -- Person 2のエレメントパターン
  person2_element_pattern VARCHAR(20) NOT NULL,
  
  -- Person 2のキャッチフレーズ
  person2_catchphrase VARCHAR(100) NOT NULL,
  
  -- 相性スコア（0-100）
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  
  -- 相性キャッチフレーズ
  catchphrase VARCHAR(100) NOT NULL,
  
  -- 相性診断結果（8セクション）
  compatibility_reading JSONB NOT NULL,
  
  -- 作成日時
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- インデックス
-- =============================================

CREATE INDEX IF NOT EXISTS idx_compatibilities_person1_reading_id ON compatibilities(person1_reading_id);
CREATE INDEX IF NOT EXISTS idx_compatibilities_created_at ON compatibilities(created_at DESC);

-- =============================================
-- Row Level Security (RLS)
-- =============================================

ALTER TABLE compatibilities ENABLE ROW LEVEL SECURITY;

-- 読み取り: 誰でも可能（シェアURL用）
CREATE POLICY "compatibilities_select_policy" ON compatibilities
  FOR SELECT
  USING (true);

-- 挿入: サービスロールのみ
CREATE POLICY "compatibilities_insert_policy" ON compatibilities
  FOR INSERT
  WITH CHECK (true);

-- 更新: サービスロールのみ
CREATE POLICY "compatibilities_update_policy" ON compatibilities
  FOR UPDATE
  USING (true);




