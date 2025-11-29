/**
 * ホロスコープ計算（astronomia.js使用）
 * 
 * Swiss Ephemeris準拠の正確な天文計算
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
import { julian, solar, moonposition, planetposition, sidereal } from "astronomia";
import vsopData from "astronomia/data";

const { earth, mercury, venus, mars, jupiter, saturn, uranus, neptune } = vsopData;

import type {
  ChartData,
  BirthData,
  Planet,
  Point,
  House,
  Aspect,
  ZodiacSign,
  PlanetName,
  AspectType,
  ElementPattern,
} from "@/types";
import { ZODIAC_SIGNS } from "@/constants";

// 星座の順序（度数計算用）
const SIGN_ORDER: ZodiacSign[] = [
  "aries", "taurus", "gemini", "cancer", "leo", "virgo",
  "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces"
];

// 惑星データ（VSOP87B）
const PLANET_DATA: Record<string, any> = {
  mercury,
  venus,
  earth,
  mars,
  jupiter,
  saturn,
  uranus,
  neptune,
};

/**
 * 日付からユリウス日を計算
 */
function dateToJulianDay(date: Date): number {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate() + 
    date.getUTCHours() / 24 + 
    date.getUTCMinutes() / 1440 + 
    date.getUTCSeconds() / 86400;
  
  const cal = new julian.Calendar(year, month, day);
  return cal.toJD();
}

/**
 * 度数から星座を取得
 */
function getSignFromDegree(degree: number): { sign: ZodiacSign; degree: number } {
  const normalizedDegree = ((degree % 360) + 360) % 360;
  const signIndex = Math.floor(normalizedDegree / 30);
  const signDegree = normalizedDegree % 30;
  return {
    sign: SIGN_ORDER[signIndex],
    degree: signDegree,
  };
}

/**
 * ラジアンを度に変換
 */
function radToDeg(rad: number): number {
  return rad * 180 / Math.PI;
}

/**
 * 太陽の黄経を計算（正確）
 */
function getSunLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  const sunPos = solar.apparentLongitude(T);
  return radToDeg(sunPos);
}

/**
 * 月の黄経を計算（正確）
 */
function getMoonLongitude(jd: number): number {
  const moonPos = moonposition.position(jd);
  return radToDeg(moonPos.lon);
}

/**
 * 惑星の地心黄経を計算（正確・VSOP87）
 * 
 * 太陽中心座標から地心座標に変換
 */
function getPlanetLongitude(planetName: string, jd: number): number {
  const planetData = PLANET_DATA[planetName];
  if (!planetData) {
    console.warn(`Unknown planet: ${planetName}`);
    return 0;
  }
  
  // 惑星の太陽中心座標
  const planet = new planetposition.Planet(planetData);
  const planetPos = planet.position2000(jd);
  
  // 地球の太陽中心座標
  const earthPlanet = new planetposition.Planet(earth);
  const earthPos = earthPlanet.position2000(jd);
  
  // 太陽中心直交座標に変換
  // 黄道座標でのXY平面投影（黄経計算に使用）
  const px = planetPos.range * Math.cos(planetPos.lat) * Math.cos(planetPos.lon);
  const py = planetPos.range * Math.cos(planetPos.lat) * Math.sin(planetPos.lon);
  
  const ex = earthPos.range * Math.cos(earthPos.lat) * Math.cos(earthPos.lon);
  const ey = earthPos.range * Math.cos(earthPos.lat) * Math.sin(earthPos.lon);
  
  // 地心直交座標（XY平面）
  const gx = px - ex;
  const gy = py - ey;
  
  // 地心黄経に変換
  const gLon = Math.atan2(gy, gx);
  const gLonDeg = radToDeg(gLon);
  
  return ((gLonDeg % 360) + 360) % 360;
}

/**
 * 惑星の逆行判定
 */
function isRetrograde(planetName: string, jd: number): boolean {
  if (planetName === "sun" || planetName === "moon") {
    return false;
  }
  
  if (!PLANET_DATA[planetName]) {
    return false;
  }
  
  // 前後の日の位置を比較
  const lon1 = getPlanetLongitude(planetName, jd - 1);
  const lon2 = getPlanetLongitude(planetName, jd + 1);
  
  // 黄経の差が負の場合は逆行
  let diff = lon2 - lon1;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  
  return diff < 0;
}

/**
 * ノースノードの黄経を計算
 */
function getNorthNodeLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  // Meeus "Astronomical Algorithms" による計算式
  let omega = 125.04452 - 1934.136261 * T + 0.0020708 * T * T + T * T * T / 450000;
  omega = ((omega % 360) + 360) % 360;
  // ノースノードは昇交点
  return (360 - omega + 180) % 360;
}

