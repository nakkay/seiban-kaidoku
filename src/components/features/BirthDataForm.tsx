"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/Button";
import { READING_STYLES } from "@/constants";
import type { ReadingStyle } from "@/types";

// 都道府県リスト
const PREFECTURES = [
  "北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
  "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県",
  "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県",
  "岐阜県", "静岡県", "愛知県", "三重県",
  "滋賀県", "京都府", "大阪府", "兵庫県", "奈良県", "和歌山県",
  "鳥取県", "島根県", "岡山県", "広島県", "山口県",
  "徳島県", "香川県", "愛媛県", "高知県",
  "福岡県", "佐賀県", "長崎県", "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県",
];

type LocationInputMode = "prefecture" | "coordinates";

interface BirthDataFormProps {
  onSubmit: (data: FormData) => void;
  isLoading?: boolean;
}

interface FormData {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  isTimeKnown: boolean;
  birthPlace: string;
  latitude?: number;
  longitude?: number;
  style: ReadingStyle;
}

export function BirthDataForm({ onSubmit, isLoading = false }: BirthDataFormProps) {
  const currentYear = new Date().getFullYear();
  
  const [year, setYear] = useState<string>("1980");
  const [month, setMonth] = useState<string>("1");
  const [day, setDay] = useState<string>("1");
  const [hour, setHour] = useState<string>("");
  const [minute, setMinute] = useState<string>("");
  const [isTimeUnknown, setIsTimeUnknown] = useState(false);
  const [locationMode, setLocationMode] = useState<LocationInputMode>("prefecture");
  const [birthPlace, setBirthPlace] = useState("東京都");
  const [latitude, setLatitude] = useState<string>("");
  const [longitude, setLongitude] = useState<string>("");
  const [style] = useState<ReadingStyle>("neutral");

  // Generate year options (current year - 1920, descending order)
  const years = useMemo(() => {
    const arr = [];
    for (let y = currentYear; y >= 1920; y--) {
      arr.push(y);
    }
    return arr;
  }, [currentYear]);

  const months = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), []);
  const days = useMemo(() => Array.from({ length: 31 }, (_, i) => i + 1), []);
  const hours = useMemo(() => Array.from({ length: 24 }, (_, i) => i), []);
  const minutes = useMemo(() => [0, 15, 30, 45], []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!year || !month || !day) {
      alert("生年月日を入力してください");
      return;
    }

    if (!isTimeUnknown && (!hour || minute === "")) {
      alert("出生時刻を入力するか、「わからない」にチェックを入れてください");
      return;
    }

    if (locationMode === "prefecture" && !birthPlace) {
      alert("出生地を選択してください");
      return;
    }

    if (locationMode === "coordinates") {
      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);
      if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        alert("正しい緯度経度を入力してください");
        return;
      }
    }

    const formData: FormData = {
      year: parseInt(year),
      month: parseInt(month),
      day: parseInt(day),
      hour: isTimeUnknown ? 12 : parseInt(hour),
      minute: isTimeUnknown ? 0 : parseInt(minute),
      isTimeKnown: !isTimeUnknown,
      birthPlace: locationMode === "prefecture" ? birthPlace : `${latitude},${longitude}`,
      style,
    };

    if (locationMode === "coordinates") {
      formData.latitude = parseFloat(latitude);
      formData.longitude = parseFloat(longitude);
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      {/* 生年月日 */}
      <div className="space-y-2.5">
        <label className="block text-xs text-gold tracking-[0.1em] uppercase">
          生年月日
        </label>
        <div className="flex gap-2.5">
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="flex-1 bg-white/[0.03] border border-white/10 rounded-lg py-3 px-3 text-text text-sm outline-none transition-all focus:border-gold focus:bg-white/[0.05]"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="flex-1 bg-white/[0.03] border border-white/10 rounded-lg py-3 px-3 text-text text-sm outline-none transition-all focus:border-gold focus:bg-white/[0.05]"
          >
            {months.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          <select
            value={day}
            onChange={(e) => setDay(e.target.value)}
            className="flex-1 bg-white/[0.03] border border-white/10 rounded-lg py-3 px-3 text-text text-sm outline-none transition-all focus:border-gold focus:bg-white/[0.05]"
          >
            {days.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 出生時刻 */}
      <div className="space-y-2.5">
        <label className="block text-xs text-gold tracking-[0.1em] uppercase">
          出生時刻
        </label>
        <div className="flex items-center gap-2.5">
          <select
            value={hour}
            onChange={(e) => setHour(e.target.value)}
            disabled={isTimeUnknown}
            className="flex-1 bg-white/[0.03] border border-white/10 rounded-lg py-3 px-3 text-text text-sm outline-none transition-all focus:border-gold focus:bg-white/[0.05] disabled:opacity-50"
          >
            <option value="">時</option>
            {hours.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>
          <select
            value={minute}
            onChange={(e) => setMinute(e.target.value)}
            disabled={isTimeUnknown}
            className="flex-1 bg-white/[0.03] border border-white/10 rounded-lg py-3 px-3 text-text text-sm outline-none transition-all focus:border-gold focus:bg-white/[0.05] disabled:opacity-50"
          >
            <option value="">分</option>
            {minutes.map((m) => (
              <option key={m} value={m}>
                {String(m).padStart(2, "0")}
              </option>
            ))}
          </select>
          <label className="flex items-center gap-2 text-xs text-text-muted cursor-pointer whitespace-nowrap">
            <input
              type="checkbox"
              checked={isTimeUnknown}
              onChange={(e) => setIsTimeUnknown(e.target.checked)}
              className="w-4 h-4 accent-gold"
            />
            わからない
          </label>
        </div>
        <p className="text-xs text-text-muted pl-4 border-l border-divider">
          出生時刻がわかると、より正確な診断ができます。母子手帳に記載されていることが多いです。
        </p>
      </div>

      {/* 出生地 */}
      <div className="space-y-2.5">
        <label className="block text-xs text-gold tracking-[0.1em] uppercase">
          出生地
        </label>
        
        {/* 入力モード切り替え */}
        <div className="flex gap-2 mb-3">
          <button
            type="button"
            onClick={() => setLocationMode("prefecture")}
            className={`flex-1 py-2 px-3 rounded-lg text-xs transition-all ${
              locationMode === "prefecture"
                ? "bg-gold/20 text-gold border border-gold/40"
                : "bg-white/[0.03] text-text-muted border border-white/10 hover:border-white/20"
            }`}
          >
            都道府県で選択
          </button>
          <button
            type="button"
            onClick={() => setLocationMode("coordinates")}
            className={`flex-1 py-2 px-3 rounded-lg text-xs transition-all ${
              locationMode === "coordinates"
                ? "bg-gold/20 text-gold border border-gold/40"
                : "bg-white/[0.03] text-text-muted border border-white/10 hover:border-white/20"
            }`}
          >
            緯度経度で入力
          </button>
        </div>

        {locationMode === "prefecture" ? (
          <select
            value={birthPlace}
            onChange={(e) => setBirthPlace(e.target.value)}
            className="w-full bg-white/[0.03] border border-white/10 rounded-lg py-3 px-3 text-text text-sm outline-none transition-all focus:border-gold focus:bg-white/[0.05]"
          >
            <option value="">都道府県を選択</option>
            {PREFECTURES.map((pref) => (
              <option key={pref} value={pref}>
                {pref}
              </option>
            ))}
          </select>
        ) : (
          <div className="space-y-3">
            <div className="flex gap-2.5">
              <div className="flex-1">
                <input
                  type="text"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  placeholder="緯度（例: 35.6762）"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-lg py-3 px-3 text-text text-sm outline-none transition-all focus:border-gold focus:bg-white/[0.05] placeholder:text-text-muted"
                />
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  placeholder="経度（例: 139.6503）"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-lg py-3 px-3 text-text text-sm outline-none transition-all focus:border-gold focus:bg-white/[0.05] placeholder:text-text-muted"
                />
              </div>
            </div>
            <p className="text-xs text-accent">
              💡 Google Mapsで場所を右クリック → 座標をコピーできます
            </p>
          </div>
        )}
        
        <p className="text-xs text-text-muted pl-4 border-l border-divider">
          {locationMode === "prefecture" 
            ? "生まれた場所によって、星の見え方（ハウス）が変わります。"
            : "緯度経度を指定すると、より正確なハウス計算ができます。"
          }
        </p>
      </div>

      {/* 解説スタイル（内部用、フォーム外で選択済み） */}
      <input type="hidden" name="style" value={style} />

      {/* Submit Button */}
      <div className="text-center pt-6">
        <Button type="submit" size="lg" disabled={isLoading}>
          {isLoading ? "計算中..." : "無料で占う"}
        </Button>
        <p className="mt-5 text-xs text-text-muted tracking-wider">
          <span className="inline-flex items-center gap-1 mx-2.5">
            <span className="text-gold">✓</span> 約1分で結果表示
          </span>
          <span className="inline-flex items-center gap-1 mx-2.5">
            <span className="text-gold">✓</span> 登録不要
          </span>
          <span className="inline-flex items-center gap-1 mx-2.5">
            <span className="text-gold">✓</span> 入力情報は占いのみに使用
          </span>
        </p>
      </div>
    </form>
  );
}

// Style Selector Component
interface StyleSelectorProps {
  value: ReadingStyle;
  onChange: (style: ReadingStyle) => void;
}

export function StyleSelector({ value, onChange }: StyleSelectorProps) {
  const styles = Object.entries(READING_STYLES) as [ReadingStyle, typeof READING_STYLES.praise][];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {styles.map(([key, style]) => (
        <button
          key={key}
          type="button"
          onClick={() => onChange(key)}
          className={`
            relative p-6 rounded-xl border transition-all duration-300 text-left
            ${
              value === key
                ? "border-gold bg-gradient-to-br from-[rgba(40,45,65,0.9)] to-[rgba(15,20,36,0.95)]"
                : "border-card-border bg-card hover:border-accent"
            }
          `}
        >
          {value === key && (
            <span className="absolute top-3 right-3 w-5 h-5 bg-gold rounded-full flex items-center justify-center text-bg text-[0.7rem]">
              ✓
            </span>
          )}
          <div className="font-serif text-base mb-3">
            {style.emoji} {style.ja}
          </div>
          <p className="text-sm text-text bg-black/20 p-3.5 rounded-lg leading-relaxed">
            {style.example}
          </p>
        </button>
      ))}
    </div>
  );
}
