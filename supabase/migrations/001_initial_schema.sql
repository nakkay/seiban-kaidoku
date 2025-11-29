-- =============================================
-- 星盤解読 初期スキーマ
-- =============================================

-- 結果テーブル
-- ホロスコープ計算結果とAI解説を保存
CREATE TABLE IF NOT EXISTS readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- ホロスコープ計算データ（惑星位置、ハウス、アスペクト等）
  chart_data JSONB NOT NULL,
  
  -- 基本解説（無料・GPT-4o-mini）
  basic_reading JSONB NOT NULL,
  
  -- 詳細解説（有料・GPT-4o）
  detailed_reading JSONB,
  
  -- エレメントパターン（背景画像選択用）
  -- fire, earth, air, water, fire-earth, balanced など
  element_pattern VARCHAR(20) NOT NULL,
  
  -- 解説スタイル（praise, neutral, strict）
  style VARCHAR(10) NOT NULL,
  
  -- 支払い済みフラグ
  is_paid BOOLEAN DEFAULT FALSE,
  
  -- 作成日時
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- レート制限用テーブル
-- IPアドレスごとのAPI呼び出し回数を管理
CREATE TABLE IF NOT EXISTS rate_limits (
  -- IPアドレスのSHA-256ハッシュ
  ip_hash VARCHAR(64) PRIMARY KEY,
  
  -- 現在のウィンドウ内でのリクエスト数
  count INTEGER DEFAULT 1,
  
  -- 現在のウィンドウの開始時刻
  window_start TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- インデックス
-- =============================================

-- readingsテーブル
CREATE INDEX IF NOT EXISTS idx_readings_created_at ON readings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_readings_is_paid ON readings(is_paid);

-- rate_limitsテーブル
CREATE INDEX IF NOT EXISTS idx_rate_limits_window_start ON rate_limits(window_start);

-- =============================================
-- Row Level Security (RLS)
-- =============================================

-- RLSを有効化
ALTER TABLE readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

-- readingsテーブルのポリシー
-- 読み取り: 誰でも可能（シェアURL用）
CREATE POLICY "readings_select_policy" ON readings
  FOR SELECT
  USING (true);

-- 挿入: サービスロールのみ（API経由）
CREATE POLICY "readings_insert_policy" ON readings
  FOR INSERT
  WITH CHECK (true);

-- 更新: サービスロールのみ（決済完了時）
CREATE POLICY "readings_update_policy" ON readings
  FOR UPDATE
  USING (true);

-- rate_limitsテーブルのポリシー
-- サービスロールのみアクセス可能
CREATE POLICY "rate_limits_all_policy" ON rate_limits
  FOR ALL
  USING (true);

-- =============================================
-- 関数
-- =============================================

-- レート制限チェック・更新関数
CREATE OR REPLACE FUNCTION check_rate_limit(
  p_ip_hash VARCHAR(64),
  p_limit INTEGER DEFAULT 5,
  p_window_hours INTEGER DEFAULT 1
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
  v_count INTEGER;
  v_window_start TIMESTAMPTZ;
  v_now TIMESTAMPTZ := NOW();
  v_window_cutoff TIMESTAMPTZ := v_now - (p_window_hours || ' hours')::INTERVAL;
BEGIN
  -- 既存のレコードを取得
  SELECT count, window_start INTO v_count, v_window_start
  FROM rate_limits
  WHERE ip_hash = p_ip_hash;
  
  -- レコードが存在しない場合は新規作成
  IF NOT FOUND THEN
    INSERT INTO rate_limits (ip_hash, count, window_start)
    VALUES (p_ip_hash, 1, v_now);
    RETURN TRUE;
  END IF;
  
  -- ウィンドウが古い場合はリセット
  IF v_window_start < v_window_cutoff THEN
    UPDATE rate_limits
    SET count = 1, window_start = v_now
    WHERE ip_hash = p_ip_hash;
    RETURN TRUE;
  END IF;
  
  -- 制限を超えている場合はFALSE
  IF v_count >= p_limit THEN
    RETURN FALSE;
  END IF;
  
  -- カウントをインクリメント
  UPDATE rate_limits
  SET count = count + 1
  WHERE ip_hash = p_ip_hash;
  
  RETURN TRUE;
END;
$$;

-- 古いレート制限レコードをクリーンアップする関数
CREATE OR REPLACE FUNCTION cleanup_old_rate_limits(p_hours INTEGER DEFAULT 24)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
  v_deleted INTEGER;
BEGIN
  DELETE FROM rate_limits
  WHERE window_start < NOW() - (p_hours || ' hours')::INTERVAL;
  
  GET DIAGNOSTICS v_deleted = ROW_COUNT;
  RETURN v_deleted;
END;
$$;


