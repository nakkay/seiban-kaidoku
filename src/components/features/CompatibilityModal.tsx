"use client";

import { useState } from "react";
import { trackPurchaseStart_Compatibility } from "@/lib/gtm";

// 日本の都道府県リスト
const PREFECTURES = [
  "北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
  "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県",
  "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県",
  "静岡県", "愛知県", "三重県", "滋賀県", "京都府", "大阪府", "兵庫県",
  "奈良県", "和歌山県", "鳥取県", "島根県", "岡山県", "広島県", "山口県",
  "徳島県", "香川県", "愛媛県", "高知県", "福岡県", "佐賀県", "長崎県",
  "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県", "海外"
];

interface CompatibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  person1ReadingId: string;
}

export function CompatibilityModal({ isOpen, onClose, person1ReadingId }: CompatibilityModalProps) {
  const [year, setYear] = useState("1980");
  const [month, setMonth] = useState("1");
  const [day, setDay] = useState("1");
  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");
  const [isTimeKnown, setIsTimeKnown] = useState(true);
  const [inputMode, setInputMode] = useState<"prefecture" | "latLng">("prefecture");
  const [prefecture, setPrefecture] = useState("東京都");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 年のオプション生成
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1920 + 1 }, (_, i) => currentYear - i);

  const handleSubmit = async () => {
    setError(null);

    // GTMイベント送信
    trackPurchaseStart_Compatibility();

    // バリデーション
    if (!year || !month || !day) {
      setError("相手の生年月日を入力してください");
      return;
    }

    if (inputMode === "prefecture" && !prefecture) {
      setError("相手の出生地を選択してください");
      return;
    }

    if (inputMode === "latLng" && (!latitude || !longitude)) {
      setError("緯度と経度を入力してください");
      return;
    }

    setIsSubmitting(true);

    try {
      const requestBody: {
        person1ReadingId: string;
        person2: {
          birthDate: { year: number; month: number; day: number };
          birthTime: { hour: number; minute: number; isKnown: boolean };
          birthPlace: string;
          latitude?: number;
          longitude?: number;
        };
      } = {
        person1ReadingId,
        person2: {
          birthDate: {
            year: parseInt(year),
            month: parseInt(month),
            day: parseInt(day),
          },
          birthTime: {
            hour: isTimeKnown ? parseInt(hour) || 12 : 12,
            minute: isTimeKnown ? parseInt(minute) || 0 : 0,
            isKnown: isTimeKnown,
          },
          birthPlace: inputMode === "prefecture" ? prefecture : "",
        },
      };

      if (inputMode === "latLng") {
        requestBody.person2.latitude = parseFloat(latitude);
        requestBody.person2.longitude = parseFloat(longitude);
      }

      const response = await fetch("/api/compatibility/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "エラーが発生しました");
      }

      // Stripe Checkoutへリダイレクト
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  // 送信中は簡易ローディング表示（Stripeへの遷移前）
  if (isSubmitting) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
        <div className="relative z-10 text-center">
          <div className="w-12 h-12 border-4 border-pink/20 border-t-pink rounded-full animate-spin mx-auto mb-4" />
          <p className="text-text text-sm">決済画面に移動中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 背景オーバーレイ */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* モーダル本体 */}
      <div className="relative bg-bg-elevated border border-card-border rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* ヘッダー */}
        <div className="sticky top-0 bg-bg-elevated border-b border-divider p-4 flex justify-between items-center">
          <div>
            <div className="text-pink text-sm font-medium">💕 相性診断</div>
            <h2 className="font-serif text-lg text-text">相手の情報を入力</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-text-muted hover:text-text text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* コンテンツ */}
        <div className="p-5 space-y-5">
          {/* 生年月日 */}
          <div>
            <label className="block text-sm text-gold mb-2">生年月日 *</label>
            <div className="flex gap-2">
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-24 bg-bg border border-card-border rounded-lg px-3 py-3 text-text text-base focus:border-gold focus:outline-none"
              >
                {years.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-20 bg-bg border border-card-border rounded-lg px-3 py-3 text-text text-base focus:border-gold focus:outline-none"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              <select
                value={day}
                onChange={(e) => setDay(e.target.value)}
                className="w-20 bg-bg border border-card-border rounded-lg px-3 py-3 text-text text-base focus:border-gold focus:outline-none"
              >
                {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          {/* 出生時刻 */}
          <div>
            <label className="block text-sm text-gold mb-2">出生時刻（任意）</label>
            <div className="flex gap-2 items-center mb-2">
              <select
                value={hour}
                onChange={(e) => setHour(e.target.value)}
                disabled={!isTimeKnown}
                className="w-20 bg-bg border border-card-border rounded-lg px-3 py-3 text-text text-base focus:border-gold focus:outline-none disabled:opacity-50"
              >
                <option value="">時</option>
                {Array.from({ length: 24 }, (_, i) => i).map((h) => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
              <span className="text-text-muted">:</span>
              <select
                value={minute}
                onChange={(e) => setMinute(e.target.value)}
                disabled={!isTimeKnown}
                className="w-20 bg-bg border border-card-border rounded-lg px-3 py-3 text-text text-base focus:border-gold focus:outline-none disabled:opacity-50"
              >
                <option value="">分</option>
                {[0, 15, 30, 45].map((m) => (
                  <option key={m} value={m}>{m.toString().padStart(2, "0")}</option>
                ))}
              </select>
            </div>
            <label className="flex items-center gap-2 text-sm text-text-muted cursor-pointer">
              <input
                type="checkbox"
                checked={!isTimeKnown}
                onChange={(e) => setIsTimeKnown(!e.target.checked)}
                className="rounded border-card-border bg-bg"
              />
              時刻がわからない
            </label>
          </div>

          {/* 出生地 */}
          <div>
            <label className="block text-sm text-gold mb-2">出生地 *</label>
            
            {/* 入力モード切り替え */}
            <div className="flex gap-2 mb-3">
              <button
                type="button"
                onClick={() => setInputMode("prefecture")}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                  inputMode === "prefecture"
                    ? "text-bg"
                    : "bg-bg border border-card-border text-text-muted hover:border-[#e879a0]"
                }`}
                style={inputMode === "prefecture" ? { background: "linear-gradient(to right, #e879a0, #f4a5c0)" } : {}}
              >
                都道府県から選択
              </button>
              <button
                type="button"
                onClick={() => setInputMode("latLng")}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                  inputMode === "latLng"
                    ? "text-bg"
                    : "bg-bg border border-card-border text-text-muted hover:border-[#e879a0]"
                }`}
                style={inputMode === "latLng" ? { background: "linear-gradient(to right, #e879a0, #f4a5c0)" } : {}}
              >
                緯度経度入力
              </button>
            </div>

            {inputMode === "prefecture" ? (
              <select
                value={prefecture}
                onChange={(e) => setPrefecture(e.target.value)}
                className="w-full bg-bg border border-card-border rounded-lg px-3 py-3 text-text text-base focus:border-gold focus:outline-none"
              >
                {PREFECTURES.map((pref) => (
                  <option key={pref} value={pref}>{pref}</option>
                ))}
              </select>
            ) : (
              <div className="flex gap-2">
                <div className="flex-1">
                  <input
                    type="number"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    placeholder="緯度（例: 35.6762）"
                    step="0.0001"
                    className="w-full bg-bg border border-card-border rounded-lg px-3 py-3 text-text text-base focus:border-gold focus:outline-none"
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="number"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    placeholder="経度（例: 139.6503）"
                    step="0.0001"
                    className="w-full bg-bg border border-card-border rounded-lg px-3 py-3 text-text text-base focus:border-gold focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* エラー表示 */}
          {error && (
            <div className="text-red-400 text-sm text-center bg-red-900/20 border border-red-900/40 rounded-lg p-3">
              ⚠ {error}
            </div>
          )}

          {/* 決済ボタン */}
          <div className="border-t border-divider pt-5 mt-5 text-center">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full py-4 text-bg font-semibold rounded-full hover:shadow-[0_0_20px_rgba(232,121,160,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: "linear-gradient(to right, #e879a0, #f4a5c0)" }}
            >
              {isSubmitting ? "処理中..." : "相性を診断する（500円）"}
            </button>
            <p className="text-xs text-text-muted/60 mt-3">
              税込 • Stripeによる安全な決済 • クレジットカード対応
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

