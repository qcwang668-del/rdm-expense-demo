(function () {
  const projectStatePages = {
    '项目结项': { date: '结项日期', reason: '结项说明', file: '结项报告', title: '项目结项列表' },
    '项目暂停': { date: '暂停日期', extraDate: '预计恢复日期', reason: '暂停说明', file: '暂停说明附件', title: '项目暂停列表' },
    '项目终止': { date: '终止日期', reason: '终止说明', file: '终止报告', title: '项目终止列表' }
  };
  const feeDetail = {
    '新产品设计费': ['费用月份','项目编号','项目名称','设计费用类别','设计任务名称','发生金额(元)','凭证字号','备注','附件'],
    '装备调试费用': ['费用月份','项目编号','项目名称','装备调试费用类别','装备名称','调试内容','发生金额(元)','凭证字号','备注','附件'],
    '委托研发费用': ['费用月份','项目编号','项目名称','委托研发类别','受托单位','合同编号','合同金额(元)','本期发生金额(元)','凭证字号','备注','附件'],
    '其他相关费用': ['费用月份','项目编号','项目名称','费用类别','费用名称','发生金额(元)','凭证字号','备注','附件'],
    '应冲减研发费用': ['费用月份','项目编号','项目名称','冲减类别','冲减来源','费用类型','冲减金额(元)','凭证字号','备注','附件'],
    '审计调整研发费用': ['费用月份','项目编号','项目名称','调整类别','调整方向','费用类型','调整金额(元)','凭证字号','备注','附件']
  };
  const assetPages = ['无形资产','固定资产','经营租赁资产'];
  const hourPages = ['人员工时表','无形资产工时表','固定资产工时表','经营租赁资产工时表'];

  function currentPage() { return document.querySelector('.tab.active')?.dataset.page || document.querySelector('.sub-link.selected')?.dataset.page || '首页'; }
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
  function closeModal() { const root = document.querySelector('.overlay-root'); if (root) root.innerHTML = ''; }
  function modal(title, body, large = true) {
    const root = document.querySelector('.overlay-root');
    if (!root) return;
    root.innerHTML = `<div class="modal-mask"><section class="modal-panel ${large ? 'modal-wide' : ''}" role="dialog" aria-modal="true"><header><h2>${title}</h2><button class="modal-close" aria-label="关闭">×</button></header><div class="modal-body">${body}</div><footer><button class="ghost-btn modal-close-action">取 消</button><button class="primary-btn modal-ok">确 认</button></footer></section></div>`;
    root.querySelectorAll('.modal-close,.modal-close-action').forEach(btn => btn.addEventListener('click', closeModal));
    root.querySelector('.modal-ok')?.addEventListener('click', () => { closeModal(); toast(`${title}已完成`); });
  }
  function control(label, readonly) {
    const ro = readonly ? 'readonly' : '';
    const value = readonly ? sample(label) : '';
    if (/日期|月份/.test(label)) return `<div class="n-input-control"><input ${ro} value="${value}" placeholder="请选择${label}"><em>📅</em></div>`;
    if (/类型|类别|方向|项目名称|项目编号|单位|资产|费用/.test(label) && !/金额/.test(label)) return `<button class="n-select-like" ${readonly ? 'disabled' : ''}>${value || '请选择' + label}<em>⌄</em></button>`;
    if (/附件|报告|文件/.test(label)) return `<div class="upload-drop"><button class="ghost-btn">上传</button><button class="ghost-btn">下载模板</button><p>支持 doc/docx/xls/xlsx/pdf/png/jpg/zip，单个文件不超过 100MB</p></div>`;
    if (/说明|备注|内容/.test(label)) return `<textarea ${ro} placeholder="请输入${label}">${value}</textarea>`;
    return `<input ${ro} value="${value}" placeholder="请输入${label}">`;
  }
  function sample(label) {
    const map = {'项目编号':'XM001','项目名称':'学富网','费用月份':'2026-03','结项日期':'2026-03-31','暂停日期':'2026-04-01','预计恢复日期':'2026-05-01','终止日期':'2026-02-28','设计费用类别':'新产品设计费','装备调试费用类别':'调试费','委托研发类别':'境内委托研发','受托单位':'深圳力企云技术服务有限公司','合同编号':'HT202603001','合同金额(元)':'120,000.00','本期发生金额(元)':'30,000.00','发生金额(元)':'18,000.00','凭证字号':'记-2026-03-001','调整方向':'调减','费用类型':'直接投入费用','冲减金额(元)':'1,200.00','调整金额(元)':'3,000.00'};
    return map[label] || '示例数据';
  }
  function form(labels, mode) {
    const readonly = mode === '详情';
    return `<div class="real-form-grid refined-form">${labels.map((label, index) => `<label class="modal-field ${/说明|备注|内容|附件|报告/.test(label) ? 'wide' : ''}"><span>${index < 3 && !readonly ? '<i>*</i> ' : ''}${label}</span>${control(label, readonly)}</label>`).join('')}</div>`;
  }
  function projectStateForm(page, mode) {
    const cfg = projectStatePages[page];
    const fields = ['项目名称','项目编号', cfg.date].concat(cfg.extraDate ? [cfg.extraDate] : []).concat([cfg.reason, cfg.file]);
    return form(fields, mode);
  }
  function feeForm(page, mode) { return form(feeDetail[page] || ['费用月份','项目编号','项目名称','金额(元)','备注','附件'], mode); }
  function assetProjectBody(page) {
    const rows = page === '无形资产' ? [['XM002','力企云','资本化研发项目','2025-11-01','2027-01-31','100%']] : [['XM001','学富网','费用化研发项目','2025-11-20','2027-01-31','50%'], ['XM002','力企云','资本化研发项目','2025-11-01','2027-01-31','50%']];
    return `<div class="resource-title">${page}参与研发项目</div><table class="resource-table"><thead><tr><th>项目编号</th><th>项目名称</th><th>项目类型</th><th>开始日期</th><th>结束日期</th><th>参与比例</th></tr></thead><tbody>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  }
  function patchAssetLinks() {
    if (!assetPages.includes(currentPage())) return;
    document.querySelectorAll('tbody tr').forEach(row => {
      const cells = Array.from(row.children);
      const participateCell = cells[cells.length - 2];
      if (!participateCell || participateCell.dataset.round8) return;
      const text = participateCell.textContent.trim();
      if (!text || text === '　') return;
      participateCell.dataset.round8 = '1';
      participateCell.innerHTML = `<button class="text-link asset-project-link">${text}</button>`;
    });
  }
  function patchHourCells() {
    if (!hourPages.includes(currentPage())) return;
    const headers = Array.from(document.querySelectorAll('thead th')).map(th => th.textContent.trim());
    document.querySelectorAll('tbody tr').forEach(row => {
      Array.from(row.children).forEach((cell, index) => {
        if (!/^\d+日$/.test(headers[index]) || cell.dataset.round8) return;
        cell.dataset.round8 = '1';
        const value = cell.textContent.trim();
        if (!value || value === '暂无数据') return;
        cell.innerHTML = `<button class="hour-cell-btn">${value}</button>`;
      });
    });
  }
  function openHourEdit(value) {
    modal('编辑工时', `<div class="real-form-grid"><label class="modal-field"><span><i>*</i> 工时</span><input value="${value}" placeholder="请输入工时"></label><label class="modal-field"><span>备注</span><input placeholder="请输入备注"></label></div>`, false);
  }
  function bindClicks() {
    document.addEventListener('click', event => {
      const page = currentPage();
      const target = event.target;
      const actionBtn = target.closest('[data-row-action],button');
      if (target.closest('.asset-project-link')) {
        event.stopPropagation();
        modal('参与项目', assetProjectBody(page));
        return;
      }
      if (target.closest('.hour-cell-btn')) {
        event.stopPropagation();
        openHourEdit(target.closest('.hour-cell-btn').innerText.trim());
        return;
      }
      if (!actionBtn) return;
      const text = (actionBtn.dataset.rowAction || actionBtn.innerText || '').trim();
      if (projectStatePages[page] && ['新增','详情','修改'].some(x => text.includes(x))) {
        event.stopPropagation();
        setTimeout(() => modal(`${text.includes('新增') ? '新增' : text}${page}`, projectStateForm(page, text.includes('详情') ? '详情' : text)), 0);
      } else if (feeDetail[page] && ['新增','详情','修改'].some(x => text.includes(x))) {
        event.stopPropagation();
        setTimeout(() => modal(`${text.includes('新增') ? '新增' : text}${page}`, feeForm(page, text.includes('详情') ? '详情' : text)), 0);
      }
    }, true);
  }
  function refineEmptyState() {
    const empty = document.querySelector('.empty-cell');
    if (empty && !empty.querySelector('.empty-state')) empty.innerHTML = '<div class="empty-state"><b>暂无数据</b><span>可通过新增、导入或一键生成创建记录</span></div>';
  }
  function apply() {
    patchAssetLinks();
    patchHourCells();
    refineEmptyState();
  }
  document.addEventListener('click', () => setTimeout(apply, 150), true);
  new MutationObserver(apply).observe(document.body, { childList: true, subtree: true });
  bindClicks();
  setTimeout(apply, 300);
})();

