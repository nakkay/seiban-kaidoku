// GTMイベント送信用ヘルパー

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

// 汎用イベント送信
export function pushEvent(eventName: string, params?: Record<string, unknown>) {
  if (typeof window !== "undefined" && window.dataLayer) {
    window.dataLayer.push({
      event: eventName,
      ...params,
    });
  }
}

// ===== 診断関連 =====

// 診断開始（無料で占うボタン）
export function trackDiagnosisStart(style: string) {
  pushEvent("diagnosis_start", {
    diagnosis_type: "basic",
    style: style,
  });
}

// 診断完了
export function trackDiagnosisComplete(zodiacSign: string, elementPattern: string) {
  pushEvent("diagnosis_complete", {
    diagnosis_type: "basic",
    zodiac_sign: zodiacSign,
    element_pattern: elementPattern,
  });
}

// ===== 課金関連 =====

// 購入開始（詳細解説）
export function trackPurchaseStart_Premium() {
  pushEvent("purchase_start", {
    item_name: "詳細解説",
    value: 500,
    currency: "JPY",
  });
}

// 購入完了（詳細解説）
export function trackPurchaseComplete_Premium() {
  pushEvent("purchase", {
    item_name: "詳細解説",
    value: 500,
    currency: "JPY",
  });
}

// 購入開始（相性診断）
export function trackPurchaseStart_Compatibility() {
  pushEvent("purchase_start", {
    item_name: "相性診断",
    value: 500,
    currency: "JPY",
  });
}

// 購入完了（相性診断）
export function trackPurchaseComplete_Compatibility() {
  pushEvent("purchase", {
    item_name: "相性診断",
    value: 500,
    currency: "JPY",
  });
}

// ===== シェア関連 =====

export function trackShare(platform: "x" | "line" | "copy") {
  pushEvent("share", {
    method: platform,
  });
}

// ===== スタイル選択 =====

export function trackStyleSelect(style: string) {
  pushEvent("style_select", {
    style: style,
  });
}



