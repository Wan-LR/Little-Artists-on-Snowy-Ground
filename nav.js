/* ============================================================
   统一导航 + 索引导航面板
   ============================================================ */
(function () {
  var version = localStorage.getItem('xhs-version') || '1';
  var pages = { '1':'xhs1.html', 'pl':'xhspl.html', '2':'xhs2.html', '3':'xhs3.html' };
  var home = pages[version] || 'xhs1.html';

  // 更新所有指向 xhs 版本页的链接为当前最新版本
  var xhsPages = ['xhs1.html','xhspl.html','xhs2.html','xhs3.html'];
  var allLinks = document.querySelectorAll('a');
  for (var i = 0; i < allLinks.length; i++) {
    var h = allLinks[i].getAttribute('href');
    if (h && xhsPages.indexOf(h) !== -1) {
      allLinks[i].href = home;
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
      { id:'xhsyingwu',    label:'金刚鹦鹉', pl:'xhsyingwupl' },
      { id:'xhstroisbody', label:'仨体',      pl:'xhstroisbodypl' },
      { id:'xhsjiankang',  label:'健康生活',  pl:'xhsjiankangpl' },
      { id:'xhsyiqing',    label:'疫情',      pl:'xhsyiqingpl' },
      { id:'xhshuajia',    label:'语文书' },
      { id:'xhsfumao',     label:'孵猫' },
      { id:'xhschongyan',  label:'彩南虫宴' },
      { id:'xhsxunyu',     label:'熏鱼' },
      { id:'xhsshangzhua', label:'上爪' },
      { id:'xhsbwbj',      label:'霸王别姬' },
      { id:'xhsmbc',       label:'鹦鹉套餐' },
      { id:'xhswangle',    label:'首页推荐' },
      { id:'xhscasetubu',  label:'徒步发现的脚印' },
      { id:'xhscasexiaban',label:'下班发现裸猿' },
      { id:'xhscaseyouyong',label:'水猴子' },
      { id:'xhscasexiangxia',label:'无意拍摄' },
      { id:'xhshuajiabucuo',label:'雪地里的小画家' },
      { id:'xhsweys',      label:'威尔已死' },
      { id:'xiaolan',       label:'小蓝主页' },
      { id:'xhsit',         label:'贾霭醍主页' },
      { id:'xhssettings',   label:'西红柿设置' },
      { id:'xhsyuangong',  label:'员工后台' },
      { id:'jisuanji2',    label:'计算机小知识' },

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
      { id:'qbdxcy',       label:'新城疫' },
      { id:'qbdmaoxing',   label:'昴星' },
      { id:'qbdrenlei',    label:'人类' },
      { id:'qbdweys',      label:'威尔已死' },
      { id:'qbdgqcm',      label:'过目不忘' },
      { id:'qbdyq',        label:'月球' },
      { id:'qbdcainan',    label:'彩南' },
      { id:'qbdshangzhua', label:'上爪' },
      { id:'qbdxsz',       label:'小石子' },
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
    { key:'ach-searchmaster',       name:'却不在灯火阑珊处' },
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
    + '.idx-cat-link{display:block;text-decoration:none;transition:opacity .15s;}'
    + '.idx-cat-link:hover{opacity:.7;}'
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
    // 分类标题可点击跳转
    var catLinks = { '西红柿':'xhs1.html', '矢呼':'shjm.html', '千百度':'qianbaidu.html' };
    if (cat === '西红柿') catLinks['西红柿'] = home;  // 当前最新xhs版本
    var titleHTML = anySeen
      ? '<a class="idx-cat-title idx-cat-link" href="' + catLinks[cat] + '">' + catTitle + '</a>'
      : '<div class="idx-cat-title">' + catTitle + '</div>';
    bodyHTML += '<div class="idx-cat">' + titleHTML;
    for (var j = 0; j < items.length; j++) {
      var it = items[j];
      // 已访问 或 pl评论版已访问 都算"已解锁"
      var seen = visitedSet.indexOf(it.id) !== -1
        || (it.pl && visitedSet.indexOf(it.pl) !== -1);
      // 如果有 pl 评论版且已解锁，跳转到评论版
      var url = it.id + '.html';
      if (it.pl && visitedSet.indexOf(it.pl) !== -1) {
        url = it.pl + '.html';
      }
      if (seen) {
        bodyHTML += '<a class="idx-link seen" href="' + url + '">'
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
