/* ============================================================
   统一导航 — 根据当前版本自动更新 Logo & 返回链接

   localStorage:
     xhs-version  →  "1" | "pl" | "2" | "3"
     每当你解锁新版本,把值往上升一档即可:
       xhs1 → xhspl → xhs2 → xhs3

   使用方式: 页面底部 </body> 前加一行
     <script src="nav.js"></script>
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

  // 更新所有「返回列表」链接 (只覆盖指向旧版 xhs 的)
  var backs = document.querySelectorAll('.back-link');
  for (var i = 0; i < backs.length; i++) {
    var href = backs[i].getAttribute('href');
    if (href === 'xhs1.html' || href === 'xhspl.html' || href === 'xhs2.html' || href === 'xhs3.html') {
      backs[i].href = home;
    }
  }
})();
