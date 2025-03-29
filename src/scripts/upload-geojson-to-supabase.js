// scripts/upload-geojson-to-supabase.js
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// 環境変数から接続情報を取得
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Supabase環境変数が設定されていません');
  process.exit(1);
}

// Supabaseクライアントの初期化
const supabase = createClient(supabaseUrl, supabaseKey);

// GeoJSONファイルのパス
const geoJsonPath = path.resolve(__dirname, 'data/countries.geojson');

async function uploadCountriesData() {
  try {
    // GeoJSONファイルの読み込み
    const rawData = fs.readFileSync(geoJsonPath, 'utf8');
    const geojsonData = JSON.parse(rawData);
    
    console.log(`GeoJSONファイルから${geojsonData.features.length}件の国データを読み込みました`);
    
    // 各国のデータを処理して登録
    let successCount = 0;
    let errorCount = 0;
    
    for (const feature of geojsonData.features) {
      const properties = feature.properties;
      
      const countryData = {
        id: properties.ISO_A2?.toLowerCase() || properties.iso_a2?.toLowerCase(),
        name: properties.NAME || properties.name,
        code: properties.ISO_A2 || properties.iso_a2,
        population: properties.POP_EST || properties.pop_est || 0,
        area_km2: properties.AREA_KM2 || properties.area || null,
        gdp_per_capita: properties.GDP_MD || properties.gdp_md || null,
        geometry: feature // GeoJSONフィーチャーをそのまま保存
      };
      
      if (!countryData.id || !countryData.name || !countryData.code) {
        console.warn(`警告: 国データに必須フィールドがありません: ${JSON.stringify(properties)}`);
        errorCount++;
        continue;
      }
      
      const { error } = await supabase
        .from('countries')
        .upsert([countryData], {
          onConflict: 'id',
          returning: 'minimal'
        });
      
      if (error) {
        console.error(`エラー: ${countryData.name}の登録に失敗:`, error);
        errorCount++;
      } else {
        console.log(`成功: ${countryData.name}を登録しました`);
        successCount++;
      }
      
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log(`=== 登録完了 ===`);
    console.log(`成功: ${successCount}件`);
    console.log(`失敗: ${errorCount}件`);
    
  } catch (error) {
    console.error('エラー:', error);
  }
}

// スクリプト実行
uploadCountriesData().catch(console.error);