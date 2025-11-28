/**
 * astronomia パッケージの型定義
 */

declare module "astronomia" {
  export const julian: {
    Calendar: new (year: number, month: number, day: number) => {
      toJD(): number;
    };
  };
  export const solar: {
    apparentLongitude(T: number): number;
  };
  export const moonposition: {
    position(jd: number): { lon: number; lat: number; range: number };
  };
  export const planetposition: {
    Planet: new (data: unknown) => {
      position(jd: number): { lon: number; lat: number; range: number };
      position2000(jd: number): { lon: number; lat: number; range: number };
    };
  };
  export const sidereal: {
    mean(jd: number): number;
    apparent(jd: number): number;
  };
}

declare module "astronomia/data" {
  const earth: unknown;
  const mercury: unknown;
  const venus: unknown;
  const mars: unknown;
  const jupiter: unknown;
  const saturn: unknown;
  const uranus: unknown;
  const neptune: unknown;
  export { earth, mercury, venus, mars, jupiter, saturn, uranus, neptune };
}
