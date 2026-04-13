import { STATUS } from '../enum/status';

/**
 * 商品情報です。
 */
export type Item = {
  /** JANコード */
  janCode: string;
  /** ユーザーに表示するURL */
  url: string;
  /** 在庫状況 */
  status: STATUS;
  /** 価格(税込) */
  price: number | undefined;
  /** ECサイトID */
  siteId: string;
  /** ECサイト名 */
  siteName: string;
  /** スクレイピング失敗時のエラーメッセージ */
  errorMessage?: string;
  /** スクレイピング失敗時のhtml要素 */
  errorHtml?: string;
};