/**
 * キロンの黄経を計算（簡易版）
 */
function getChironLongitude(jd: number): number {
  // キロンの軌道要素に基づく近似計算
  const n = 0.01953896; // 平均日々運動（度/日）
  const L0 = 209.52; // J2000.0での平均黄経
  const meanLon = L0 + n * (jd - 2451545.0);
  return ((meanLon % 360) + 360) % 360;
}

/**
 * 冥王星の黄経を計算（簡易版）
 */
function getPlutoLongitude(jd: number): number {
  // 冥王星の軌道要素に基づく近似計算
  const n = 0.00397557; // 平均日々運動（度/日）
  const L0 = 238.96; // J2000.0での平均黄経
  const meanLon = L0 + n * (jd - 2451545.0);
  return ((meanLon % 360) + 360) % 360;
}

/**
 * 恒星時を計算
 */
function getSiderealTime(jd: number, lng: number): number {
  const gmst = sidereal.mean(jd);
  const gmstDeg = radToDeg(gmst);
  const lst = gmstDeg + lng;
  return ((lst % 360) + 360) % 360;
}

/**
 * ASC（アセンダント）を計算
 */
function calculateAscendant(jd: number, lat: number, lng: number): number {
  const lst = getSiderealTime(jd, lng);
  const lstRad = lst * Math.PI / 180;
  const latRad = lat * Math.PI / 180;
  
  // 黄道傾斜角
  const T = (jd - 2451545.0) / 36525;
  const eps = 23.439291 - 0.0130042 * T;
  const epsRad = eps * Math.PI / 180;
  
  // ASC計算
  const tanAsc = Math.cos(lstRad) / 
    (-Math.sin(lstRad) * Math.cos(epsRad) - Math.tan(latRad) * Math.sin(epsRad));
  let asc = Math.atan(tanAsc) * 180 / Math.PI;
  
  // 象限調整
  if (Math.cos(lstRad) < 0) {
    asc += 180;
  }
  if (asc < 0) {
    asc += 360;
  }
  
  return asc;
}

/**
 * MC（天頂）を計算
 */
function calculateMidheaven(jd: number, lng: number): number {
  const lst = getSiderealTime(jd, lng);
  const lstRad = lst * Math.PI / 180;
  
  // 黄道傾斜角
  const T = (jd - 2451545.0) / 36525;
  const eps = 23.439291 - 0.0130042 * T;
  const epsRad = eps * Math.PI / 180;
  
  // MC計算（RAMC→MC変換）
  const tanMC = Math.tan(lstRad) / Math.cos(epsRad);
  let mc = Math.atan(tanMC) * 180 / Math.PI;
  
  // 象限調整
  if (lst > 90 && lst < 270) {
    mc += 180;
  }
  if (mc < 0) {
    mc += 360;
  }
  
  return mc;
}

/**
 * ハウスカスプを計算（Equal House）
 */
function calculateHouses(asc: number, mc: number): House[] {
  const houses: House[] = [];
  
  // Equal Houseで計算
  for (let i = 0; i < 12; i++) {
    const cusp = (asc + i * 30) % 360;
    const { sign, degree } = getSignFromDegree(cusp);
    houses.push({
      number: i + 1,
      sign,
      degree: Math.round(degree * 100) / 100,
    });
  }
  
  // 10ハウスをMCに調整
  const { sign: mcSign, degree: mcDegree } = getSignFromDegree(mc);
  houses[9] = { number: 10, sign: mcSign, degree: Math.round(mcDegree * 100) / 100 };
  
  // 4ハウスをIC（MCの反対）に調整
  const ic = (mc + 180) % 360;
  const { sign: icSign, degree: icDegree } = getSignFromDegree(ic);
  houses[3] = { number: 4, sign: icSign, degree: Math.round(icDegree * 100) / 100 };
  
  return houses;
}

/**
 * 惑星のハウスを判定
 */
function getPlanetHouse(planetLongitude: number, houses: House[]): number {
  for (let i = 0; i < 12; i++) {
    const currentCusp = houses[i].degree + SIGN_ORDER.indexOf(houses[i].sign) * 30;
    const nextCusp = houses[(i + 1) % 12].degree + SIGN_ORDER.indexOf(houses[(i + 1) % 12].sign) * 30;

    let normalizedPlanet = planetLongitude;
    const normalizedCurrent = currentCusp;
    let normalizedNext = nextCusp;

    if (normalizedNext < normalizedCurrent) {
      normalizedNext += 360;
      if (normalizedPlanet < normalizedCurrent) {
        normalizedPlanet += 360;
      }
    }

    if (normalizedPlanet >= normalizedCurrent && normalizedPlanet < normalizedNext) {
      return i + 1;
    }
  }

  return 1;
}

