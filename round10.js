(function () {
  const selectOptions = {
    '项目类型': ['费用化研发项目','资本化研发项目','研发公共类'],
    '项目状态': ['进行中','已结项','已暂停','已终止'],
    '资产类型': ['软件','设备','仪器','专利'],
    '资产产研性质': ['生产研发共用','研发专用'],
    '费用类别': ['设计费','调试费','资料检索费','其他费用'],
    '委托研发类别': ['境内委托研发','境外委托研发'],
    '数据类型': ['财务数据','项目数据','知识产权数据'],
    '年份': ['2026','2025','2024','2023'],
    '文件类型': ['技术调查报告','会议纪要','项目准备材料','研发人员名单','研发设备清单','研发材料清单','技术设计资料','研发费用明细表','合作开发合同','委托外部研发合同','中期验收报告','验收(结题)报告','检测报告','用户使用报告','参考文献','研发项目文档','其他文档']
  };
  function toast(message, type = 'success') {
    const root = document.querySelector('.toast-root');
    if (!root) return;
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.textContent = message;
    root.appendChild(el);
    setTimeout(() => el.classList.add('show'), 20);
    setTimeout(() => { el.classList.remove('show'); setTimeout(() => el.remove(), 220); }, 2200);
  }
  function currentPage() { return document.querySelector('.tab.active')?.dataset.page || document.querySelector('.sub-link.selected')?.dataset.page || '首页'; }
  function closePopovers() { document.querySelectorAll('.n-popover-sim,.n-date-sim,.n-tool-popover').forEach(el => el.remove()); }
  function labelOf(el) {
    const field = el.closest('.form-item,.modal-field');
    const text = field?.querySelector('span')?.innerText || el.innerText || '';
    return text.replace('*','').trim();
  }
  function positionBox(anchor, box) {
    const rect = anchor.getBoundingClientRect();
    box.style.left = Math.min(rect.left, window.innerWidth - 260) + 'px';
    box.style.top = rect.bottom + 6 + 'px';
    box.style.minWidth = Math.max(rect.width, 180) + 'px';
  }
  function openSelect(anchor) {
    closePopovers();
    const label = labelOf(anchor);
    const key = Object.keys(selectOptions).find(k => label.includes(k)) || '项目类型';
    const box = document.createElement('div');
    box.className = 'n-popover-sim';
    box.innerHTML = `<div class="pop-search"><input placeholder="搜索"></div>${selectOptions[key].map((x,i)=>`<button class="${i===0?'active':''}">${x}</button>`).join('')}`;
    document.body.appendChild(box);
    positionBox(anchor, box);
    box.querySelectorAll('button').forEach(btn => btn.addEventListener('click', () => {
      const input = anchor.querySelector('input');
      if (input) input.value = btn.innerText;
      else anchor.childNodes[0].nodeValue = btn.innerText;
      closePopovers();
      toast(`已选择${btn.innerText}`);
    }));
  }
  function openDate(anchor) {
    closePopovers();
    const box = document.createElement('div');
    box.className = 'n-date-sim';
    const days = Array.from({length: 30}, (_, i) => i + 1);
    box.innerHTML = `<div class="date-head"><button>‹</button><b>2026年 03月</b><button>›</button></div><div class="date-week"><span>一</span><span>二</span><span>三</span><span>四</span><span>五</span><span>六</span><span>日</span></div><div class="date-grid">${days.map(d=>`<button class="${d===23?'active':''}">${d}</button>`).join('')}</div><div class="date-foot"><button class="ghost-btn">此刻</button><button class="primary-btn">确认</button></div>`;
    document.body.appendChild(box);
    positionBox(anchor, box);
    box.querySelectorAll('.date-grid button,.date-foot .primary-btn').forEach(btn => btn.addEventListener('click', () => {
      const input = anchor.querySelector('input') || anchor;
      if ('value' in input) input.value = '2026-03-23';
      closePopovers();
      toast('日期已选择');
    }));
  }
  function openTool(anchor, type) {
    closePopovers();
    const box = document.createElement('div');
    box.className = 'n-tool-popover';
    if (type === 'density') box.innerHTML = '<button>紧凑</button><button class="active">默认</button><button>宽松</button>';
    else if (type === 'columns') box.innerHTML = '<label><input type="checkbox" checked> 项目编号</label><label><input type="checkbox" checked> 项目名称</label><label><input type="checkbox" checked> 操作</label><button class="primary-btn">确认</button>';
    else box.innerHTML = '<button>刷新当前页</button><button>重置筛选</button>';
    document.body.appendChild(box);
    positionBox(anchor, box);
    box.querySelectorAll('button,label').forEach(btn => btn.addEventListener('click', () => toast('表格设置已更新')));
  }
  function bind() {
    document.addEventListener('click', event => {
      const target = event.target;
      const select = target.closest('.n-select-like,.input-like');
      const selectLabel = select ? labelOf(select) : '';
      if (select && !select.classList.contains('range-like') && /类型|状态|类别|性质|来源|项目名称|数据类型|年份/.test(selectLabel)) {
        event.stopPropagation();
        openSelect(select);
        return;
      }
      const date = target.closest('.n-input-control,.range-like');
      if (date && /日期|月份|年份|时间/.test(labelOf(date) + ' ' + (date.querySelector('input')?.placeholder || ''))) {
        event.stopPropagation();
        openDate(date);
        return;
      }
      const tool = target.closest('.table-tools button');
      if (tool) {
        const title = tool.getAttribute('title') || tool.innerText;
        event.stopPropagation();
        if (title.includes('刷新')) toast(`${currentPage()}已刷新`);
        else if (title.includes('密度')) openTool(tool, 'density');
        else if (title.includes('列')) openTool(tool, 'columns');
        else if (title.includes('全屏')) document.body.classList.toggle('table-fullscreen');
        return;
      }
      const pager = target.closest('.pager button,.pager select');
      if (pager) {
        event.stopPropagation();
        if (pager.tagName === 'SELECT') toast(`已切换为${pager.value}`);
        else toast('分页状态已更新');
      }
      if (!target.closest('.n-popover-sim,.n-date-sim,.n-tool-popover')) closePopovers();
    }, true);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closePopovers(); });
  }
  function patchPager() {
    document.querySelectorAll('.pager').forEach(pager => {
      pager.dataset.round10 = '1';
      if (!pager.querySelector('.pager-jump')) {
        const jump = document.createElement('span');
        jump.className = 'pager-jump';
        jump.innerHTML = '跳至 <input value="1"> 页';
        pager.appendChild(jump);
      }
    });
  }
  function patchTableTools() {
    document.querySelectorAll('.table-tools button').forEach(btn => {
      if (!btn.getAttribute('aria-label')) btn.setAttribute('aria-label', btn.getAttribute('title') || '表格工具');
    });
  }
  function apply() { patchPager(); patchTableTools(); }
  document.addEventListener('click', () => setTimeout(apply, 100), true);
  new MutationObserver(apply).observe(document.body, { childList: true, subtree: true });
  bind();
  setTimeout(apply, 300);
})();

