-- src/scripts/create-countries-table.sql
-- Supabaseで国データを保存するテーブルの作成

CREATE TABLE countries (
  id TEXT PRIMARY KEY,           -- 国識別子 (例: 'jp', 'us')
  name TEXT NOT NULL,            -- 国名
  code TEXT NOT NULL,            -- 国コード (ISO 3166-1 alpha-2)
  population INTEGER NOT NULL,   -- 人口
  area_km2 NUMERIC,              -- 面積(km²)
  gdp_per_capita NUMERIC,        -- 一人当たりGDP
  geometry JSONB NOT NULL        -- GeoJSON形式の地理データ
);

-- インデックスの作成
CREATE INDEX countries_code_idx ON countries (code);
CREATE INDEX countries_name_idx ON countries (name);

-- RLSポリシー (オプション - 必要に応じて設定)
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON countries FOR SELECT USING (true);