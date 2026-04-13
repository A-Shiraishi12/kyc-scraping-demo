import { DcmOnlineService } from './service/dcm-online-service';
import { HtmlService } from './service/html-service';

const main = async () => {
  const janCode = process.argv[2];
  if (!janCode) {
    console.error('使い方: npm run scrape -- <JANコード>');
    console.error('例: npm run scrape -- 4549292157734');
    process.exit(1);
  }

  console.log(`DCMオンラインで ${janCode} を検索中...`);

  const service = new DcmOnlineService();
  const item = await service.getItem(janCode);

  console.log('\n--- 結果 ---');
  console.log(`JANコード: ${item.janCode}`);
  console.log(`サイト: ${item.siteName}`);
  console.log(
    `ステータス: ${
      item.status === 1
        ? '在庫あり'
        : item.status === 2
          ? '在庫なし'
          : item.status === 3
            ? '商品なし'
            : 'スクレーピング失敗'
    }`
  );
  console.log(`価格: ${item.price != null ? `${item.price}円` : '-'}`);
  console.log(`URL: ${item.url}`);

  await HtmlService.closeBrowser();
};

main().catch((e) => {
  console.error('エラー:', e);
  process.exit(1);
});
