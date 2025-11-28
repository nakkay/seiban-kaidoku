/**
 * OpenCage Geocoding API
 * 都市名から緯度経度を取得
 */

interface GeocodeResult {
  lat: number;
  lng: number;
  name: string;
  timezone: string;
}

interface OpenCageResponse {
  results: Array<{
    geometry: {
      lat: number;
      lng: number;
    };
    formatted: string;
    annotations: {
      timezone: {
        name: string;
      };
    };
  }>;
  status: {
    code: number;
    message: string;
  };
}

/**
 * 都市名から緯度経度・タイムゾーンを取得
 */
export async function geocode(placeName: string): Promise<GeocodeResult | null> {
  const apiKey = process.env.OPENCAGE_API_KEY;
  
  if (!apiKey) {
    console.error("OPENCAGE_API_KEY is not set");
    return null;
  }

  try {
    const url = new URL("https://api.opencagedata.com/geocode/v1/json");
    url.searchParams.set("q", placeName);
    url.searchParams.set("key", apiKey);
    url.searchParams.set("language", "ja");
    url.searchParams.set("limit", "1");

    const response = await fetch(url.toString());
    
    if (!response.ok) {
      console.error("OpenCage API error:", response.status);
      return null;
    }

    const data: OpenCageResponse = await response.json();

    if (data.status.code !== 200 || data.results.length === 0) {
      console.error("OpenCage API error:", data.status.message);
      return null;
    }

    const result = data.results[0];
    
    return {
      lat: result.geometry.lat,
      lng: result.geometry.lng,
      name: result.formatted,
      timezone: result.annotations.timezone.name,
    };
  } catch (error) {
    console.error("Geocode error:", error);
    return null;
  }
}

/**
 * 47都道府県の緯度経度データ（県庁所在地ベース）
 */
