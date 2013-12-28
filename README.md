圖博資訊網站
------------

整合各個圖博新聞網站資料

[Facebook 社團](https://www.facebook.com/groups/646397608752333/)

## 安裝

```bash
$ git clone git@github.com:g0v/tibet.git
$ cd tibet
$ npm install
```

## RSS

### 更新 RSS 資料

```bash
$ npm run rss
```

### 設定 RSS 來源

在 `config.json` 下的 `rss` 加入一筆來源設定，選項如下

* url: RSS 位置
* filters: 第一個 `.` 之前代表 filter 名稱，後面會變成參數帶入定義好的 filter

#### Example

使用 `keyword` 這個 filter 然後把 `西藏` 帶入 `keyword`

```json
{
  "rss": [
    {"url": "http://www.voachinese.com/api/", "filters": ["keyword.西藏"]}
  ]
}
```