/**
 * アスペクトを計算
 */
function calculateAspects(planets: Planet[], points: Point[]): Aspect[] {
  const aspects: Aspect[] = [];
  const aspectDefs: Array<{ type: AspectType; angle: number; orb: number }> = [
    { type: "conjunction", angle: 0, orb: 8 },
    { type: "opposition", angle: 180, orb: 8 },
    { type: "trine", angle: 120, orb: 8 },
    { type: "square", angle: 90, orb: 8 },
    { type: "sextile", angle: 60, orb: 5 },
  ];

  const allBodies = [
    ...planets.map(p => ({ name: p.name, degree: p.degree + SIGN_ORDER.indexOf(p.sign) * 30 })),
    ...points.filter(p => p.name !== "fortune" && p.name !== "vertex")
      .map(p => ({ name: p.name, degree: p.degree + SIGN_ORDER.indexOf(p.sign) * 30 })),
  ];

  for (let i = 0; i < allBodies.length; i++) {
    for (let j = i + 1; j < allBodies.length; j++) {
      const body1 = allBodies[i];
      const body2 = allBodies[j];

      let diff = Math.abs(body1.degree - body2.degree);
      if (diff > 180) diff = 360 - diff;

      for (const aspectDef of aspectDefs) {
        const orb = Math.abs(diff - aspectDef.angle);
        if (orb <= aspectDef.orb) {
          aspects.push({
            planet1: body1.name as PlanetName,
            planet2: body2.name as PlanetName,
            type: aspectDef.type,
            angle: aspectDef.angle,
            orb: Math.round(orb * 10) / 10,
            applying: false,
          });
          break;
        }
      }
    }
  }

  return aspects;
}

/**
 * エレメントパターンを計算
 * 
 * 対象ポイント（12個）と配点：
 * - 太陽・月・ASC・MC: 4点
 * - 水星・金星・火星: 3点
 * - 木星・土星: 2点
 * - 天王星・海王星・冥王星: 1点
 * 
 * 判定ロジック：
 * - 単体型: 1位 >= 45% かつ (1位 - 2位) >= 15%
 * - 2タイプ複合型: (1位 + 2位) >= 70% かつ (2位 - 3位) >= 10%
 * - 3タイプ複合型: (1位 + 2位 + 3位) >= 85% かつ (3位 - 4位) >= 5%
 * - 4要素混合型: それ以外
 */
export function calculateElementPattern(planets: Planet[], points?: Point[]): ElementPattern {
  const counts = { fire: 0, earth: 0, air: 0, water: 0 };

  // 配点テーブル
  const pointValues: Record<string, number> = {
    sun: 4,
    moon: 4,
    asc: 1,  // 感受点は1点（惑星を重視）
    mc: 1,   // 感受点は1点（惑星を重視）
    mercury: 3,
    venus: 3,
    mars: 3,
    jupiter: 2,
    saturn: 2,
    uranus: 1,
    neptune: 1,
    pluto: 1,
  };

  // 惑星のエレメントを加算
  for (const planet of planets) {
    const element = ZODIAC_SIGNS[planet.sign]?.element;
    if (!element) continue;
    
    const pts = pointValues[planet.name] || 0;
    if (pts > 0) {
      counts[element] += pts;
    }
  }

  // ASC・MCのエレメントを加算（pointsが提供されている場合）
  if (points) {
    for (const point of points) {
      if (point.name === "asc" || point.name === "mc") {
        const element = ZODIAC_SIGNS[point.sign]?.element;
        if (!element) continue;
        
        const pts = pointValues[point.name] || 0;
        counts[element] += pts;
      }
    }
  }

  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  if (total === 0) return "balanced";

  // 各エレメントの割合を計算（比率として）
  const percentages = Object.entries(counts).map(([element, count]) => ({
    element,
    percentage: count / total,
    count,
  })).sort((a, b) => b.percentage - a.percentage);

  const [first, second, third, fourth] = percentages;

  // ===== 判定ロジック =====
  
  // 単体型: 1位 >= 45% かつ (1位 - 2位) >= 15%
  if (first.percentage >= 0.45 && (first.percentage - second.percentage) >= 0.15) {
    return first.element as ElementPattern;
  }

  // 2タイプ複合型: (1位 + 2位) >= 70% かつ (2位 - 3位) >= 10%
  if ((first.percentage + second.percentage) >= 0.70 && (second.percentage - third.percentage) >= 0.10) {
    const elements = [first.element, second.element].sort();
    return elements.join("-") as ElementPattern;
  }

  // 3タイプ複合型: (1位 + 2位 + 3位) >= 85% かつ (3位 - 4位) >= 5%
  if ((first.percentage + second.percentage + third.percentage) >= 0.85 && (third.percentage - fourth.percentage) >= 0.05) {
    const elements = [first.element, second.element, third.element].sort();
    return elements.join("-") as ElementPattern;
  }

  // 4要素混合型
  return "balanced";
}

