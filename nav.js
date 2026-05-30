/* ============================================================
   统一导航 + 索引导航面板
   ============================================================ */
(function () {
  var version = localStorage.getItem('xhs-version') || '1';
  var pages = { '1':'xhs1.html', 'pl':'xhspl.html', '2':'xhs2.html', '3':'xhs3.html' };
  var home = pages[version] || 'xhs1.html';

  var logos = document.querySelectorAll('.site-logo');
  for (var i = 0; i < logos.length; i++) { logos[i].href = home; }

  var backs = document.querySelectorAll('.back-link');
  for (var i = 0; i < backs.length; i++) {
    var href = backs[i].getAttribute('href');
    if (href === 'xhs1.html' || href === 'xhspl.html' || href === 'xhs2.html' || href === 'xhs3.html') {
      backs[i].href = home;
    }
  }

  // ── 页面访问追踪 ──
  var pageName = window.location.pathname.split('/').pop().replace('.html','');
  if (pageName) {
    try {
      var visited = JSON.parse(localStorage.getItem('xhs-pages-visited') || '[]');
      if (visited.indexOf(pageName) === -1) {
        visited.push(pageName);
        localStorage.setItem('xhs-pages-visited', JSON.stringify(visited));
      }
    } catch(e) {}
  }

  // ═══════════════════════════════════════════
  // 索引导航面板 (跳过 puzzle / mxhuitu / wanzuoyou)
  // ═══════════════════════════════════════════
  var skip = /^(puzzle_|mxhuitu|wanzuoyou)/;
  if (skip.test(pageName)) return;

  // ── 数据定义 ──
  var CATEGORIES = {
    '西红柿': [
      { id:'xhsyingwu',    label:'金刚鹦鹉' },
      { id:'xhstroisbody', label:'仨体' },
      { id:'xhsjiankang',  label:'健康生活' },
      { id:'xhsyiqing',    label:'疫情' },
      { id:'xhshuajia',    label:'语文书' },
      { id:'xhsfumao',     label:'孵猫' },
      { id:'xhschongyan',  label:'彩南虫宴' },
      { id:'xhsxunyu',     label:'熏鱼' },
      { id:'xhsshangzhua', label:'上爪' },
      { id:'xhsyingwupl',  label:'金刚鹦鹉(评)' },
      { id:'xhstroisbodypl',label:'仨体(评)' },
      { id:'xhsjiankangpl',label:'健康(评)' },
      { id:'xhsyiqingpl',  label:'y疫情(评)' },
      { id:'xhsbwbj',      label:'霸王别姬' },
      { id:'xhsmbc',       label:'鹦鹉套餐' },
      { id:'xhswangle',    label:'首页推荐' },
      { id:'xhscasetubu',  label:'徒步发现的脚印' },
      { id:'xhscasexiaban',label:'下班发现裸猿' },
      { id:'xhscaseyouyong',label:'水猴子' },
      { id:'xhscasexiangxia',label:'无意拍摄' },
      { id:'xhshuajiabucuo',label:'雪地里的小画家' },
      { id:'xhsweys',      label:'威尔已死' },
      { id:'xhsxiaolantx', label:'小蓝的头像' },
      { id:'xhsyuangong',  label:'员工后台' },
      { id:'jisuanji2',    label:'计算机' },

    ],
    '矢呼': [
      { id:'shssnn',          label:'穗穗黏黏' },
      { id:'shheianmaitian',  label:'黑暗麦田' },
      { id:'shfg',            label:'文麦特主页' },
      { id:'shdx',            label:'大学' },
      { id:'shhpy',           label:'好朋友' },
      { id:'shwosihu',        label:'沃斯湖' },
      { id:'shxueshan',       label:'雪山' },
      { id:'shjm',            label:'穗子主页' },
      { id:'shsjz',           label:'十进制' },
    ],
    '千百度': [
      { id:'qbdxdldxhj',  label:'雪地里的小画家' },
      { id:'shiershengxiao',  label:'十二生肖' },
      { id:'qbdxcy',       label:'旧城疫' },
      { id:'qbdmaoxing',   label:'昴星' },
      { id:'qbdrenlei',    label:'人类' },
      { id:'qbdweys',      label:'威尔已死' },
      { id:'qbdgqcm',      label:'过目不忘' },
      { id:'qbdyq',        label:'月球' },
      { id:'qbdcainan',    label:'彩南' },
      { id:'qbdshangzhua', label:'上爪' },
    ]
  };

  var ACHIEVEMENTS = [
    { key:'xhs-allposts-ach-shown', name:'西红柿重度依赖' },
    { key:'xhs-cases-ach-shown',    name:'工作狂' },
    { key:'ji-modal-shown',         name:'计算机0.5级' },
    { key:'ach-console',            name:'有些事情没那么难' },
    { key:'ach-goldfish',           name:'Tell me tell me' },
    { key:'ach-chirp',              name:'布谷布谷' },
    { key:'ach-leave',              name:'还得谢谢咱' },
    { key:'ach-youxiandaan',        name:'有限大暗' },
    { key:'ach-searchmaster',       name:'搜索大师' },
  ];

  // ── 辅助函数 ──
  function getVisited() {
    try { return JSON.parse(localStorage.getItem('xhs-pages-visited') || '[]'); }
    catch(e) { return []; }
  }

  function hasAchievement(key) {
    return localStorage.getItem(key) === '1';
  }

  // ── 注入 CSS ──
  var style = document.createElement('style');
  style.textContent = ''
    + '.idx-btn{position:fixed;top:16px;right:16px;z-index:9998;'
    + 'width:36px;height:36px;border-radius:50%;border:1px solid #ccc;'
    + 'background:#fff;cursor:pointer;font-size:18px;line-height:1;'
    + 'display:grid;place-items:center;box-shadow:0 2px 8px rgba(0,0,0,.12);'
    + 'transition:transform .2s,box-shadow .2s;}'
    + '.idx-btn:hover{transform:scale(1.1);box-shadow:0 4px 16px rgba(0,0,0,.18);}'
    + '.idx-panel{position:fixed;top:0;right:-380px;width:360px;height:100vh;'
    + 'z-index:9999;background:#fff;box-shadow:-4px 0 24px rgba(0,0,0,.15);'
    + 'transition:right .35s cubic-bezier(.4,0,.2,1);'
    + 'display:flex;flex-direction:column;overflow:hidden;}'
    + '.idx-panel.open{right:0;}'
    + '.idx-head{display:flex;justify-content:space-between;align-items:center;'
    + 'padding:16px 20px;border-bottom:1px solid #eee;flex-shrink:0;}'
    + '.idx-head h3{font-size:16px;font-weight:700;margin:0;}'
    + '.idx-close{width:30px;height:30px;border:none;background:none;cursor:pointer;font-size:20px;color:#999;}'
    + '.idx-body{flex:1;overflow-y:auto;padding:12px 20px 24px;}'
    + '.idx-cat{margin-bottom:18px;}'
    + '.idx-cat-title{font-size:13px;font-weight:700;color:#e33932;margin-bottom:8px;'
    + 'padding-bottom:6px;border-bottom:1px solid #f0f0f0;}'
    + '.idx-cat:nth-child(2) .idx-cat-title{color:#2563eb;}'
    + '.idx-cat:nth-child(3) .idx-cat-title{color:#059669;}'
    + '.idx-link{display:block;padding:5px 0;font-size:13px;color:#666;text-decoration:none;'
    + 'border-bottom:1px dotted #f5f5f5;transition:color .15s;}'
    + '.idx-link:hover{color:#e33932;}'
    + '.idx-link .dot{display:inline-block;width:6px;height:6px;border-radius:50%;'
    + 'margin-right:6px;vertical-align:2px;}'
    + '.idx-link.seen .dot{background:#22c55e;}'
    + '.idx-link:not(.seen) .dot{background:#ddd;}'
    + '.idx-unknown{color:#ccc!important;cursor:default;pointer-events:none;}'
    + '.idx-ach{margin-top:4px;}'
    + '.idx-ach-title{font-size:13px;font-weight:700;color:#d4a226;margin-bottom:8px;'
    + 'padding-bottom:6px;border-bottom:1px solid #f0f0f0;}'
    + '.idx-ach-item{font-size:12.5px;padding:4px 0;color:#666;}'
    + '.idx-ach-item.got{color:#22c55e;}'
    + '.idx-ach-item.got::before{content:"✓ ";font-weight:700;}'
    + '.idx-ach-item.miss{color:#ccc;}'
    + '.idx-ach-item.miss::before{content:"— ";}'
    + '.idx-mask{position:fixed;inset:0;z-index:9997;background:rgba(0,0,0,.25);'
    + 'display:none;}.idx-mask.show{display:block;}';
  document.head.appendChild(style);

  // ── 注入 HTML ──
  var mask = document.createElement('div');
  mask.className = 'idx-mask';
  mask.id = 'idxMask';
  document.body.appendChild(mask);

  var btn = document.createElement('button');
  btn.className = 'idx-btn';
  btn.id = 'idxBtn';
  btn.title = '索引';
  btn.textContent = '☰';
  document.body.appendChild(btn);

  var panel = document.createElement('div');
  panel.className = 'idx-panel';
  panel.id = 'idxPanel';

  var visitedSet = getVisited();

  var bodyHTML = '';
  for (var cat in CATEGORIES) {
    var items = CATEGORIES[cat];
    // 该组是否有至少一个页面已访问
    var anySeen = items.some(function(it) { return visitedSet.indexOf(it.id) !== -1; });
    var catTitle = anySeen ? cat : '???';
    bodyHTML += '<div class="idx-cat"><div class="idx-cat-title">' + catTitle + '</div>';
    for (var j = 0; j < items.length; j++) {
      var it = items[j];
      var seen = visitedSet.indexOf(it.id) !== -1;
      if (seen) {
        bodyHTML += '<a class="idx-link seen" href="' + it.id + '.html">'
          + '<span class="dot"></span>' + it.label + '</a>';
      } else {
        bodyHTML += '<span class="idx-link idx-unknown">'
          + '<span class="dot"></span>???</span>';
      }
    }
    bodyHTML += '</div>';
  }

  // 成就
  bodyHTML += '<div class="idx-ach"><div class="idx-ach-title">成就</div>';
  for (var a = 0; a < ACHIEVEMENTS.length; a++) {
    var ach = ACHIEVEMENTS[a];
    var got = hasAchievement(ach.key);
    bodyHTML += '<div class="idx-ach-item ' + (got ? 'got' : 'miss') + '">'
      + (got ? ach.name : '???') + '</div>';
  }
  if (ACHIEVEMENTS.length === 0) {
    bodyHTML += '<div class="idx-ach-item miss">暂无成就</div>';
  }
  bodyHTML += '</div>';

  panel.innerHTML = ''
    + '<div class="idx-head">'
    + '<h3>索引导航</h3>'
    + '<button class="idx-close" id="idxClose">✕</button>'
    + '</div>'
    + '<div class="idx-body">' + bodyHTML + '</div>';
  document.body.appendChild(panel);

  // ── 交互 ──
  function openPanel()  { panel.classList.add('open'); mask.classList.add('show'); }
  function closePanel() { panel.classList.remove('open'); mask.classList.remove('show'); }
  btn.addEventListener('click', openPanel);
  document.getElementById('idxClose').addEventListener('click', closePanel);
  mask.addEventListener('click', closePanel);
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && panel.classList.contains('open')) closePanel();
  });
})();
