/* ============================================================
   pages.js — 页面编号 + 快速跳转
   ────────────────────────────────────────────────────────────
   用法:每个 HTML 文件在 </body> 之前加一行
       <script src="pages.js"></script>
   就这一行,别的不用动。
   ────────────────────────────────────────────────────────────
   功能:
   1. 自动检测当前页面在 PAGES 列表里的位置
   2. 右上角浮一个小药丸: "05 / 14" (当前页码 / 总页数)
   3. 点药丸 → 弹出面板,列出所有页面
      - 已解锁的(去过的) → 可以点击跳转
      - 没解锁的           → 灰色 ??? 占位
   4. 当前页面加红色"在这里"标记
   5. 数据存在 localStorage,刷新/退出/重开都不丢
   ────────────────────────────────────────────────────────────
   清空记录(在浏览器控制台跑):
       localStorage.removeItem('unlocked-pages')
   ============================================================ */

(function () {

  /* ============================================================
     ★ 页面列表 — 你可以增删改这个数组
     ────────────────────────────────────────────────────────────
     - id    : 唯一标识,改完不要再动 (跟 localStorage 对应)
     - title : 显示在跳转面板里的名字
     - url   : 文件名,要跟实际的 .html 文件名一致
     - 顺序就是页码顺序,排第一就是 01,排第二就是 02
     ============================================================ */
  const PAGES = [
    // —— 主入口 ——
    { id: 'home',         title: '帖子首页',            url: 'xhs1.html' },

    // —— 帖子 ——
    { id: 'parrot',       title: '问问金刚鹦鹉',         url: 'xhsyingwu.html' },
    { id: 'troisbody',    title: '《仨体》阅读 Day2',    url: 'xhstroisbody.html' },
    { id: 'lyrics',       title: '不腐歌词接龙',         url: 'xhsbuxiu.html' },
    { id: 'yq',           title: 'yq 六年回忆',          url: 'xhsyiqing.html' },
    { id: 'huajia',       title: '语文书的配图',         url: 'xhshuajia.html' },
    { id: 'movie',        title: '宇宙探索编撰部',       url: 'xhsyubian.html' },

    // —— 系统页 ——
    { id: 'profile',      title: '我的',                 url: 'xhsprofile.html' },
    { id: 'settings',     title: '设置',                 url: 'xhssettings.html' },
    { id: 'admin-list',   title: '管理员列表',           url: 'xhsglylb.html' },

    // —— 隐藏支线 ——
    { id: 'cases',        title: '已处理 Case',          url: 'yichuli-cases.html' },

    // —— 千百度系 ——
    { id: 'qianbaidu',    title: '千百度 · 首页',        url: 'qianbaidu.html' },
    { id: 'xinchengyi',   title: '千百度 · 新城疫',      url: 'qianbaidu-xinchengyi.html' },

    // —— 视频站 ——
    { id: 'silly',        title: 'Silly Silly · 视频',   url: 'sillysilly.html' },

    // 想加新页面就照这个格式往下加
  ];

  const STORAGE_KEY = 'unlocked-pages';

  /* ============================================================
     localStorage 工具
     ============================================================ */
  function loadUnlocked() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return new Set(raw ? JSON.parse(raw) : []);
    } catch (e) { return new Set(); }
  }
  function saveUnlocked(set) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
    } catch (e) {}
  }

  /* ============================================================
     当前页定位 (从 URL 文件名匹配 PAGES 列表)
     ============================================================ */
  function getCurrentPageInfo() {
    const path = (window.location.pathname.split('/').pop() || '').toLowerCase();
    const idx = PAGES.findIndex(p => p.url.toLowerCase() === path);
    return {
      idx,
      page: idx >= 0 ? PAGES[idx] : null
    };
  }

  /* ============================================================
     CSS 注入
     ============================================================ */
  function injectCSS() {
    const css = `
      #page-jump-widget {
        position: fixed;
        top: 16px;
        right: 16px;
        z-index: 9999;
        font-family: 'Noto Sans SC', system-ui, -apple-system, sans-serif;
      }
      .pjw-trigger {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 7px 11px 7px 14px;
        background: rgba(26, 26, 26, 0.92);
        color: white;
        border: none;
        border-radius: 999px;
        font-family: inherit;
        font-size: 12.5px;
        font-weight: 600;
        cursor: pointer;
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.20);
        letter-spacing: 0.04em;
        transition: all 0.2s ease;
      }
      .pjw-trigger:hover {
        background: rgba(0, 0, 0, 1);
        transform: translateY(-1px);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.28);
      }
      .pjw-num { font-variant-numeric: tabular-nums; }
      .pjw-chev {
        width: 11px;
        height: 11px;
        stroke-width: 2.5;
        transition: transform 0.25s;
      }
      #page-jump-widget.open .pjw-chev { transform: rotate(180deg); }

      /* —— 下拉面板 —— */
      .pjw-panel {
        position: absolute;
        top: calc(100% + 8px);
        right: 0;
        width: 280px;
        max-height: min(70vh, 540px);
        overflow-y: auto;
        background: white;
        border-radius: 14px;
        box-shadow: 0 14px 44px rgba(0, 0, 0, 0.18),
                    0 4px 12px rgba(0, 0, 0, 0.06);
        opacity: 0;
        pointer-events: none;
        transform: translateY(-6px) scale(0.97);
        transform-origin: top right;
        transition: opacity 0.22s,
                    transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
      }
      #page-jump-widget.open .pjw-panel {
        opacity: 1;
        pointer-events: auto;
        transform: translateY(0) scale(1);
      }

      .pjw-head {
        padding: 16px 18px 12px;
        border-bottom: 1px solid #ece7df;
      }
      .pjw-head .pjw-head-title {
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 0.12em;
        color: #b89eaa;
        text-transform: uppercase;
        margin-bottom: 4px;
      }
      .pjw-head .pjw-head-stat {
        font-size: 14px;
        font-weight: 700;
        color: #1a1a1a;
      }
      .pjw-head .pjw-head-stat .pjw-acc { color: #e33932; }

      .pjw-list { list-style: none; margin: 0; padding: 6px; }

      .pjw-item-link, .pjw-item-locked {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 9px 11px;
        font-size: 13.5px;
        line-height: 1.3;
        border-radius: 8px;
      }

      .pjw-item-link {
        text-decoration: none;
        color: #1a1a1a;
        transition: background 0.15s;
      }
      .pjw-item-link:hover { background: #faf7f2; }

      .pjw-item-locked {
        color: #c4b9a8;
        cursor: default;
      }

      /* 当前页样式 */
      .pjw-item.current .pjw-item-link {
        background: #fde8e7;
        color: #c2241d;
        font-weight: 600;
      }
      .pjw-item.current .pjw-item-link:hover { background: #fdd7d5; }
      .pjw-item.current .pjw-idx { color: #c2241d; }

      .pjw-idx {
        font-family: 'JetBrains Mono', ui-monospace, 'SF Mono', monospace;
        font-size: 11px;
        color: #b89eaa;
        font-weight: 500;
        min-width: 22px;
        font-variant-numeric: tabular-nums;
      }
      .pjw-name { flex: 1; }
      .pjw-now {
        font-size: 9.5px;
        background: #c2241d;
        color: white;
        padding: 2px 7px;
        border-radius: 999px;
        font-weight: 600;
        letter-spacing: 0.04em;
        flex-shrink: 0;
      }

      @media (max-width: 480px) {
        #page-jump-widget { top: 12px; right: 12px; }
        .pjw-panel {
          width: calc(100vw - 24px);
          max-width: 320px;
        }
      }
    `;
    const style = document.createElement('style');
    style.id = 'page-jump-widget-style';
    style.textContent = css;
    document.head.appendChild(style);
  }

  /* ============================================================
     渲染 widget
     ============================================================ */
  function renderWidget(currentIdx, currentPage, unlocked) {
    const total = PAGES.length;
    const unlockedCount = unlocked.size;

    // 当前页码:在列表里就显示页码,不在列表里显示 "—"
    const currentLabel = currentIdx >= 0
      ? String(currentIdx + 1).padStart(2, '0')
      : '—';
    const totalLabel = String(total).padStart(2, '0');

    const widget = document.createElement('div');
    widget.id = 'page-jump-widget';
    widget.innerHTML = `
      <button class="pjw-trigger" type="button" aria-haspopup="true" aria-expanded="false">
        <span class="pjw-num">${currentLabel} / ${totalLabel}</span>
        <svg class="pjw-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>
      <div class="pjw-panel" role="menu">
        <div class="pjw-head">
          <div class="pjw-head-title">页面索引</div>
          <div class="pjw-head-stat">已解锁 <span class="pjw-acc">${unlockedCount}</span> / ${total}</div>
        </div>
        <ul class="pjw-list"></ul>
      </div>
    `;

    const list = widget.querySelector('.pjw-list');
    PAGES.forEach((p, i) => {
      const isUnlocked = unlocked.has(p.id);
      const isCurrent = currentPage && p.id === currentPage.id;
      const idx = String(i + 1).padStart(2, '0');

      const li = document.createElement('li');
      li.className = 'pjw-item' + (isCurrent ? ' current' : '');

      if (isUnlocked) {
        const a = document.createElement('a');
        a.className = 'pjw-item-link';
        a.href = p.url;
        a.innerHTML = `
          <span class="pjw-idx">${idx}</span>
          <span class="pjw-name"></span>
          ${isCurrent ? '<span class="pjw-now">在这里</span>' : ''}
        `;
        a.querySelector('.pjw-name').textContent = p.title;
        li.appendChild(a);
      } else {
        const div = document.createElement('div');
        div.className = 'pjw-item-locked';
        div.innerHTML = `
          <span class="pjw-idx">${idx}</span>
          <span class="pjw-name">??? 未解锁</span>
        `;
        li.appendChild(div);
      }
      list.appendChild(li);
    });

    document.body.appendChild(widget);

    // 切换打开 / 关闭
    const trigger = widget.querySelector('.pjw-trigger');
    trigger.addEventListener('click', e => {
      e.stopPropagation();
      const willOpen = !widget.classList.contains('open');
      widget.classList.toggle('open');
      trigger.setAttribute('aria-expanded', willOpen);
    });

    // 点外面 / 按 Esc 关
    document.addEventListener('click', e => {
      if (!widget.contains(e.target)) {
        widget.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
      }
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        widget.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ============================================================
     启动
     ============================================================ */
  function init() {
    const { idx, page } = getCurrentPageInfo();
    let unlocked = loadUnlocked();

    // 把当前页加入"已解锁"
    if (page && !unlocked.has(page.id)) {
      unlocked.add(page.id);
      saveUnlocked(unlocked);
    }

    injectCSS();
    renderWidget(idx, page, unlocked);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();