﻿﻿(function () {
  const workbenchPages = {
    '我的导入导出': {
      title: '我的导入导出列表',
      filters: ['任务名称', '任务类型', '任务状态', '创建时间'],
      actions: ['刷 新', '批量删除'],
      columns: ['任务名称', '任务类型', '业务模块', '任务状态', '文件名称', '创建时间', '完成时间', '操作'],
      rows: [
        ['人员工时表导入', '导入', '研发过程管理', '已完成', '人员工时导入模板.xlsx', '2026-03-23 17:57:42', '2026-03-23 17:58:06', '下载 删除'],
        ['项目立项导出', '导出', '项目管理', '已完成', '项目立项列表.xlsx', '2026-03-23 17:52:06', '2026-03-23 17:52:12', '下载 删除']
      ]
    },
    'AI数据采集': {
      title: 'AI数据采集列表',
      filters: ['采集任务名称', '数据来源', '采集状态', '创建时间'],
      actions: ['新增采集任务', '刷 新', '批量删除'],
      columns: ['采集任务名称', '数据来源', '采集范围', '采集状态', '采集进度', '创建人', '创建时间', '操作'],
      rows: [
        ['工商信息采集', '企查查', '企业基本信息', '已完成', '100%', '王雁', '2026-03-23 17:57:42', '详情 重新采集 删除'],
        ['项目资料采集', '本地文件', '项目计划书/预算表', '待采集', '0%', '王雁', '2026-03-23 17:52:06', '详情 开始采集 删除']
      ]
    }
  };

  const fieldMap = {
    '无形资产': ['资产编号', '资产名称', '资产类型', '资产产研性质', '资产来源', '资产原值', '参与研发活动最高比例', '归属项目类型', '参与项目'],
    '固定资产': ['资产名称', '资产编号', '资产类型', '资产产研性质', '规格型号', '资产原值', '资产每天运行时长', '参与研发活动最高比例', '归属项目类型', '参与项目'],
    '经营租赁资产': ['资产编号', '资产名称', '资产类型', '资产产研性质', '规格型号', '功率(kW)', '资产每天运行时长(h)', '参与研发活动最高比例(%)', '归属项目类型', '参与项目'],
    '项目结项': ['项目名称', '项目编号', '结项日期', '结项说明', '结项报告'],
    '项目暂停': ['项目名称', '项目编号', '暂停日期', '预计恢复日期', '暂停说明'],
    '项目终止': ['项目名称', '项目编号', '终止日期', '终止说明'],
    '文件模版': ['模版名称', '文件类型', '适用项目类型', '上传文件'],
    '物料档案': ['物料编号', '物料名称', '规格型号', '物料类别', '数量单位'],
    '物料报废': ['物料类型', '物料名称', '物料编号', '申请报废数量', '申请报废日期', '预计报废方式', '报废处置人员'],
    '物料盘点': ['盘点日期', '物料编号', '物料名称', '账面数量', '盘点数量', '盘点人'],
    '会计凭证导入': ['凭证月份', '凭证字号', '摘要', '会计科目', '借方金额(元)', '贷方金额(元)'],
    '补充数据录入': ['年份', '数据类型', '数据项', '数值', '单位'],
    'AI数据采集': ['采集任务名称', '数据来源', '采集范围', '采集说明']
  };
  const feePages = ['新产品设计费', '装备调试费用', '委托研发费用', '其他相关费用', '应冲减研发费用', '审计调整研发费用'];
  feePages.forEach(page => fieldMap[page] = ['费用月份', '项目编号', '项目名称', page.includes('委托') ? '委托研发类别' : page.includes('冲减') ? '冲减类别' : page.includes('调整') ? '调整类别' : '费用类别', '金额(元)', '备注']);
  fieldMap['无形资产费用'] = ['费用月份', '无形资产名称', '无形资产编号', '无形资产类型', '无形资产摊销入账金额(元)', '备注'];

  function currentPage() {
    return document.querySelector('.tab.active')?.dataset.page || document.querySelector('.sub-link.selected')?.dataset.page || '首页';
  }
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
  function closeModal() {
    const root = document.querySelector('.overlay-root');
    if (root) root.innerHTML = '';
  }
  function openModal(title, body, options = {}) {
    const root = document.querySelector('.overlay-root');
    if (!root) return;
    const widthClass = options.large ? ' modal-wide' : '';
    root.innerHTML = `<div class="modal-mask"><section class="modal-panel${widthClass}" role="dialog" aria-modal="true"><header><h2>${title}</h2><button class="modal-close" aria-label="关闭">×</button></header><div class="modal-body">${body}</div><footer><button class="ghost-btn modal-close-action">取 消</button><button class="primary-btn modal-ok">确 认</button></footer></section></div>`;
    root.querySelectorAll('.modal-close,.modal-close-action').forEach(btn => btn.addEventListener('click', closeModal));
    root.querySelector('.modal-ok')?.addEventListener('click', () => { closeModal(); toast(`${title}已完成`); });
  }
  function inputControl(label, readonly) {
    if (/日期|月份|年份|时间/.test(label)) return `<div class="n-input-control"><input ${readonly} placeholder="请选择${label}" value="${readonly ? sample(label) : ''}"><em>📅</em></div>`;
    if (/类型|性质|来源|状态|类别|项目|数据来源|文件类型|方式|范围/.test(label)) return `<button class="n-select-like" ${readonly}>${readonly ? sample(label) : '请选择' + label}<em>⌄</em></button>`;
    if (/报告|上传文件/.test(label)) return `<div class="upload-drop"><button class="ghost-btn">上传</button><button class="ghost-btn">下载模版</button><p>支持 doc/docx/xls/xlsx/pdf/png/jpg/zip，单个文件不超过 100MB</p></div>`;
    return `<input ${readonly} placeholder="请输入${label}" value="${readonly ? sample(label) : ''}">`;
  }
  function sample(label) {
    const map = {'资产编号':'002','资产名称':'算法专利','资产类型':'软件','资产产研性质':'生产研发共用','资产来源':'资本化研发项目形成','资产原值':'1,000.00','参与研发活动最高比例':'100%','归属项目类型':'研发公共类','参与项目':'1','项目编号':'XM001','项目名称':'学富网','费用月份':'2026-03','金额(元)':'1,000.00','备注':'示例备注','物料编号':'3333','物料名称':'电脑设备','采集任务名称':'工商信息采集','数据来源':'企查查','年份':'2026'};
    return map[label] || '示例数据';
  }
  function formBody(page, mode) {
    const readonly = mode === '详情' ? 'readonly' : '';
    const fields = fieldMap[page] || ['项目编号', '项目名称', '费用月份', '备注'];
    return `<div class="real-form-grid">${fields.map((label, index) => `<label class="modal-field ${/说明|备注|报告|上传/.test(label) ? 'wide' : ''}"><span>${index < 3 && mode !== '详情' ? '<i>*</i> ' : ''}${label}</span>${inputControl(label, readonly)}</label>`).join('')}</div>`;
  }
  function renderWorkbench(cfg) {
    const rows = cfg.rows.map(row => `<tr><td class="check-col"><span class="checkbox"></span></td>${row.map((cell, index) => `<td class="${index === row.length - 1 ? 'row-actions' : ''}">${index === row.length - 1 ? actions(cell) : cell}</td>`).join('')}</tr>`).join('');
    return `<section class="filter-card"><div class="filter-grid">${cfg.filters.map(label => `<label class="form-item"><span>${label}</span>${filterControl(label)}</label>`).join('')}</div><div class="filter-actions"><button class="ghost-btn">重 置</button><button class="primary-btn">搜 索</button><button class="link-btn">收起</button></div></section><section class="table-card"><div class="table-head"><h1>${cfg.title}</h1><div class="table-actions">${cfg.actions.map((name, index) => `<button class="${index ? 'ghost-btn' : 'primary-btn'}" ${name.includes('批量') ? 'disabled' : ''}>${name}</button>`).join('')}</div><div class="table-tools"><button title="刷新"></button><button title="密度"></button><button title="列设置"></button><button title="全屏"></button></div></div><div class="table-scroll"><table data-enhanced="1"><thead><tr><th class="check-col"><span class="checkbox header-checkbox"></span></th>${cfg.columns.map(name => `<th>${name}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table></div><div class="pager"><span>共 ${cfg.rows.length} 条记录</span><button></button><button></button><button></button><button class="active">1</button><button></button><button></button><button></button><select><option selected>20条/页</option><option>10条/页</option><option>50条/页</option></select></div></section>`;
  }
  function filterControl(label) {
    if (/时间|日期/.test(label)) return `<div class="input-like range-like"><input placeholder="${label}"><b></b><input placeholder="结束时间"></div>`;
    if (/类型|状态|来源/.test(label)) return `<div class="input-like"><input placeholder="请选择${label}"><em>⌄</em></div>`;
    return `<div class="input-like"><input placeholder="${label}"></div>`;
  }
  function actions(text) {
    return String(text).split(/\s+/).filter(Boolean).map(name => `<button data-row-action="${name}">${name}</button>`).join('');
  }
  function applyWorkbench() {
    const page = currentPage();
    const cfg = workbenchPages[page];
    const content = document.querySelector('.content');
    if (!cfg || !content || content.dataset.round7Page === page) return;
    content.dataset.round7Page = page;
    content.innerHTML = renderWorkbench(cfg);
  }
  function openImportPanel(page) {
    openModal(page.includes('导入') ? page : '导入' + page, `<div class="import-panel"><div class="import-step active"><b>1</b><span>下载模板</span></div><div class="import-step active"><b>2</b><span>上传文件</span></div><div class="import-step"><b>3</b><span>导入完成</span></div><div class="upload-drop big"><button class="primary-btn">选择文件</button><button class="ghost-btn">下载模板</button><p>请上传不超过 100MB 的 xls/xlsx 文件，系统将校验字段后生成导入任务。</p></div></div>`, { large: true });
  }
  function openGeneratePanel(action, page) {
    openModal(action, `<div class="generate-panel"><div class="progress-ring">100%</div><div><h3>${action}完成</h3><p>${page} 数据已按当前年份/筛选条件生成，可在列表中查看生成记录。</p></div></div>`);
  }
  function bindRound7() {
    document.addEventListener('click', event => {
      const btn = event.target.closest('button');
      if (!btn) return;
      if (btn.id === 'aiGenerateBtn' || btn.classList.contains('ai-generate-btn')) return;
      const text = btn.innerText.trim();
      const page = currentPage();
      if (!text) return;
      if (text === '新增采集任务' || (text === '新增' && fieldMap[page]) || text.startsWith('新增') && page !== '项目立项') {
        event.stopPropagation();
        setTimeout(() => openModal(text === '新增采集任务' ? text : `新增${page}`, formBody(page, '新增'), { large: true }), 0);
      } else if (text === '导入') {
        event.stopPropagation();
        setTimeout(() => openImportPanel(page), 0);
      } else if (text === '导出') {
        toast('导出任务已创建，可在我的导入导出查看');
      } else if (text.includes('下载模板') || text.includes('下载模版')) {
        toast('模板文件下载已开始');
      } else if (text.includes('一键生成') || text.includes('一键扫描') || text.includes('一键更新') || text.includes('重新采集') || text.includes('开始采集')) {
        event.stopPropagation();
        setTimeout(() => openGeneratePanel(text, page), 0);
      }
      if (btn.dataset.rowAction) {
        const action = btn.dataset.rowAction;
        if (action === '详情' || action === '修改') {
          event.stopPropagation();
          setTimeout(() => openModal(`${action}${page}`, formBody(page, action), { large: true }), 0);
        } else if (action === '下载') {
          toast('文件下载已开始');
        }
      }
    }, true);
  }
  function cleanRetainedDuplicateActions() {
    if (currentPage() !== '加计扣除留存备查资料') return;
    const cards = Array.from(document.querySelectorAll('.filter-actions'));
    if (cards.length > 1) cards.slice(1).forEach(el => el.remove());
    const tableActions = document.querySelector('.table-actions');
    if (tableActions && tableActions.innerText.includes('一键生成')) tableActions.remove();
  }
  function apply() {
    applyWorkbench();
    cleanRetainedDuplicateActions();
  }
  document.addEventListener('click', () => setTimeout(apply, 120), true);
  new MutationObserver(apply).observe(document.body, { childList: true, subtree: true });
  bindRound7();
  setTimeout(apply, 300);
})();


