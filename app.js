(function () {
  'use strict';
  var NS = 'http://www.w3.org/2000/svg';

  // 每個區塊的中文名稱（SVG <title>）
  var REGION_NAMES = {
    'pec-upper': '胸大肌（上胸）', 'pec-lower': '胸大肌（中下部）',
    'delt-front': '前三角', 'delt-side': '中三角', 'delt-rear': '後三角',
    'biceps': '肱二頭', 'brachialis': '肱肌', 'triceps': '肱三頭', 'forearm': '前臂',
    'trap-upper': '斜方肌上部', 'trap-mid': '斜方肌中部', 'trap-lower': '斜方肌下部',
    'rhomboid': '菱形肌', 'teres': '大圓肌', 'lats': '背闊肌', 'erector': '豎脊肌',
    'rectus': '腹直肌', 'obliques': '腹斜肌',
    'glute-max': '臀大肌', 'glute-med': '臀中肌、臀小肌',
    'quads': '股四頭', 'adductor': '內收肌', 'hamstrings': '腿後肌群', 'calf': '小腿腓腸肌'
  };

  // 人體左半邊（畫面左側，x ≤ 100），右半邊用鏡像產生。viewBox 0 0 200 440
  var SILHOUETTE =
    'M100,6 C89,6 82,14 82,27 C82,38 85,46 90,51 L90,58 C83,63 72,65 62,68 ' +
    'C48,71 40,80 39,95 C37,110 36,124 37,138 C35,150 33,160 32,170 ' +
    'C29,190 28,208 29,226 C27,236 26,246 27,256 C28,264 34,266 36,260 ' +
    'C37,252 37,244 38,236 C41,222 45,202 48,182 C50,172 52,162 54,152 ' +
    'C56,138 58,124 60,110 C63,126 65,142 66,158 C67,172 67,182 66,192 ' +
    'C63,204 61,214 61,228 C61,258 65,292 71,322 C69,342 68,362 71,384 ' +
    'C73,398 74,410 72,420 C70,428 78,432 90,430 C92,420 91,410 91,398 ' +
    'C92,380 94,360 93,340 C92,332 91,326 92,320 C95,296 98,268 99,250 L100,248';

  var SHARED = {
    'delt-side': 'M62,69 C49,72 41,80 40,95 C39,103 39,110 41,118 C42,113 44,106 47,98 C51,86 57,77 64,71 Z',
    'forearm': 'M46,168 C40,172 35,178 33,186 C30,200 29,212 30,224 L38,228 C40,214 44,198 48,184 C50,178 50,172 46,168 Z'
  };

  var FRONT = {
    'trap-upper': 'M90,59 C84,63 76,65 67,68 C73,70 81,71 88,70 C91,68 93,66 94,64 Z',
    'delt-side': SHARED['delt-side'],
    'delt-front': 'M65,71 C57,77 51,86 47,98 C44,106 42,113 41,118 C46,121 52,120 56,116 C60,104 65,93 70,84 C72,79 74,75 75,72 Z',
    'pec-upper': 'M98,74 L77,72 C73,78 70,84 67,90 C77,90 88,91 98,93 Z',
    'pec-lower': 'M98,95 C88,93 77,92 66,92 C63,100 61,106 58,113 C64,124 76,130 88,130 C93,130 96,129 98,128 Z',
    'biceps': 'M58,120 C51,126 46,138 45,152 C47,162 53,165 56,158 C58,146 59,134 59,121 Z',
    'brachialis': 'M42,123 C38,134 37,148 37,162 L43,165 C42,152 42,140 45,127 C44,124 43,123 42,123 Z',
    'forearm': SHARED['forearm'],
    'rectus': 'M98,133 L86,135 C85,154 85,178 86,200 C89,214 93,226 98,236 Z',
    'obliques': 'M84,135 C78,133 72,131 66,131 C66,147 66,166 67,184 C68,196 74,206 84,214 C83,186 83,160 84,135 Z',
    'quads': 'M63,227 C61,256 65,290 73,316 C77,321 83,321 86,316 C88,296 88,270 86,246 C80,236 72,229 63,227 Z',
    'adductor': 'M89,241 C94,245 97,250 98,256 C97,274 94,292 90,306 C90,284 90,262 89,241 Z',
    'calf': 'M90,337 C93,350 93,364 90,380 C88,368 87,352 88,339 Z'
  };
  var FRONT_DECOR = [
    'M63,115 C68,119 74,124 80,129 L67,129 C66,124 64,119 63,115 Z',  // 前鋸肌
    'M75,334 C73,350 74,370 77,392 L84,392 C85,370 85,350 83,334 Z', // 脛前肌
    'M76,320 C78,326 83,328 86,324 C86,320 82,318 76,320 Z'          // 膝蓋
  ];
  var FRONT_LINES = ['M86,155 L98,154', 'M86,176 L98,175', 'M86,197 L98,197', 'M41,192 C38,204 36,214 34,225', 'M71,246 C74,270 77,295 80,317'];

  var BACK = {
    'triceps': 'M48,119 C43,128 40,142 40,156 C45,164 52,164 55,158 C57,144 58,130 58,117 C55,121 51,121 48,119 Z',
    'trap-upper': 'M100,44 L92,48 C91,57 86,62 76,66 L63,71 C72,74 82,76 92,78 L100,80 Z',
    'trap-mid': 'M100,82 L92,80 C82,78 72,76 64,73 C70,80 78,88 86,94 C90,98 95,102 100,104 Z',
    'trap-lower': 'M100,106 C96,104 92,102 88,100 C86,116 90,140 100,170 Z',
    'delt-side': SHARED['delt-side'],
    'delt-rear': 'M64,72 C57,77 51,86 47,98 C44,106 42,113 41,118 C46,121 52,120 56,116 C60,104 66,94 70,86 C72,81 72,77 70,74 Z',
    'rhomboid': 'M86,101 C84,112 84,122 87,134 C83,131 79,127 77,123 C76,113 77,104 79,96 Z',
    'teres': 'M75,121 C69,121 63,121 59,122 L60,129 C66,129 72,128 77,125 Z',
    'lats': 'M78,127 C73,131 68,132 64,132 C65,149 66,166 69,182 C76,192 85,196 93,196 C92,172 90,152 88,139 C86,134 82,130 78,127 Z',
    'erector': 'M99,172 L95,178 C94,192 94,206 95,220 L99,222 Z',
    'forearm': SHARED['forearm'],
    'glute-med': 'M63,212 C68,203 80,199 97,200 L97,209 C84,209 72,214 65,226 Z',
    'glute-max': 'M98,213 C88,211 75,215 67,228 C63,242 66,256 76,262 C86,266 95,262 98,256 Z',
    'hamstrings': 'M66,267 C64,287 69,306 75,320 L86,320 C90,302 92,285 92,269 C84,273 75,273 66,267 Z',
    'calf': 'M73,332 C68,346 69,364 77,380 C81,382 86,382 89,378 C92,362 92,346 88,332 C84,328 77,328 73,332 Z'
  };
  var BACK_DECOR = [
    'M77,92 C71,94 66,100 64,108 C66,114 70,118 76,118 C76,110 76,100 77,92 Z', // 棘下肌
    'M78,385 C78,396 80,407 82,416 L86,416 C88,406 88,395 88,385 Z'            // 跟腱
  ];
  var BACK_LINES = ['M82,331 L82,378', 'M78,272 L80,318', 'M41,192 C38,204 36,214 34,225'];

  function el(name, attrs) {
    var e = document.createElementNS(NS, name);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  }

  function buildFigure(svg, regions, decor, lines, label) {
    svg.setAttribute('viewBox', '22 2 156 434');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', label + '肌群圖');
    var halves = [el('g', {}), el('g', { transform: 'translate(200,0) scale(-1,1)' })];
    halves.forEach(function (g) {
      g.appendChild(el('path', { d: SILHOUETTE + ' Z', class: 'body-fill' }));
      decor.forEach(function (d) { g.appendChild(el('path', { d: d, class: 'decor' })); });
      Object.keys(regions).forEach(function (id) {
        var p = el('path', { d: regions[id], class: 'muscle', 'data-muscle': id });
        var t = el('title', {}); t.textContent = REGION_NAMES[id];
        p.appendChild(t);
        g.appendChild(p);
      });
      lines.forEach(function (d) { g.appendChild(el('path', { d: d, class: 'line' })); });
      g.appendChild(el('path', { d: SILHOUETTE, class: 'outline' }));
      svg.appendChild(g);
    });
  }

  var state = { day: 0, ex: -1, muscle: null };
  var $ = function (s) { return document.querySelector(s); };

  function levelsFor(exs) {
    var lv = {}; // regionId -> 2 primary / 1 secondary
    exs.forEach(function (ex) {
      ex.primary.forEach(function (m) { (MUSCLES[m] || []).forEach(function (r) { lv[r] = 2; }); });
      ex.secondary.forEach(function (m) { (MUSCLES[m] || []).forEach(function (r) { if (!lv[r]) lv[r] = 1; }); });
    });
    return lv;
  }

  function render() {
    var day = DAYS[state.day];
    document.querySelectorAll('.tab').forEach(function (b, i) {
      b.setAttribute('aria-selected', i === state.day ? 'true' : 'false');
    });
    $('#day-title').textContent = day.title;
    var note = $('#day-note');
    note.hidden = !day.note;
    note.textContent = day.note ? '⚠️ ' + day.note : '';

    var exs = state.ex >= 0 ? [day.exercises[state.ex]] : day.exercises;
    var lv = levelsFor(exs);
    document.querySelectorAll('.muscle').forEach(function (p) {
      var l = lv[p.getAttribute('data-muscle')];
      p.classList.toggle('primary', l === 2);
      p.classList.toggle('secondary', l === 1);
      p.classList.toggle('picked', p.getAttribute('data-muscle') === state.muscle);
    });

    $('#view-mode').textContent = state.ex >= 0 ? '目前只顯示：' + day.exercises[state.ex].name : '目前顯示：' + day.tab + ' 全部動作';
    $('#show-all').hidden = state.ex < 0;

    var list = $('#exercises');
    list.innerHTML = '';
    day.exercises.forEach(function (ex, i) {
      var li = document.createElement('li');
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'ex' + (i === state.ex ? ' selected' : '');
      b.setAttribute('aria-pressed', i === state.ex ? 'true' : 'false');
      b.innerHTML =
        '<span class="ex-head"><span class="ex-name"></span><span class="ex-sets"></span></span>' +
        '<span class="ex-row"><span class="tag p">主要</span><span class="pm"></span></span>' +
        (ex.secondary.length ? '<span class="ex-row"><span class="tag s">次要</span><span class="sm"></span></span>' : '');
      b.querySelector('.ex-name').textContent = ex.name;
      b.querySelector('.ex-sets').textContent = ex.sets;
      b.querySelector('.pm').textContent = ex.primary.join('、');
      if (ex.secondary.length) b.querySelector('.sm').textContent = ex.secondary.join('、');
      b.addEventListener('click', function () {
        state.ex = state.ex === i ? -1 : i;
        state.muscle = null;
        render();
        updateInfo();
      });
      li.appendChild(b);
      list.appendChild(li);
    });
  }

  function updateInfo() {
    var info = $('#muscle-info');
    if (!state.muscle) { info.textContent = '點圖上的肌肉可以看名稱'; info.classList.remove('active'); return; }
    var day = DAYS[state.day];
    var p = [], s = [];
    day.exercises.forEach(function (ex) {
      var hit = function (arr) { return arr.some(function (m) { return (MUSCLES[m] || []).indexOf(state.muscle) >= 0; }); };
      if (hit(ex.primary)) p.push(ex.name); else if (hit(ex.secondary)) s.push(ex.name);
    });
    var txt = REGION_NAMES[state.muscle] + '：';
    if (!p.length && !s.length) txt += day.tab + ' 沒有練到';
    else txt += [p.length ? '主要 ' + p.join('、') : '', s.length ? '次要 ' + s.join('、') : ''].filter(Boolean).join('；');
    info.textContent = txt;
    info.classList.add('active');
  }

  function init() {
    buildFigure($('#fig-front'), FRONT, FRONT_DECOR, FRONT_LINES, '正面');
    buildFigure($('#fig-back'), BACK, BACK_DECOR, BACK_LINES, '背面');

    var dow = new Date().getDay(); // 1 一, 2 二, 4 四
    state.day = dow === 2 ? 1 : dow === 4 ? 2 : 0;

    var tabs = $('#tabs');
    DAYS.forEach(function (d, i) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'tab'; b.setAttribute('role', 'tab');
      b.innerHTML = '<strong></strong><small></small>';
      b.querySelector('strong').textContent = d.tab;
      b.querySelector('small').textContent = d.title.split(' · ')[0];
      b.addEventListener('click', function () { state.day = i; state.ex = -1; state.muscle = null; render(); updateInfo(); });
      tabs.appendChild(b);
    });

    document.querySelectorAll('.muscle').forEach(function (p) {
      p.addEventListener('click', function () {
        var id = p.getAttribute('data-muscle');
        state.muscle = state.muscle === id ? null : id;
        render(); updateInfo();
      });
    });
    $('#show-all').addEventListener('click', function () { state.ex = -1; render(); updateInfo(); });

    render(); updateInfo();
  }

  // 供檢查用
  window.__REGION_NAMES = REGION_NAMES;
  document.addEventListener('DOMContentLoaded', init);
})();
