# 每週訓練肌群圖

靜態頁面。開啟 `index.html` 即可查看肌群圖和訓練紀錄。

- 課表在 `data.js`。
- 訓練紀錄在 `log.js`。新的一堂加在 `TRAINING_LOG` 陣列最後面，畫面會自己把最新的日期排到上面。

## 加一筆訓練紀錄

完整說明在 `log.js` 最上面。日期用 `YYYY-MM-DD`。`day` 是 `A`、`B`、`C` 或 `other`。同一台機器的 `machine` 要每次都寫成同一個字串；換機器就換名字，不要併在一起。重量用 `lb`（磅）或 `kg`（公斤），單邊加 `perSide: true`。

```javascript
{
  date: '2026-11-23',
  day: 'A',
  status: 'in-progress', // 練完就刪掉這行
  note: '',
  exercises: [
    { machine: '腿推機', sets: [ { weight: 270, unit: 'lb', reps: [10, 9, 9] } ] }
  ],
  runs: [
    { machine: '跑步機', distanceKm: 5.65, time: '47:12', pace: '8:21', avgHr: 146, zone: 'Zone 2' }
  ]
}
```
