// 課表資料：修改這裡即可更新網頁。肌群名稱需對應 MUSCLES 的 key。
window.MUSCLES = {
  '胸大肌': ['pec-upper', 'pec-lower'],
  '上胸': ['pec-upper'],
  '前三角': ['delt-front'],
  '中三角': ['delt-side'],
  '後三角': ['delt-rear'],
  '肱二頭': ['biceps'],
  '肱肌': ['brachialis'],
  '肱三頭': ['triceps'],
  '前臂': ['forearm'],
  '斜方肌上部': ['trap-upper'],
  '斜方肌中部': ['trap-mid'],
  '斜方肌下部': ['trap-lower'],
  '斜方肌中下部': ['trap-mid', 'trap-lower'],
  '菱形肌': ['rhomboid'],
  '大圓肌': ['teres'],
  '背闊肌': ['lats'],
  '腹直肌': ['rectus'],
  '腹斜肌': ['obliques'],
  '豎脊肌': ['erector'],
  '核心（腹直肌、腹斜肌、豎脊肌）': ['rectus', 'obliques', 'erector'],
  '臀大肌': ['glute-max'],
  '臀中肌、臀小肌': ['glute-med'],
  '股四頭': ['quads'],
  '內收肌': ['adductor'],
  '腿後肌群': ['hamstrings'],
  '小腿腓腸肌': ['calf']
};

window.DAYS = [
  {
    id: 'A', tab: 'Day A', title: '週一 · 偏推',
    exercises: [
      { name: '腿推機', sets: '3×8–10', primary: ['股四頭', '臀大肌'], secondary: ['內收肌', '腿後肌群'] },
      { name: '坐姿器械胸推', sets: '3×8–10', primary: ['胸大肌'], secondary: ['前三角', '肱三頭'] },
      { name: '滑輪下拉', sets: '3×10', primary: ['背闊肌'], secondary: ['大圓肌', '菱形肌', '肱二頭', '後三角'] },
      { name: '側平舉', sets: '3×12–15', primary: ['中三角'], secondary: ['斜方肌上部'] },
      { name: 'cable 三頭下壓', sets: '2×12', primary: ['肱三頭'], secondary: [] },
      { name: '器械捲腹', sets: '2×12', primary: ['腹直肌'], secondary: ['腹斜肌'] }
    ]
  },
  {
    id: 'B', tab: 'Day B', title: '週二 · 偏拉',
    exercises: [
      { name: '坐姿腿彎舉', sets: '3×10–12', primary: ['腿後肌群'], secondary: ['小腿腓腸肌'] },
      { name: '坐姿划船機', sets: '3×8–10', primary: ['背闊肌', '菱形肌', '斜方肌中下部'], secondary: ['後三角', '肱二頭'] },
      { name: '器械上斜胸推', sets: '3×10', primary: ['上胸'], secondary: ['前三角', '肱三頭'] },
      { name: '蝴蝶機反向飛鳥', sets: '3×12–15', primary: ['後三角'], secondary: ['菱形肌', '斜方肌中部'] },
      { name: 'cable 二頭彎舉', sets: '2×12', primary: ['肱二頭'], secondary: ['肱肌', '前臂'] },
      { name: '髖外展機', sets: '2×15', primary: ['臀中肌、臀小肌'], secondary: [] }
    ]
  },
  {
    id: 'C', tab: 'Day C', title: '週四 · 有氧',
    note: '11/29（日）有 6K 比賽，賽前兩天（11/27、11/28）不練腿。',
    exercises: [
      { name: '跑步機 Zone 2', sets: '5–6 公里', primary: ['股四頭', '腿後肌群', '臀大肌', '小腿腓腸肌'], secondary: ['核心（腹直肌、腹斜肌、豎脊肌）'] }
    ]
  }
];
