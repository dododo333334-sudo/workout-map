/*
訓練紀錄

畫面讀這個檔案的 TRAINING_LOG。新的一堂加在陣列最後面（]; 的前面）。
不用插到最上面：畫面會依日期排序，最新的在最前。同一天有兩筆時，檔案裡較後面的那筆排前面。

每一筆長這樣：

{
  date: '2026-11-23',          // 必填，YYYY-MM-DD
  day: 'A',                    // 必填，'A'、'B'、'C'、'other' 四選一
  label: '胸日',               // 選填。day 是 other 時建議寫，例如「胸日」
  status: 'in-progress',       // 選填。只有還沒練完才寫 'in-progress'，練完就把這行刪掉
  note: '',                    // 選填。整堂課的備註。沒練的動作等整堂結束再寫，進行中先不要寫
  exercises: [                 // 選填。力量。沒有就整段省略
    {
      machine: '腿推機',       // 必填。這是分組用的名字，一個字都不差才會被當成同一台
      note: '',                // 選填。這個動作、這一天的備註
      sets: [
        { weight: 270, unit: 'lb', reps: [10, 9, 9] }
      ]
    }
  ],
  runs: [                      // 選填。跑步。沒有就整段省略
    {
      machine: '跑步機',       // 選填。沒寫會顯示「跑步」
      distanceKm: 5.65,        // 公里
      time: '47:12',           // 分:秒，或 時:分:秒
      pace: '8:21',            // 選填。每公里的配速。沒寫就用距離和時間算
      paceApprox: false,       // 選填。true 的話配速前面會加「約」
      avgHr: 146,              // 選填。平均心率
      zone: 'Zone 2',          // 選填
      note: ''                 // 選填
    }
  ]
}

day 怎麼填：
  'A'      週一 · 偏推
  'B'      週二 · 偏拉
  'C'      週四 · 有氧（Zone 2 跑步也用這個）
  'other'  上面以外的日子，另外用 label 寫那天是什麼

重量：
  unit 只寫 'lb'（畫面顯示磅）或 'kg'（畫面顯示公斤）。同一台機器請一直用同一個單位。
  單邊（兩邊各這個重量，例如掛槓片）加 perSide: true。
  熱身組加 warmup: true。
  空槓加 emptyBar: true，不用寫 weight。
  同一個重量做的每一組，把次數放進同一個 reps 陣列，例如 [8, 8, 7]。
  重量一改就另起一個 { weight, unit, reps }。reps 只做一組時也可以寫數字，例如 reps: 12。
  某一組重量要加註，在那個物件上加 note。

機器名稱：
  「依動作」用 machine 字串分組。請每次都複製同一個名字，標點也要一樣。
  同一個動作如果換了一台機器，要用不同的名字，不要併成一筆。
  例如「器械把手下拉（插銷）」、「滑輪下拉（橫握把）」和「下拉（雙單握把）」是不同台，必須分開。

範例（進行中的力量課）：

{
  date: '2026-11-23',
  day: 'A',
  status: 'in-progress',
  exercises: [
    {
      machine: '腿推機',
      sets: [
        { weight: 270, unit: 'lb', reps: [10, 9, 9] }
      ]
    }
  ]
}

範例（跑步）：

{
  date: '2026-11-19',
  day: 'C',
  runs: [
    { machine: '跑步機', distanceKm: 5.65, time: '47:12', pace: '8:21', avgHr: 146, zone: 'Zone 2' }
  ]
}
*/
window.TRAINING_LOG = [
  {
    date: '2026-11-09',
    day: 'other',
    label: '胸日',
    note: '新課表開始前。',
    exercises: [
      {
        machine: '坐姿器械胸推（掛槓片）',
        sets: [
          { weight: 35, unit: 'lb', perSide: true, reps: [8, 8, 7, 7] }
        ]
      },
      {
        machine: '器械坐姿上胸推（掛槓片）',
        sets: [
          { weight: 10, unit: 'lb', perSide: true, warmup: true, reps: [12] },
          { weight: 15, unit: 'lb', perSide: true, reps: [10, 9, 8] }
        ]
      },
      {
        machine: '器械斜躺肩推（插銷）',
        note: '原筆記寫「23kg 7下4組」。實際是先 23 公斤 7 下，再改 18 公斤做 8、8、8。',
        sets: [
          { weight: 23, unit: 'kg', reps: [7] },
          { weight: 18, unit: 'kg', reps: [8, 8, 8] }
        ]
      }
    ]
  },
  {
    date: '2026-11-11',
    day: 'other',
    label: '背日',
    note: '新課表開始前。',
    exercises: [
      {
        machine: '器械把手下拉（插銷）',
        sets: [
          { weight: 32, unit: 'lb', reps: [11, 11, 11, 11] }
        ]
      },
      {
        // 原話是「9下」，三組都記 9。前面先空槓熱身 12 下。
        machine: 'Newtech M-Torture 2-way row（掛槓片）',
        sets: [
          { emptyBar: true, warmup: true, reps: [12] },
          { weight: 10, unit: 'lb', perSide: true, reps: [9, 9, 9] }
        ]
      },
      {
        machine: '蝴蝶機反向飛鳥',
        sets: [
          { weight: 19, unit: 'kg', reps: [12, 12, 12, 12] }
        ]
      }
    ]
  },
  {
    // 週四 Zone 2，對應課表 Day C。
    // 筆記配速約 8:13/公里。用 42:00 ÷ 5.16 公里回推約 8:08，畫面顯示筆記上的 8:13。
    date: '2026-11-12',
    day: 'C',
    runs: [
      {
        machine: '跑步機',
        distanceKm: 5.16,
        time: '42:00',
        pace: '8:13',
        paceApprox: true,
        avgHr: 147,
        zone: 'Zone 2'
      }
    ]
  },
  {
    date: '2026-11-16',
    day: 'A',
    note: '器械捲腹沒練，機器客滿。',
    exercises: [
      {
        machine: '腿推機',
        sets: [
          { weight: 270, unit: 'lb', reps: [10, 8, 8] }
        ]
      },
      {
        // 筆記寫「坐姿胸推」。單邊掛片、重量與 11/09 相同，視為同一台，進度才接得起來。
        // 若其實是另一台，把 machine 改成不同的字串即可分開。
        machine: '坐姿器械胸推（掛槓片）',
        note: '筆記寫「坐姿胸推」。',
        sets: [
          { weight: 35, unit: 'lb', perSide: true, reps: [8, 8, 7] }
        ]
      },
      {
        machine: '站立式側平舉機（插銷）',
        sets: [
          { weight: 15, unit: 'lb', reps: [15, 14, 11] }
        ]
      },
      {
        machine: '滑輪下拉（橫握把）',
        note: '橫握把，跟 11/11 的器械把手下拉（插銷）不是同一台。',
        sets: [
          { weight: 36, unit: 'lb', reps: [12, 11, 10] }
        ]
      },
      {
        machine: 'Cable 三頭下壓',
        sets: [
          { weight: 10, unit: 'lb', reps: [14] },
          { weight: 12.5, unit: 'lb', reps: [8] }
        ]
      }
    ]
  },
  {
    date: '2026-11-17',
    day: 'B',
    note: '蝴蝶機反向飛鳥、cable 二頭彎舉、髖外展機沒練，機器客滿。',
    exercises: [
      {
        machine: '坐姿腿彎舉',
        sets: [
          { weight: 27.5, unit: 'kg', reps: [11, 10, 8] }
        ]
      },
      {
        machine: '坐姿划船機（插銷）',
        sets: [
          { weight: 60, unit: 'lb', reps: [11, 10, 10] }
        ]
      },
      {
        machine: '插銷式上斜胸推',
        sets: [
          { weight: 15, unit: 'lb', reps: [11] },
          { weight: 17.5, unit: 'lb', reps: [8, 7] }
        ]
      }
    ]
  },
  {
    // 筆記沒有另寫機器，與 11/12 一樣記跑步機。47:12 ÷ 5.65 公里 = 8:21。
    date: '2026-11-19',
    day: 'C',
    runs: [
      {
        machine: '跑步機',
        distanceKm: 5.65,
        time: '47:12',
        pace: '8:21',
        avgHr: 146,
        zone: 'Zone 2'
      }
    ]
  },
  {
    date: '2026-11-23',
    day: 'A',
    note: '捲腹機沒做（累了提早結束）。',
    exercises: [
      {
        machine: '腿推機',
        sets: [
          { weight: 270, unit: 'lb', reps: [10, 9, 9] }
        ]
      },
      {
        machine: '坐姿器械胸推（掛槓片）',
        sets: [
          { weight: 35, unit: 'lb', perSide: true, reps: [10, 8, 5] }
        ]
      },
      {
        // 雙單握把。跟器械把手下拉（插銷）、滑輪下拉（橫握把）都不是同一台。
        machine: '下拉（雙單握把）',
        sets: [
          { weight: 32, unit: 'kg', reps: [10, 10, 10] }
        ]
      },
      {
        machine: '站立式側平舉機（插銷）',
        sets: [
          { weight: 15, unit: 'lb', reps: [15, 14, 10] }
        ]
      },
      {
        machine: 'Cable 三頭下壓',
        sets: [
          { weight: 10, unit: 'lb', reps: [10] },
          { weight: 12.5, unit: 'lb', reps: [9] }
        ]
      }
    ]
  },
  {
    date: '2026-11-24',
    day: 'B',
    exercises: [
      {
        machine: '坐姿腿彎舉',
        sets: [
          { weight: 27.5, unit: 'kg', reps: [12, 9, 9] }
        ]
      },
      {
        machine: '坐姿划船機（插銷）',
        sets: [
          { weight: 70, unit: 'lb', reps: [10, 9, 9] }
        ]
      },
      {
        machine: '插銷式上斜胸推',
        sets: [
          { weight: 15, unit: 'lb', reps: [12, 12, 9] }
        ]
      },
      {
        machine: '蝴蝶機反向飛鳥',
        sets: [
          { weight: 19, unit: 'kg', reps: [13, 12, 12] }
        ]
      },
      {
        machine: 'Cable 二頭彎舉（繩索）',
        sets: [
          { weight: 7.5, unit: 'lb', reps: [13, 11] }
        ]
      },
      {
        machine: '髖外展機',
        sets: [
          { weight: 37.5, unit: 'lb', reps: [13] },
          { weight: 35, unit: 'lb', reps: [15] }
        ]
      }
    ]
  },
  {
    date: '2026-11-26',
    day: 'C',
    label: '室內步行',
    note: '跑步機室內步行（Life Fitness），比賽前保留腿力；總消耗 277 大卡',
    runs: [
      {
        machine: '跑步機步行（Life Fitness）',
        distanceKm: 3.37,
        time: '33:01',
        pace: '9:48',
        avgHr: 140,
        zone: 'Zone 2'
      }
    ]
  }
];
