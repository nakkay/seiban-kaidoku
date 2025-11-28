/**
 * チャートデータをAstro-Seek形式のテキストに変換
 * AIへの入力として使用
 */

import type { ChartData, Planet, Point, Aspect } from "@/types";

/**
 * 度数をテキスト形式に変換（例: "24°30'"）
 */
function formatDegree(degree: number): string {
  const deg = Math.floor(degree);
  const min = Math.round((degree - deg) * 60);
  return `${deg}°${String(min).padStart(2, "0")}'`;
}

/**
 * 星座名を英語に変換
 */
function getSignEnglish(sign: string): string {
  const signMap: Record<string, string> = {
    aries: "Aries",
    taurus: "Taurus",
    gemini: "Gemini",
    cancer: "Cancer",
    leo: "Leo",
    virgo: "Virgo",
    libra: "Libra",
    scorpio: "Scorpio",
    sagittarius: "Sagittarius",
    capricorn: "Capricorn",
    aquarius: "Aquarius",
    pisces: "Pisces",
  };
  return signMap[sign] || sign;
}

/**
 * 惑星名を英語に変換
 */
function getPlanetEnglish(name: string): string {
  const planetMap: Record<string, string> = {
    sun: "Sun",
    moon: "Moon",
    mercury: "Mercury",
    venus: "Venus",
    mars: "Mars",
    jupiter: "Jupiter",
    saturn: "Saturn",
    uranus: "Uranus",
    neptune: "Neptune",
    pluto: "Pluto",
    northNode: "North Node",
    chiron: "Chiron",
    lilith: "Lilith",
    fortune: "Fortune",
    vertex: "Vertex",
    asc: "ASC",
    mc: "MC",
  };
  return planetMap[name] || name;
}

/**
 * アスペクトタイプを英語に変換
 */
function getAspectEnglish(type: string): string {
  const aspectMap: Record<string, string> = {
    conjunction: "Conjunction",
    opposition: "Opposition",
    trine: "Trine",
    square: "Square",
    sextile: "Sextile",
    semisextile: "Semi-sextile",
    semisquare: "Semi-square",
    quintile: "Quintile",
    sesquiquadrate: "Sesquiquadrate",
    biquintile: "Bi-quintile",
    quincunx: "Quincunx",
  };
  return aspectMap[type] || type;
}

/**
 * 惑星をテキスト形式に変換
 */
function formatPlanet(planet: Planet, isTimeKnown: boolean): string {
  const name = getPlanetEnglish(planet.name);
  const sign = getSignEnglish(planet.sign);
  const degree = formatDegree(planet.degree);
  const retrograde = planet.retrograde ? ", Retrograde" : "";
  const house = isTimeKnown && planet.house ? `, in ${planet.house}${getOrdinal(planet.house)} House` : "";

  return `${name} in ${sign} ${degree}${retrograde}${house}`;
}

/**
 * 感受点をテキスト形式に変換
 */
function formatPoint(point: Point, isTimeKnown: boolean): string {
  const name = getPlanetEnglish(point.name);
  const sign = getSignEnglish(point.sign);
  const degree = formatDegree(point.degree);
  const house = isTimeKnown && point.house ? `, in ${point.house}${getOrdinal(point.house)} House` : "";

  return `${name} in ${sign} ${degree}${house}`;
}

/**
 * アスペクトをテキスト形式に変換
 */
function formatAspect(aspect: Aspect): string {
  const planet1 = getPlanetEnglish(aspect.planet1);
  const planet2 = getPlanetEnglish(aspect.planet2);
  const type = getAspectEnglish(aspect.type);
  const applying = aspect.applying ? "Applying" : "Separating";

  return `${planet1} ${type} ${planet2} (Orb: ${aspect.orb}°, ${applying})`;
}

/**
 * 序数を取得
 */
function getOrdinal(n: number): string {
  const suffixes = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0];
}

/**
 * ハウスをテキスト形式に変換
 */
function formatHouse(houseNumber: number, sign: string, degree: number): string {
  return `${houseNumber}${getOrdinal(houseNumber)} House in ${getSignEnglish(sign)} ${formatDegree(degree)}`;
}

/**
 * チャートデータをAstro-Seek形式のテキストに変換
 */
export function formatChartDataForAI(chartData: ChartData): string {
  const lines: string[] = [];
  const isTimeKnown = chartData.birthData.isTimeKnown;

  // 惑星
  for (const planet of chartData.planets) {
    lines.push(formatPlanet(planet, isTimeKnown));
  }

  // 感受点
  for (const point of chartData.points) {
    lines.push(formatPoint(point, isTimeKnown));
  }

  // ハウス（出生時刻がわかる場合のみ）
  if (isTimeKnown && chartData.houses.length > 0) {
    lines.push(""); // 空行
    for (const house of chartData.houses) {
      lines.push(formatHouse(house.number, house.sign, house.degree));
    }
  }

  // アスペクト
  if (chartData.aspects.length > 0) {
    lines.push(""); // 空行
    for (const aspect of chartData.aspects) {
      lines.push(formatAspect(aspect));
    }
  }

  return lines.join("\n");
}

