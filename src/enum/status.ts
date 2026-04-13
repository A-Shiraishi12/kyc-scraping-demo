/** 在庫状況 */
export const STATUS = {
  /** 在庫あり */
  IN_STOCK: 1,
  /** 在庫なし */
  NO_STOCK: 2,
  /** 商品が存在しない */
  NOT_EXIST: 3,
  /** スクレーピング失敗 */
  SCRAPING_FAILED: 4,
} as const;
/** 在庫状況 */
export type STATUS = (typeof STATUS)[keyof typeof STATUS];
