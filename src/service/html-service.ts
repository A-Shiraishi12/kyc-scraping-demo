import jq from 'jquery';
import { JSDOM } from 'jsdom';
import puppeteer, { Browser } from 'puppeteer';

/**
 * HTMLサービスクラスです。
 * Puppeteerで実際のブラウザを開いてページを取得します。
 */
export class HtmlService {
  /** URL */
  public url: string;

  /** ブラウザインスタンス（共有） */
  private static browser: Browser | null = null;

  /**
   * コンストラクタです。
   * @param url URL
   */
  public constructor(url: string) {
    this.url = url;
  }

  /**
   * ブラウザを起動します（未起動の場合のみ）。
   */
  private static async getBrowser(): Promise<Browser> {
    if (!this.browser || !this.browser.connected) {
      this.browser = await puppeteer.launch({
        headless: false,
        defaultViewport: { width: 1280, height: 900 },
        executablePath:
          '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        timeout: 120000,
      });
    }
    return this.browser;
  }

  /**
   * ブラウザを閉じます。
   */
  public static async closeBrowser(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  /**
   * HTMLを取得します。
   * @returns HTML（JQuery）
   */
  public async load(): Promise<JQueryStatic> {
    const browser = await HtmlService.getBrowser();
    const page = await browser.newPage();

    try {
      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:131.0) Gecko/20100101 Firefox/131.0'
      );

      console.log(`  アクセス中: ${this.url}`);
      await page.goto(this.url, {
        waitUntil: 'networkidle2',
        timeout: 120000,
      });

      const html = await page.content();

      const dom = new JSDOM(html, { url: this.url });
      const $ = <JQueryStatic>(<unknown>jq(dom.window));
      return $;
    } finally {
      await page.close();
    }
  }
}
