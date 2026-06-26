(function () {
  const U = {
    staff: '\u4eba\u5458\u6863\u6848',
    timesheet: '\u4eba\u5458\u5de5\u65f6\u8868',
    direct: '\u76f4\u63a5\u6295\u5165\u8d39\u7528',
    receive: '\u9886\u6599\u7533\u8bf7',
    alloc: '\u652f\u51fa\u5206\u914d\u6c47\u603b'
  };

  const pageData = {};
  pageData[U.staff] = {
    title: '\u5458\u5de5\u6863\u6848\u5217\u8868',
    filters: ['\u5458\u5de5\u5de5\u53f7','\u5458\u5de5\u59d3\u540d','\u624b\u673a\u53f7\u7801','\u6240\u5c5e\u90e8\u95e8','\u8058\u7528\u65b9\u5f0f','\u5728\u804c\u72b6\u6001','\u5165\u804c\u65e5\u671f'],
    actions: ['\u65b0\u589e\u5458\u5de5\u6863\u6848','\u5bfc\u51fa','\u5bfc\u5165','\u6279\u91cf\u5220\u9664'],
    columns: ['\u5458\u5de5\u5de5\u53f7','\u5458\u5de5\u59d3\u540d','\u624b\u673a\u53f7\u7801','\u6240\u5c5e\u90e8\u95e8\u540d\u79f0','\u5c97\u4f4d\u540d\u79f0','\u5728\u804c\u72b6\u6001','\u5165\u804c\u65e5\u671f','\u8058\u7528\u65b9\u5f0f','\u53c2\u4e0e\u9879\u76ee','\u64cd\u4f5c'],
    rows: [['001','\u5f20\u4e09','15625250369','\u7814\u53d1\u90e8','\u524d\u7aef\u5f00\u53d1','\u5728\u804c','2026-01-12','\u6b63\u5f0f\u5458\u5de5','1','\u8be6\u60c5  \u4fee\u6539  \u5220\u9664'],['002','\u674e\u56db','15685857412','\u7814\u53d1\u90e8','\u524d\u7aef\u5f00\u53d1','\u5728\u804c','2026-01-13','\u4e34\u65f6\u8058\u7528','2','\u8be6\u60c5  \u4fee\u6539  \u5220\u9664'],['003','\u548c\u7f8e','15685875414','\u7814\u53d1\u90e8','\u524d\u7aef\u5f00\u53d1','\u5728\u804c','2026-01-12','\u6b63\u5f0f\u5458\u5de5','2','\u8be6\u60c5  \u4fee\u6539  \u5220\u9664']]
  };
  pageData[U.timesheet] = {
    title: '\u4eba\u5458\u5de5\u65f6\u5217\u8868',
    filters: ['\u5e74\u6708','\u5458\u5de5\u5de5\u53f7','\u5458\u5de5\u59d3\u540d','\u9879\u76ee\u540d\u79f0','\u9879\u76ee\u7f16\u53f7'],
    actions: ['\u4e00\u952e\u66f4\u65b0\u5de5\u65f6\u6570\u636e','\u5bfc\u51fa','\u5bfc\u5165','\u4e0b\u8f7d\u6a21\u677f'],
    columns: ['\u5458\u5de5\u5de5\u53f7','\u5458\u5de5\u59d3\u540d','\u53c2\u4e0e\u7814\u53d1\u9879\u76ee','\u9879\u76ee\u7f16\u53f7'].concat(Array.from({length:31}, function(_, i) { return (i + 1) + '\u65e5'; })).concat(['\u5de5\u65f6\u5408\u8ba1(h)','\u64cd\u4f5c']),
    rows: [['001','\u5f20\u4e09','\u5b66\u5bcc\u7f51','XM001'].concat(Array.from({length:31}, function(_, i) { return i < 22 ? '8' : '0'; })).concat(['176','\u4fee\u6539  \u5220\u9664']), ['002','\u674e\u56db','\u529b\u4f01\u4e91','XM002'].concat(Array.from({length:31}, function(_, i) { return i < 20 ? '8' : '0'; })).concat(['160','\u4fee\u6539  \u5220\u9664'])]
  };
  pageData[U.direct] = {
    title: '\u6750\u6599\u76f4\u63a5\u6295\u5165\u660e\u7ec6\u5217\u8868',
    tabs: ['\u6750\u6599\u76f4\u63a5\u6295\u5165\u660e\u7ec6\u8868','\u5176\u4ed6\u76f4\u63a5\u6295\u5165\u660e\u7ec6\u8868','\u7ecf\u8425\u79df\u8d41\u8d39\u7528\u660e\u7ec6\u8868'],
    filters: ['\u8d39\u7528\u6708\u4efd','\u9879\u76ee\u7f16\u53f7','\u9879\u76ee\u540d\u79f0','\u6750\u6599\u76f4\u63a5\u6295\u5165\u7c7b\u522b'],
    actions: ['\u65b0\u589e','\u5bfc\u51fa','\u5bfc\u5165','\u6279\u91cf\u5220\u9664'],
    columns: ['\u8d39\u7528\u6708\u4efd','\u9879\u76ee\u7f16\u53f7','\u9879\u76ee\u540d\u79f0','\u6750\u6599\u6295\u5165\u7c7b\u522b','\u9886\u6599\u7533\u8bf7\u4eba','\u9886\u6599\u65e5\u671f','\u9886\u6599\u7f16\u53f7','\u7269\u6599\u7f16\u53f7','\u7269\u6599\u540d\u79f0','\u89c4\u683c\u578b\u53f7','\u6570\u91cf\u5355\u4f4d','\u51fa\u5e93\u6570\u91cf','\u51fa\u5e93\u5355\u4ef7(\u5143)','\u51fa\u5e93\u603b\u91d1\u989d(\u5143)','\u5907\u6ce8','\u521b\u5efa\u4eba','\u64cd\u4f5c'],
    rows: [['2025-08','XM001','\u5b66\u5bcc\u7f51','\u7814\u53d1\u4e13\u7528\u6750\u6599\u6295\u5165','\u548c\u7f8e','2026-03-01','001','3333','\u7535\u8111\u8bbe\u5907','dsd','\u53f0','10','500.00','5,000.00','\u3000','\u738b\u96c1','\u4fee\u6539  \u5220\u9664'],['2026-03','XM002','\u529b\u4f01\u4e91','\u7814\u53d1\u4e13\u7528\u6750\u6599\u6295\u5165','\u674e\u56db','2026-03-03','002','00000','\u94a2\u7b14','dsafa','\u4ef6','1000','30.00','30,000.00','\u3000','\u738b\u96c1','\u4fee\u6539  \u5220\u9664']]
  };

  function currentPage() { return document.querySelector('.tab.active')?.dataset.page || document.querySelector('.sub-link.selected')?.dataset.page || ''; }
  function isSelectLabel(label) { return /\u7c7b\u522b|\u72b6\u6001|\u65b9\u5f0f|\u90e8\u95e8|\u9879\u76ee\u540d\u79f0/.test(label); }
  function isDateLabel(label) { return /\u65e5\u671f|\u6708\u4efd|\u5e74\u6708/.test(label); }
  function field(label) {
    if (isDateLabel(label)) return '<div class="input-like range-like"><input placeholder="' + label + '"><b></b><input placeholder="\u7ed3\u675f\u65f6\u95f4"></div>';
    if (isSelectLabel(label)) return '<div class="input-like"><input placeholder="\u8bf7\u9009\u62e9' + label + '"><em>\u2304</em></div>';
    return '<div class="input-like"><input placeholder="' + label + '"></div>';
  }
  function actionCell(value) {
    const parts = String(value).split(/\s+/).filter(Boolean);
    if (parts.length < 2) return value;
    return parts.map(function(a) { return '<button data-row-action="' + a + '">' + a + '</button>'; }).join('');
  }
  function render(cfg) {
    const tabs = cfg.tabs ? '<div class="inner-tabs">' + cfg.tabs.map(function(t, i) { return '<button class="inner-tab ' + (i ? '' : 'active') + '">' + t + '</button>'; }).join('') + '</div>' : '';
    const filters = cfg.filters.map(function(f) { return '<label class="form-item"><span>' + f + '</span>' + field(f) + '</label>'; }).join('');
    const actions = cfg.actions.map(function(a, i) { return '<button class="' + (i ? 'ghost-btn' : 'primary-btn') + '" ' + (a.indexOf('\u6279\u91cf') >= 0 ? 'disabled' : '') + '>' + a + '</button>'; }).join('');
    const headers = cfg.columns.map(function(c) { return '<th>' + c + (/\u65e5\u671f/.test(c) ? '  ' : '') + '</th>'; }).join('');
    const rows = cfg.rows.map(function(r) { return '<tr><td class="check-col"><span class="checkbox"></span></td>' + r.map(function(c, i) { return '<td class="' + (i === r.length - 1 ? 'row-actions' : '') + '">' + (i === r.length - 1 ? actionCell(c) : c) + '</td>'; }).join('') + '</tr>'; }).join('');
    return tabs + '<section class="filter-card"><div class="filter-grid">' + filters + '</div><div class="filter-actions"><button class="ghost-btn">\u91cd \u7f6e</button><button class="primary-btn">\u641c \u7d22</button><button class="link-btn">\u6536\u8d77</button></div></section><section class="table-card"><div class="table-head"><h1>' + cfg.title + '</h1><div class="table-actions">' + actions + '</div><div class="table-tools"><button title="\u5237\u65b0"></button><button title="\u5bc6\u5ea6"></button><button title="\u5217\u8bbe\u7f6e"></button><button title="\u5168\u5c4f"></button></div></div><div class="table-scroll"><table><thead><tr><th class="check-col"><span class="checkbox header-checkbox"></span></th>' + headers + '</tr></thead><tbody>' + rows + '</tbody></table></div><div class="pager"><span>\u5171 ' + cfg.rows.length + ' \u6761\u8bb0\u5f55</span><button title="\u9996\u9875"></button><button title="\u4e0a\u4e00\u9875"></button><button title="\u4e0a\u4e00\u9875"></button><button class="active">1</button><button title="\u4e0b\u4e00\u9875"></button><button title="\u4e0b\u4e00\u9875"></button><button title="\u672b\u9875"></button><select><option selected>20\u6761/\u9875</option><option>10\u6761/\u9875</option><option>50\u6761/\u9875</option></select></div></section>';
  }
  function apply() {
    const name = currentPage();
    const cfg = pageData[name];
    const content = document.querySelector('.content');
    if (!cfg || !content || content.dataset.round3Page === name) return;
    content.dataset.round3Page = name;
    content.innerHTML = render(cfg);
  }
  document.addEventListener('click', function() { setTimeout(apply, 120); }, true);
  new MutationObserver(apply).observe(document.body, { childList: true, subtree: true });
  setTimeout(apply, 300);
})();
