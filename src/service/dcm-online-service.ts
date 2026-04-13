import { SITE } from '../enum/site';
import { STATUS } from '../enum/status';
import { Item } from '../model/item';
import { HtmlService } from './html-service';

/**
 * DCMオンラインサービスクラスです。
 */
export class DcmOnlineService {
  /**
   * 商品情報を取得します。
   * @param janCode JANコード
   * @returns 商品情報
   */
  public async getItem(janCode: string): Promise<Item> {
    const url = this.getItemUrl(janCode);
    const service = new HtmlService(url);
    const $ = await service.load();

    const status = this.getItemStatus($);
    const price =
      status === STATUS.IN_STOCK || status === STATUS.NO_STOCK
        ? this.getItemPrice($)
        : undefined;

    return {
      janCode,
      url,
      status,
      price,
      siteId: SITE.DCM_ONLINE.id,
      siteName: SITE.DCM_ONLINE.name,
    };
  }

  /**
   * 商品のURLを取得します。
   * @param janCode JANコード
   * @returns 商品のURL
   */
  private getItemUrl(janCode: string): string {
    const urlObj = new URL('https://www.dcm-ekurashi.com/search/?');
    urlObj.searchParams.set('limit', '1');
    urlObj.searchParams.set('dispNo', '');
    urlObj.searchParams.set('q', janCode);
    return urlObj.toString();
  }

  /**
   * 価格を取得します。
   * @param $ 商品のURLコンテンツ
   * @returns 価格
   */
  private getItemPrice($: JQueryStatic): number | undefined {
    const priceNode = $('div#container')
      .children('div#itemList')
      .children('div#contents')
      .children('div.contents-wrap')
      .children('div.itemSearchBlock')
      .children('div.list-block')
      .children('div.item-box')
      .children('a')
      .children('div.detail')
      .children('div.price')
      .children('p')
      .children('span')
      .first();

    const priceText = priceNode
      .text()
      .trim()
      .replaceAll(/[^0-9]|\./g, '');
    const price = priceText.length > 0 ? +priceText : undefined;
    return Number.isNaN(price) ? undefined : price;
  }

  /**
   * 商品の在庫状況を取得します。
   * 検索結果ページのicon_soldout.gifの有無で判定します。
   * @param $ 商品のURLコンテンツ
   * @returns 商品の在庫状況
   */
  private getItemStatus($: JQueryStatic): STATUS {
    const notFound = $('div#container')
      .children('div#itemList')
      .children('div#contents')
      .children('div.contents-wrap')
      .children('div.list-block')
      .children('div[style]')
      .text()
      .match(/該当する結果がありません/);

    if (notFound) {
      return STATUS.NOT_EXIST;
    }

    const price = this.getItemPrice($);
    if (typeof price !== 'number') {
      return STATUS.SCRAPING_FAILED;
    }

    const soldoutIcon = $('div.item-box img[src*="icon_soldout"]');
    return soldoutIcon.length > 0 ? STATUS.NO_STOCK : STATUS.IN_STOCK;
  }
}