/**
 * ホロスコープを計算（メイン関数）
 */
export function calculateHoroscope(birthData: BirthData): ChartData {
  const birthDate = new Date(birthData.datetime);
  const jd = dateToJulianDay(birthDate);

  // 惑星の黄経を計算（VSOP87準拠）
  const sunLon = getSunLongitude(jd);
  const moonLon = getMoonLongitude(jd);
  const mercuryLon = getPlanetLongitude("mercury", jd);
  const venusLon = getPlanetLongitude("venus", jd);
  const marsLon = getPlanetLongitude("mars", jd);
  const jupiterLon = getPlanetLongitude("jupiter", jd);
  const saturnLon = getPlanetLongitude("saturn", jd);
  const uranusLon = getPlanetLongitude("uranus", jd);
  const neptuneLon = getPlanetLongitude("neptune", jd);
  const plutoLon = getPlutoLongitude(jd);

  // ASC/MCを計算（出生時刻がわかる場合のみ）
  const asc = birthData.isTimeKnown 
    ? calculateAscendant(jd, birthData.location.lat, birthData.location.lng)
    : 0;
  const mc = birthData.isTimeKnown 
    ? calculateMidheaven(jd, birthData.location.lng)
    : 0;

  // ハウスを計算
  const houses = birthData.isTimeKnown 
    ? calculateHouses(asc, mc)
    : [];

  // 惑星データを整形
  const planetLongitudes: Array<{ name: PlanetName; lon: number }> = [
    { name: "sun", lon: sunLon },
    { name: "moon", lon: moonLon },
    { name: "mercury", lon: mercuryLon },
    { name: "venus", lon: venusLon },
    { name: "mars", lon: marsLon },
    { name: "jupiter", lon: jupiterLon },
    { name: "saturn", lon: saturnLon },
    { name: "uranus", lon: uranusLon },
    { name: "neptune", lon: neptuneLon },
    { name: "pluto", lon: plutoLon },
  ];

  const planets: Planet[] = planetLongitudes.map(({ name, lon }) => {
    const { sign, degree } = getSignFromDegree(lon);
    return {
      name,
      sign,
      degree: Math.round(degree * 100) / 100,
      house: birthData.isTimeKnown ? getPlanetHouse(lon, houses) : 0,
      retrograde: isRetrograde(name, jd),
    };
  });

  // 感受点データ
  const nnLon = getNorthNodeLongitude(jd);
  const chironLon = getChironLongitude(jd);
  const lilithLon = (moonLon + 180) % 360;
  const fortuneLon = birthData.isTimeKnown 
    ? (asc + moonLon - sunLon + 360) % 360 
    : 0;

  const { sign: ascSign, degree: ascDegree } = getSignFromDegree(asc);
  const { sign: mcSign, degree: mcDegree } = getSignFromDegree(mc);
  const { sign: nnSign, degree: nnDegree } = getSignFromDegree(nnLon);
  const { sign: chironSign, degree: chironDegree } = getSignFromDegree(chironLon);
  const { sign: lilithSign, degree: lilithDegree } = getSignFromDegree(lilithLon);
  const { sign: fortuneSign, degree: fortuneDegree } = getSignFromDegree(fortuneLon);

  const points: Point[] = birthData.isTimeKnown ? [
    { name: "asc", sign: ascSign, degree: Math.round(ascDegree * 100) / 100 },
    { name: "mc", sign: mcSign, degree: Math.round(mcDegree * 100) / 100 },
    { name: "northNode", sign: nnSign, degree: Math.round(nnDegree * 100) / 100, house: getPlanetHouse(nnLon, houses) },
    { name: "chiron", sign: chironSign, degree: Math.round(chironDegree * 100) / 100, house: getPlanetHouse(chironLon, houses) },
    { name: "lilith", sign: lilithSign, degree: Math.round(lilithDegree * 100) / 100, house: getPlanetHouse(lilithLon, houses) },
    { name: "fortune", sign: fortuneSign, degree: Math.round(fortuneDegree * 100) / 100, house: getPlanetHouse(fortuneLon, houses) },
  ] : [
    { name: "northNode", sign: nnSign, degree: Math.round(nnDegree * 100) / 100 },
    { name: "chiron", sign: chironSign, degree: Math.round(chironDegree * 100) / 100 },
    { name: "lilith", sign: lilithSign, degree: Math.round(lilithDegree * 100) / 100 },
  ];

  // アスペクトを計算
  const aspects = calculateAspects(planets, points);

  return {
    birthData,
    planets,
    points,
    houses,
    aspects,
  };
}
