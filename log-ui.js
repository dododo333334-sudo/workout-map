// 訓練紀錄畫面。資料在 log.js，肌群圖的程式在 app.js，兩邊互不影響。
(function () {
  'use strict';

  var WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];
  var nav = { scrollTo: null, forceTop: false };

  function $(id) { return document.getElementById(id); }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function clear(node) {
    while (node.firstChild) node.removeChild(node.firstChild);
  }

  function arr(value) {
    return Array.isArray(value) ? value : [];
  }

  function text(value) {
    return value == null ? '' : String(value);
  }

  function asNumber(value) {
    if (typeof value === 'number') return value;
    if (typeof value === 'string' && value.trim() !== '') return Number(value);
    return NaN;
  }

  function formatNum(value) {
    if (typeof value !== 'number' || !isFinite(value)) return '';
    var rounded = Math.round(value * 1000) / 1000;
    return rounded.toFixed(3).replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '');
  }

  function weekdayChar(iso) {
    var parts = iso.split('-');
    var date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    if (isNaN(date.getTime())) return '';
    return WEEKDAYS[date.getDay()];
  }

  function validDate(iso) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(iso || '')) return false;
    var parts = iso.split('-');
    var year = Number(parts[0]);
    var month = Number(parts[1]);
    var day = Number(parts[2]);
    var date = new Date(year, month - 1, day);
    return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
  }

  function formatDate(iso, withYear) {
    var parts = iso.split('-');
    var body = (withYear ? parts[0] + '/' : '') + parts[1] + '/' + parts[2];
    var weekday = weekdayChar(iso);
    return weekday ? body + '（' + weekday + '）' : body;
  }

  function slashDate(iso) {
    return iso.replace(/-/g, '/');
  }

  function spansYears(sessions) {
    var seen = {};
    var count = 0;
    sessions.forEach(function (session) {
      var year = session.date.slice(0, 4);
      if (!seen[year]) {
        seen[year] = true;
        count += 1;
      }
    });
    return count > 1;
  }

  function dayCode(entry) {
    var code = text(entry.day).trim().toUpperCase();
    if (code === 'A' || code === 'B' || code === 'C') return code;
    return 'other';
  }

  function dayClass(entry) {
    var code = dayCode(entry);
    if (code === 'A') return 'is-a';
    if (code === 'B') return 'is-b';
    if (code === 'C') return 'is-c';
    return 'is-other';
  }

  function badgeText(entry) {
    if (entry.label && text(entry.label).trim()) return text(entry.label).trim();
    var code = dayCode(entry);
    return code === 'other' ? '其他' : 'Day ' + code;
  }

  function isLive(entry) {
    return entry.status === 'in-progress';
  }

  function liftName(exercise) {
    return (exercise.machine && text(exercise.machine).trim()) || '（未填機器）';
  }

  function runName(run) {
    return (run.machine && text(run.machine).trim()) || '跑步';
  }

  function parseClock(value) {
    if (typeof value !== 'string' || !value.trim()) return NaN;
    var parts = value.trim().split(':');
    if (parts.length < 2 || parts.length > 3) return NaN;
    var numbers = parts.map(function (part) { return Number(part); });
    if (numbers.some(function (n) { return !isFinite(n) || n < 0; })) return NaN;
    if (numbers.length === 2) return numbers[0] * 60 + numbers[1];
    return numbers[0] * 3600 + numbers[1] * 60 + numbers[2];
  }

  function computePace(km, time) {
    var distance = asNumber(km);
    var seconds = parseClock(time);
    if (!isFinite(seconds) || !isFinite(distance) || distance <= 0) return '';
    var perKm = seconds / distance;
    var minutes = Math.floor(perKm / 60);
    var remain = Math.round(perKm - minutes * 60);
    if (remain === 60) {
      minutes += 1;
      remain = 0;
    }
    return minutes + ':' + (remain < 10 ? '0' : '') + remain;
  }

  function formatPace(run) {
    if (run.pace != null && text(run.pace).trim() !== '') {
      var pace = text(run.pace).trim().replace(/\s+/g, '').replace(/\/(km|公里)$/i, '');
      return (run.paceApprox ? '約 ' : '') + pace + '/公里';
    }
    var computed = computePace(run.distanceKm, run.time);
    return computed ? computed + '/公里' : '';
  }

  function formatKm(value) {
    var distance = asNumber(value);
    if (!isFinite(distance)) return '';
    return formatNum(distance) + ' 公里';
  }

  function formatLoad(set) {
    if (set.emptyBar) return '空槓';
    var weight = asNumber(set.weight);
    if (!isFinite(weight)) return '未填重量';
    var unit = set.unit === 'lb' ? '磅' : set.unit === 'kg' ? '公斤' : (set.unit ? text(set.unit) : '');
    var label = formatNum(weight) + (unit ? ' ' + unit : '');
    if (set.perSide) label += ' × 單邊';
    return label;
  }

  function formatReps(reps) {
    var source = Array.isArray(reps) ? reps : (reps == null || reps === '' ? [] : [reps]);
    var list = [];
    source.forEach(function (rep) {
      var value = asNumber(rep);
      if (isFinite(value)) list.push(formatNum(value));
    });
    return list.length ? list.join('、') + ' 下' : '沒有次數';
  }

  function describeSets(sets) {
    var parts = [];
    arr(sets).forEach(function (set) {
      if (!set || typeof set !== 'object') return;
      var line = formatLoad(set) + ' · ' + formatReps(set.reps);
      if (set.warmup) line += '（熱身）';
      parts.push(line);
    });
    return parts.length ? parts.join('；') : '沒有組數';
  }

  function describeRun(run) {
    var bits = [];
    var distance = formatKm(run.distanceKm);
    if (distance) bits.push(distance);
    if (run.time) bits.push(text(run.time));
    var pace = formatPace(run);
    if (pace) bits.push(pace);
    if (run.avgHr != null && run.avgHr !== '') bits.push('心率 ' + text(run.avgHr));
    if (run.zone) bits.push(text(run.zone));
    return bits.join(' · ') || '沒有距離或時間';
  }

  function parseLog() {
    var raw = Array.isArray(window.TRAINING_LOG) ? window.TRAINING_LOG : [];
    var items = [];
    var problems = [];
    raw.forEach(function (entry, index) {
      var place = '第 ' + (index + 1) + ' 筆';
      if (!entry || typeof entry !== 'object') {
        problems.push(place + '不是物件');
        return;
      }
      if (!validDate(entry.date)) {
        problems.push(place + '的日期要寫成 YYYY-MM-DD');
        return;
      }
      items.push({ entry: entry, index: index });
    });
    items.sort(function (a, b) {
      if (a.entry.date !== b.entry.date) return a.entry.date < b.entry.date ? 1 : -1;
      return b.index - a.index;
    });
    return {
      sessions: items.map(function (item) { return item.entry; }),
      problems: problems
    };
  }

  function buildGroups(sessions) {
    var groups = [];
    var index = {};
    function groupFor(kind, name) {
      var key = kind + '\n' + name;
      if (!Object.prototype.hasOwnProperty.call(index, key)) {
        index[key] = groups.length;
        groups.push({ kind: kind, machine: name, entries: [] });
      }
      return groups[index[key]];
    }
    sessions.forEach(function (session) {
      arr(session.exercises).forEach(function (exercise) {
        if (!exercise || typeof exercise !== 'object') return;
        groupFor('lift', liftName(exercise)).entries.push({ session: session, exercise: exercise });
      });
      arr(session.runs).forEach(function (run) {
        if (!run || typeof run !== 'object') return;
        groupFor('run', runName(run)).entries.push({ session: session, run: run });
      });
    });
    groups.sort(function (a, b) {
      var left = a.entries[0].session.date;
      var right = b.entries[0].session.date;
      if (left === right) return 0;
      return left < right ? 1 : -1;
    });
    return groups;
  }

  function dateNode(iso, withYear) {
    var node = document.createElement('time');
    node.className = 'log-date';
    node.dateTime = iso;
    node.textContent = formatDate(iso, withYear);
    return node;
  }

  function historyButton(machine, kind) {
    var button = el('button', 'history-btn', '看進度');
    button.type = 'button';
    button.setAttribute('aria-label', '看「' + machine + '」的進度');
    button.addEventListener('click', function () {
      navigate('progress', { kind: kind, machine: machine });
    });
    return button;
  }

  function appendSets(parent, sets) {
    var any = false;
    arr(sets).forEach(function (set) {
      if (!set || typeof set !== 'object') return;
      any = true;
      var line = el('div', 'set-line');
      var load = el('span', 'set-load');
      load.appendChild(document.createTextNode(formatLoad(set)));
      if (set.warmup) load.appendChild(el('span', 'log-tag', '熱身'));
      line.appendChild(load);
      line.appendChild(el('span', 'set-reps', formatReps(set.reps)));
      parent.appendChild(line);
      if (set.note) parent.appendChild(el('p', 'set-note', text(set.note)));
    });
    if (!any) parent.appendChild(el('p', 'set-note', '沒有組數'));
  }

  function appendRunStats(parent, run) {
    var rows = [];
    var distance = formatKm(run.distanceKm);
    if (distance) rows.push(['距離', distance]);
    if (run.time) rows.push(['時間', text(run.time)]);
    var pace = formatPace(run);
    if (pace) rows.push(['配速', pace]);
    if (run.avgHr != null && run.avgHr !== '') rows.push(['平均心率', text(run.avgHr)]);
    if (!rows.length) {
      parent.appendChild(el('p', 'set-note', '沒有距離或時間'));
      return;
    }
    var list = el('dl', 'run-stats');
    rows.forEach(function (row) {
      var cell = el('div');
      cell.appendChild(el('dt', '', row[0]));
      cell.appendChild(el('dd', '', row[1]));
      list.appendChild(cell);
    });
    parent.appendChild(list);
    if (run.note) parent.appendChild(el('p', 'set-note', text(run.note)));
  }

  function liftBlock(exercise) {
    var block = el('div', 'log-ex');
    var head = el('div', 'log-ex-head');
    var name = liftName(exercise);
    head.appendChild(el('p', 'log-ex-name', name));
    var side = el('div', 'log-ex-side');
    side.appendChild(historyButton(name, 'lift'));
    head.appendChild(side);
    block.appendChild(head);
    if (exercise.note) block.appendChild(el('p', 'set-note', text(exercise.note)));
    appendSets(block, exercise.sets);
    return block;
  }

  function runBlock(run) {
    var block = el('div', 'log-ex');
    var head = el('div', 'log-ex-head');
    var name = runName(run);
    head.appendChild(el('p', 'log-ex-name', name));
    var side = el('div', 'log-ex-side');
    if (run.zone) side.appendChild(el('span', 'log-pill is-c', text(run.zone)));
    side.appendChild(historyButton(name, 'run'));
    head.appendChild(side);
    block.appendChild(head);
    appendRunStats(block, run);
    return block;
  }

  function historyHead(parent, session, withYear, extra) {
    var head = el('div', 'hist-head');
    head.appendChild(dateNode(session.date, withYear));
    head.appendChild(el('span', 'log-pill ' + dayClass(session), badgeText(session)));
    if (isLive(session)) head.appendChild(el('span', 'log-pill is-live', '進行中'));
    if (extra) head.appendChild(extra);
    parent.appendChild(head);
  }

  function renderByDate(list, sessions, withYear) {
    sessions.forEach(function (session) {
      var card = el('li', 'log-card' + (isLive(session) ? ' is-live' : ''));
      var head = el('div', 'log-card-head');
      head.appendChild(dateNode(session.date, withYear));
      var pills = el('div', 'log-pills');
      pills.appendChild(el('span', 'log-pill ' + dayClass(session), badgeText(session)));
      if (isLive(session)) pills.appendChild(el('span', 'log-pill is-live', '進行中'));
      head.appendChild(pills);
      card.appendChild(head);
      if (session.note) card.appendChild(el('p', 'log-note', text(session.note)));
      arr(session.exercises).forEach(function (exercise) {
        if (exercise && typeof exercise === 'object') card.appendChild(liftBlock(exercise));
      });
      arr(session.runs).forEach(function (run) {
        if (run && typeof run === 'object') card.appendChild(runBlock(run));
      });
      list.appendChild(card);
    });
  }

  // 解剖順序。資料裡沒有的區不會畫出來。腿含股四頭、臀、腿後肌群。
  var CATEGORY_ORDER = ['胸', '背', '肩', '二頭', '三頭', '腿', '小腿', '核心', '有氧'];

  // 課表 primary 是最高強調（圖上深色），secondary 次之。同一級取陣列裡的第一個。
  var MUSCLE_CATEGORY = {
    '胸大肌': '胸',
    '上胸': '胸',
    '前三角': '肩',
    '中三角': '肩',
    '後三角': '肩',
    '肱二頭': '二頭',
    '肱肌': '二頭',
    '肱三頭': '三頭',
    '前臂': '二頭',
    '斜方肌上部': '背',
    '斜方肌中部': '背',
    '斜方肌下部': '背',
    '斜方肌中下部': '背',
    '菱形肌': '背',
    '大圓肌': '背',
    '背闊肌': '背',
    '腹直肌': '核心',
    '腹斜肌': '核心',
    '豎脊肌': '核心',
    '核心（腹直肌、腹斜肌、豎脊肌）': '核心',
    '臀大肌': '腿',
    '臀中肌、臀小肌': '腿',
    '股四頭': '腿',
    '內收肌': '腿',
    '腿後肌群': '腿',
    '小腿腓腸肌': '小腿'
  };

  function normName(value) {
    return text(value).toLowerCase().replace(/\s+/g, '');
  }

  function programExercises() {
    var list = [];
    arr(window.DAYS).forEach(function (day) {
      arr(day && day.exercises).forEach(function (exercise) {
        if (exercise && exercise.name) list.push(exercise);
      });
    });
    return list;
  }

  function leadMuscle(exercise) {
    var primary = arr(exercise.primary).filter(function (muscle) { return text(muscle).trim(); });
    if (primary.length) return text(primary[0]).trim();
    var secondary = arr(exercise.secondary).filter(function (muscle) { return text(muscle).trim(); });
    return secondary.length ? text(secondary[0]).trim() : '';
  }

  function categoryOfMuscle(muscle) {
    return MUSCLE_CATEGORY[muscle] || '';
  }

  function containedProgram(machine) {
    var name = normName(machine);
    var best = null;
    var bestLen = 0;
    programExercises().forEach(function (exercise) {
      var program = normName(exercise.name);
      if (program.length < 2) return;
      if (name.indexOf(program) >= 0 || program.indexOf(name) >= 0) {
        if (program.length > bestLen) {
          best = exercise;
          bestLen = program.length;
        }
      }
    });
    return best;
  }

  function longestShared(machine) {
    var name = normName(machine);
    var best = null;
    var bestLen = 0;
    programExercises().forEach(function (exercise) {
      var program = normName(exercise.name);
      var limit = Math.min(name.length, program.length);
      for (var len = limit; len >= 4; len--) {
        if (len <= bestLen) break;
        for (var i = 0; i + len <= program.length; i++) {
          if (name.indexOf(program.slice(i, i + len)) >= 0) {
            best = exercise;
            bestLen = len;
            return;
          }
        }
      }
    });
    return best;
  }

  function muscleNamedIn(machine) {
    var name = text(machine);
    var best = '';
    Object.keys(MUSCLE_CATEGORY).forEach(function (muscle) {
      if (name.indexOf(muscle) >= 0 && muscle.length > best.length) best = muscle;
    });
    return best;
  }

  // 紀錄裡沒有 primary。對不上課表動作時，用名稱對到強調最高的那條肌群。
  function inferredMuscle(machine) {
    var name = text(machine);
    if (name.indexOf('三頭') >= 0) return '肱三頭';
    if (name.indexOf('二頭') >= 0) return '肱二頭';
    if (name.indexOf('下拉') >= 0 || name.indexOf('划船') >= 0 || /row/i.test(name)) return '背闊肌';
    if (name.indexOf('肩') >= 0) return '前三角';
    if (name.indexOf('上胸') >= 0 || name.indexOf('胸') >= 0) return '上胸';
    if (name.indexOf('小腿') >= 0) return '小腿腓腸肌';
    if (name.indexOf('臀') >= 0 || name.indexOf('髖') >= 0) return '臀中肌、臀小肌';
    if (name.indexOf('腿後') >= 0 || name.indexOf('腿彎') >= 0) return '腿後肌群';
    if (name.indexOf('腿') >= 0) return '股四頭';
    if (name.indexOf('腹') >= 0 || name.indexOf('核心') >= 0) return '腹直肌';
    return '';
  }

  function categoryFor(group) {
    if (group.kind === 'run') return '有氧';
    var program = containedProgram(group.machine) || longestShared(group.machine);
    var muscle = program ? leadMuscle(program) : '';
    if (!muscle) muscle = muscleNamedIn(group.machine);
    if (!muscle) muscle = inferredMuscle(group.machine);
    return categoryOfMuscle(muscle) || '其他';
  }

  function bucketByMuscle(groups) {
    var buckets = {};
    groups.forEach(function (group) {
      var label = categoryFor(group);
      if (!buckets[label]) buckets[label] = [];
      buckets[label].push(group);
    });
    var order = CATEGORY_ORDER.slice();
    Object.keys(buckets).forEach(function (label) {
      if (order.indexOf(label) < 0) order.push(label);
    });
    var sections = [];
    order.forEach(function (label) {
      if (buckets[label]) sections.push({ label: label, groups: buckets[label] });
    });
    return sections;
  }

  function exerciseCard(group, withYear) {
    var card = el('li', 'log-card');
    card.setAttribute('data-kind', group.kind);
    card.setAttribute('data-machine', group.machine);
    var head = el('div', 'log-card-head');
    head.appendChild(el('h3', 'log-machine', group.machine));
    head.appendChild(el('span', 'log-count', group.entries.length + ' 次'));
    card.appendChild(head);
    if (group.entries.length > 1) {
      var newest = group.entries[0];
      var latest = '最近 ' + formatDate(newest.session.date, withYear) + ' · ';
      latest += group.kind === 'lift' ? describeSets(newest.exercise.sets) : describeRun(newest.run);
      if (isLive(newest.session)) latest += ' · 進行中';
      card.appendChild(el('p', 'log-latest', latest));
    }
    group.entries.forEach(function (entry) {
      var row = el('div', 'hist');
      if (group.kind === 'lift') {
        historyHead(row, entry.session, withYear, null);
        if (entry.exercise.note) row.appendChild(el('p', 'set-note', text(entry.exercise.note)));
        appendSets(row, entry.exercise.sets);
      } else {
        var zone = entry.run.zone ? el('span', 'log-pill is-c', text(entry.run.zone)) : null;
        historyHead(row, entry.session, withYear, zone);
        appendRunStats(row, entry.run);
      }
      card.appendChild(row);
    });
    return card;
  }

  function renderByExercise(list, sessions, withYear) {
    bucketByMuscle(buildGroups(sessions)).forEach(function (section) {
      var item = el('li', 'log-section');
      item.appendChild(el('h3', 'log-section-title', section.label));
      var inner = el('ul', 'log-list');
      section.groups.forEach(function (group) {
        inner.appendChild(exerciseCard(group, withYear));
      });
      item.appendChild(inner);
      list.appendChild(item);
    });
  }

  function fillIntro(sessions, route) {
    var summary = $('log-summary');
    var hint = $('log-hint');
    if (!sessions.length) {
      summary.textContent = '';
      hint.textContent = '';
    } else if (route.mode === 'exercise') {
      summary.textContent = '共 ' + buildGroups(sessions).length + ' 項 · 依主要肌群 · 同一台機器的最新一次在最上面';
      hint.textContent = '依主要肌群排列。一台機器一條，名稱要完全一樣才會排在一起。';
    } else {
      var newest = sessions[0].date;
      var oldest = sessions[sessions.length - 1].date;
      summary.textContent = '共 ' + sessions.length + ' 次 · ' + slashDate(oldest) + ' 到 ' + slashDate(newest) + ' · 最新在前';
      hint.textContent = '點「看進度」看同一台機器以前的重量和次數。';
    }
    summary.hidden = !summary.textContent;
    hint.hidden = !hint.textContent;
  }

  function renderLog(route) {
    var parsed = parseLog();
    fillIntro(parsed.sessions, route);
    var root = $('log-root');
    clear(root);
    if (parsed.problems.length) {
      root.appendChild(el('p', 'log-problem', '有 ' + parsed.problems.length + ' 筆沒顯示：' + parsed.problems.join('；') + '。'));
    }
    if (!parsed.sessions.length) {
      root.appendChild(el('p', 'log-empty', '還沒有訓練紀錄。打開 log.js，照檔案最上面的格式加進 TRAINING_LOG。'));
      return;
    }
    var list = el('ul', 'log-list');
    var withYear = spansYears(parsed.sessions);
    if (route.mode === 'exercise') renderByExercise(list, parsed.sessions, withYear);
    else renderByDate(list, parsed.sessions, withYear);
    root.appendChild(list);
  }

  function route() {
    if (location.hash === '#log') return { view: 'log', mode: 'date' };
    if (location.hash === '#progress') return { view: 'log', mode: 'exercise' };
    return { view: 'map', mode: 'date' };
  }

  function scrollToMachine(target) {
    var cards = document.querySelectorAll('#log-root .log-card');
    var found = null;
    for (var i = 0; i < cards.length; i++) {
      if (cards[i].getAttribute('data-kind') === target.kind && cards[i].getAttribute('data-machine') === target.machine) {
        found = cards[i];
        break;
      }
    }
    if (!found) return;
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    found.scrollIntoView({ block: 'start', behavior: reduce ? 'auto' : 'smooth' });
    found.classList.add('flash');
    window.setTimeout(function () { found.classList.remove('flash'); }, 1800);
  }

  function scrollPageTop() {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }

  // hashchange 在部分瀏覽器不會同步發生。自己切頁時先畫一次，並略過緊接著的 hashchange，避免畫兩次把捲動衝掉。
  var ignoreHashPaint = false;

  function paint() {
    var where = route();
    var showLog = where.view === 'log';
    $('panel-map').hidden = showLog;
    $('panel-log').hidden = !showLog;
    $('log-modes').hidden = !showLog;
    $('view-map').setAttribute('aria-selected', showLog ? 'false' : 'true');
    $('view-log').setAttribute('aria-selected', showLog ? 'true' : 'false');
    $('mode-date').setAttribute('aria-selected', where.mode === 'date' ? 'true' : 'false');
    $('mode-exercise').setAttribute('aria-selected', where.mode === 'exercise' ? 'true' : 'false');
    document.title = showLog ? '訓練紀錄 · 每週訓練肌群圖' : '每週訓練肌群圖';
    if (showLog) {
      try {
        renderLog(where);
      } catch (err) {
        var root = $('log-root');
        clear(root);
        root.appendChild(el('p', 'log-problem', '訓練紀錄畫面畫不出來。請檢查 log.js 的格式。'));
        if (window.console && console.error) console.error(err);
      }
    }
    if (nav.scrollTo) {
      var target = nav.scrollTo;
      window.requestAnimationFrame(function () {
        window.requestAnimationFrame(function () {
          if (nav.scrollTo !== target) return;
          nav.scrollTo = null;
          nav.forceTop = false;
          scrollToMachine(target);
        });
      });
      return;
    }
    if (nav.forceTop) {
      nav.forceTop = false;
      window.requestAnimationFrame(function () { scrollPageTop(); });
    }
  }

  function navigate(hash, scrollTo) {
    nav.scrollTo = scrollTo || null;
    nav.forceTop = !scrollTo;
    var next = '#' + hash;
    if (location.hash !== next) {
      ignoreHashPaint = true;
      location.hash = hash;
      window.setTimeout(function () { ignoreHashPaint = false; }, 50);
    }
    paint();
  }

  function init() {
    if (!$('panel-map') || !$('panel-log') || !$('view-map') || !$('view-log')) return;
    $('view-map').addEventListener('click', function () { navigate('map', null); });
    $('view-log').addEventListener('click', function () { navigate('log', null); });
    $('mode-date').addEventListener('click', function () { navigate('log', null); });
    $('mode-exercise').addEventListener('click', function () { navigate('progress', null); });
    window.addEventListener('hashchange', function () {
      if (ignoreHashPaint) return;
      paint();
    });
    paint();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
