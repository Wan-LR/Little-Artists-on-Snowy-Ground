/* ============================================================
   统一导航 — 根据当前版本自动更新 Logo & 返回链接
   + 页面访问追踪 (xhs-pages-visited)
   ============================================================ */
(function () {
  var version = localStorage.getItem('xhs-version') || '1';
  var pages = {
    '1':  'xhs1.html',
    'pl': 'xhspl.html',
    '2':  'xhs2.html',
    '3':  'xhs3.html'
  };
  var home = pages[version] || 'xhs1.html';

  // 更新所有 Logo 链接
  var logos = document.querySelectorAll('.site-logo');
  for (var i = 0; i < logos.length; i++) {
    logos[i].href = home;
  }

  // 更新所有「返回列表」链接
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
})();