export const JAPAN_PREFECTURES: Record<string, GeocodeResult> = {
  "北海道": { lat: 43.0618, lng: 141.3545, name: "北海道", timezone: "Asia/Tokyo" },
  "青森県": { lat: 40.8246, lng: 140.7406, name: "青森県", timezone: "Asia/Tokyo" },
  "岩手県": { lat: 39.7036, lng: 141.1527, name: "岩手県", timezone: "Asia/Tokyo" },
  "宮城県": { lat: 38.2688, lng: 140.8721, name: "宮城県", timezone: "Asia/Tokyo" },
  "秋田県": { lat: 39.7186, lng: 140.1024, name: "秋田県", timezone: "Asia/Tokyo" },
  "山形県": { lat: 38.2404, lng: 140.3633, name: "山形県", timezone: "Asia/Tokyo" },
  "福島県": { lat: 37.7500, lng: 140.4678, name: "福島県", timezone: "Asia/Tokyo" },
  "茨城県": { lat: 36.3418, lng: 140.4468, name: "茨城県", timezone: "Asia/Tokyo" },
  "栃木県": { lat: 36.5657, lng: 139.8836, name: "栃木県", timezone: "Asia/Tokyo" },
  "群馬県": { lat: 36.3912, lng: 139.0608, name: "群馬県", timezone: "Asia/Tokyo" },
  "埼玉県": { lat: 35.8569, lng: 139.6489, name: "埼玉県", timezone: "Asia/Tokyo" },
  "千葉県": { lat: 35.6046, lng: 140.1233, name: "千葉県", timezone: "Asia/Tokyo" },
  "東京都": { lat: 35.6762, lng: 139.6503, name: "東京都", timezone: "Asia/Tokyo" },
  "神奈川県": { lat: 35.4478, lng: 139.6425, name: "神奈川県", timezone: "Asia/Tokyo" },
  "新潟県": { lat: 37.9026, lng: 139.0236, name: "新潟県", timezone: "Asia/Tokyo" },
  "富山県": { lat: 36.6953, lng: 137.2113, name: "富山県", timezone: "Asia/Tokyo" },
  "石川県": { lat: 36.5947, lng: 136.6256, name: "石川県", timezone: "Asia/Tokyo" },
  "福井県": { lat: 36.0652, lng: 136.2216, name: "福井県", timezone: "Asia/Tokyo" },
  "山梨県": { lat: 35.6642, lng: 138.5684, name: "山梨県", timezone: "Asia/Tokyo" },
  "長野県": { lat: 36.6513, lng: 138.1810, name: "長野県", timezone: "Asia/Tokyo" },
  "岐阜県": { lat: 35.3912, lng: 136.7223, name: "岐阜県", timezone: "Asia/Tokyo" },
  "静岡県": { lat: 34.9769, lng: 138.3831, name: "静岡県", timezone: "Asia/Tokyo" },
  "愛知県": { lat: 35.1802, lng: 136.9066, name: "愛知県", timezone: "Asia/Tokyo" },
  "三重県": { lat: 34.7303, lng: 136.5086, name: "三重県", timezone: "Asia/Tokyo" },
  "滋賀県": { lat: 35.0045, lng: 135.8686, name: "滋賀県", timezone: "Asia/Tokyo" },
  "京都府": { lat: 35.0116, lng: 135.7681, name: "京都府", timezone: "Asia/Tokyo" },
  "大阪府": { lat: 34.6937, lng: 135.5023, name: "大阪府", timezone: "Asia/Tokyo" },
  "兵庫県": { lat: 34.6913, lng: 135.1830, name: "兵庫県", timezone: "Asia/Tokyo" },
  "奈良県": { lat: 34.6851, lng: 135.8329, name: "奈良県", timezone: "Asia/Tokyo" },
  "和歌山県": { lat: 34.2260, lng: 135.1675, name: "和歌山県", timezone: "Asia/Tokyo" },
  "鳥取県": { lat: 35.5039, lng: 134.2378, name: "鳥取県", timezone: "Asia/Tokyo" },
  "島根県": { lat: 35.4723, lng: 133.0505, name: "島根県", timezone: "Asia/Tokyo" },
  "岡山県": { lat: 34.6618, lng: 133.9344, name: "岡山県", timezone: "Asia/Tokyo" },
  "広島県": { lat: 34.3966, lng: 132.4596, name: "広島県", timezone: "Asia/Tokyo" },
  "山口県": { lat: 34.1859, lng: 131.4714, name: "山口県", timezone: "Asia/Tokyo" },
  "徳島県": { lat: 34.0658, lng: 134.5593, name: "徳島県", timezone: "Asia/Tokyo" },
  "香川県": { lat: 34.3401, lng: 134.0434, name: "香川県", timezone: "Asia/Tokyo" },
  "愛媛県": { lat: 33.8416, lng: 132.7658, name: "愛媛県", timezone: "Asia/Tokyo" },
  "高知県": { lat: 33.5597, lng: 133.5311, name: "高知県", timezone: "Asia/Tokyo" },
  "福岡県": { lat: 33.6064, lng: 130.4183, name: "福岡県", timezone: "Asia/Tokyo" },
  "佐賀県": { lat: 33.2494, lng: 130.2988, name: "佐賀県", timezone: "Asia/Tokyo" },
  "長崎県": { lat: 32.7448, lng: 129.8737, name: "長崎県", timezone: "Asia/Tokyo" },
  "熊本県": { lat: 32.7898, lng: 130.7417, name: "熊本県", timezone: "Asia/Tokyo" },
  "大分県": { lat: 33.2382, lng: 131.6126, name: "大分県", timezone: "Asia/Tokyo" },
  "宮崎県": { lat: 31.9111, lng: 131.4239, name: "宮崎県", timezone: "Asia/Tokyo" },
  "鹿児島県": { lat: 31.5602, lng: 130.5581, name: "鹿児島県", timezone: "Asia/Tokyo" },
  "沖縄県": { lat: 26.2124, lng: 127.6809, name: "沖縄県", timezone: "Asia/Tokyo" },
  "海外": { lat: 35.6762, lng: 139.6503, name: "海外", timezone: "UTC" }, // デフォルトは東京
};

/**
 * 緯度経度を取得（フォールバック付き）
 */
export async function getLocation(placeName: string): Promise<GeocodeResult | null> {
  // まず47都道府県をチェック（APIキーなしでも動作）
  const normalizedName = placeName.trim();
  if (JAPAN_PREFECTURES[normalizedName]) {
    return JAPAN_PREFECTURES[normalizedName];
  }

  // OpenCage APIで検索
  return geocode(placeName);
}

