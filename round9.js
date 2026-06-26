(function () {
  const assetFields = {
    '无形资产': ['资产编号','资产名称','资产类型','资产产研性质','资产来源','资产原值','取得日期','开始使用日期','摊销期限(月)','月摊销额(元)','参与研发活动最高比例','归属项目类型','参与项目','备注','附件'],
    '固定资产': ['资产名称','资产编号','资产类型','资产产研性质','规格型号','资产原值','购置日期','开始使用日期','折旧年限(月)','月折旧额(元)','资产每天运行时长','参与研发活动最高比例','归属项目类型','参与项目','备注','附件'],
    '经营租赁资产': ['资产编号','资产名称','资产类型','资产产研性质','规格型号','功率(kW)','租赁开始日期','租赁结束日期','月租赁金额(元)','资产每天运行时长(h)','参与研发活动最高比例(%)','归属项目类型','参与项目','备注','附件']
  };
  const sampleFields = {
    '领料申请': ['领料日期','项目编号','项目名称','领料人','领料编号','物料编号','物料名称','材料投入类别','出库数量','出库单价(元)','备注','关联领料清单'],
    '样品及其他入库': ['入库日期','入库单号','物料编号','物料名称','物料类别','数量单位','入库数量','入库单价(元)','入库金额(元)','经办人','备注','附件'],
    '样品及其他出库': ['出库日期','出库单号','物料编号','物料名称','物料类别','数量单位','出库数量','出库单价(元)','出库金额(元)','领用人','备注','附件'],
    '物料报废': ['物料类型','物料名称','物料编号','数量单位','申请报废数量','申请报废日期','预计报废日期','预计报废方式','报废产生收入(元)','报废处置人员','报废原因','附件'],
    '物料盘点': ['盘点日期','盘点单号','物料编号','物料名称','账面数量','盘点数量','差异数量','盘点人','差异原因','附件']
  };
  const reportFields = {
    '高新技术企业相关报表': ['年份','报表类型','生成范围','企业名称','统一社会信用代码','研发费用归集口径','附件'],
    '补充数据录入': ['年份','数据类型','数据项','数值','单位','归属项目','说明','附件'],
    '加计扣除相关报表': ['年度','报表名称','生成范围','项目类型','生成说明'],
    '加计扣除留存备查资料': ['年份','资料范围','项目计划书校验','预算偏差阈值','生成说明']
  };
  const allPages = Object.assign({}, assetFields, sampleFields, reportFields);

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
  function modal(title, body, wide = true) {
    const root = document.querySelector('.overlay-root');
    if (!root) return;
    root.innerHTML = `<div class="modal-mask"><section class="modal-panel ${wide ? 'modal-wide modal-xl' : ''}" role="dialog" aria-modal="true"><header><h2>${title}</h2><button class="modal-close" aria-label="关闭">×</button></header><div class="modal-body">${body}</div><footer><button class="ghost-btn modal-close-action">取 消</button><button class="primary-btn modal-ok">确 认</button></footer></section></div>`;
    root.querySelectorAll('.modal-close,.modal-close-action').forEach(btn => btn.addEventListener('click', closeModal));
    root.querySelector('.modal-ok')?.addEventListener('click', () => { closeModal(); toast(`${title}已完成`); });
  }
  function value(label) {
    const map = {'资产编号':'002','资产名称':'算法专利','资产类型':'软件','资产产研性质':'生产研发共用','资产来源':'资本化研发项目形成','资产原值':'1,000.00','取得日期':'2026-03-01','开始使用日期':'2026-03-01','摊销期限(月)':'24','月摊销额(元)':'41.67','资产名称':'建模设备','规格型号':'008','购置日期':'2026-03-01','折旧年限(月)':'36','月折旧额(元)':'277.78','领料日期':'2026-03-01','项目编号':'XM001','项目名称':'学富网','领料人':'和美','领料编号':'001','物料编号':'3333','物料名称':'电脑设备','材料投入类别':'研发专用材料投入','出库数量':'10','出库单价(元)':'500.00','年份':'2026','年度':'2026','数据类型':'财务数据','数据项':'营业收入','数值':'0.00','单位':'元'};
    return map[label] || '示例数据';
  }
  function control(label, readonly) {
    const ro = readonly ? 'readonly' : '';
    const val = readonly ? value(label) : '';
    if (/日期|年度|年份/.test(label)) return `<div class="n-input-control"><input ${ro} value="${val}" placeholder="请选择${label}"><em>📅</em></div>`;
    if (/类型|性质|来源|类别|项目|范围|口径|方式|人员|经办人|领用人|盘点人|企业/.test(label) && !/编号|名称|金额|数量/.test(label)) return `<button class="n-select-like" ${readonly ? 'disabled' : ''}>${val || '请选择' + label}<em>⌄</em></button>`;
    if (/附件|清单/.test(label)) return `<div class="upload-drop"><button class="ghost-btn">上传</button><button class="ghost-btn">下载模板</button><p>支持 doc/docx/xls/xlsx/pdf/png/jpg/zip，单个文件不超过 100MB</p></div>`;
    if (/备注|说明|原因/.test(label)) return `<textarea ${ro} placeholder="请输入${label}">${val}</textarea>`;
    return `<input ${ro} value="${val}" placeholder="请输入${label}">`;
  }
  function buildForm(page, mode) {
    const readonly = mode === '详情';
    const fields = allPages[page] || ['名称','类型','备注'];
    return `<div class="form-section-title">基础信息</div><div class="real-form-grid round9-form">${fields.map((label, index) => `<label class="modal-field ${/备注|说明|原因|附件|清单/.test(label) ? 'wide' : ''}"><span>${index < 3 && !readonly ? '<i>*</i> ' : ''}${label}</span>${control(label, readonly)}</label>`).join('')}</div>${assetFields[page] ? assetProjectSection() : ''}`;
  }
  function assetProjectSection() {
    return `<div class="form-section-title">参与研发项目</div><table class="resource-table mini"><thead><tr><th>项目编号</th><th>项目名称</th><th>项目类型</th><th>参与比例</th><th>操作</th></tr></thead><tbody><tr><td>XM001</td><td>学富网</td><td>费用化研发项目</td><td>50%</td><td><button data-inline-action="remove">删除</button></td></tr><tr><td>XM002</td><td>力企云</td><td>资本化研发项目</td><td>50%</td><td><button data-inline-action="remove">删除</button></td></tr></tbody></table><button class="ghost-btn add-project-row">新增参与项目</button>`;
  }
  function reportPreview(page) {
    const rows = page.includes('高新') ? [['高新技术企业研发费用结构明细表','已生成','2026-03-23 17:57:42'],['高新技术产品收入归集表','未生成','--']] : [['研发费用加计扣除辅助账汇总表','已生成','2026-03-23 17:57:42'],['留存备查资料包','已完成','2026-03-23 17:52:06']];
    return `<div class="report-preview"><div class="preview-toolbar"><button class="primary-btn">一键生成</button><button class="ghost-btn">预览</button><button class="ghost-btn">下载</button></div><table class="resource-table"><thead><tr><th>资料/报表名称</th><th>状态</th><th>生成时间</th></tr></thead><tbody>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  }
  function bind() {
    document.addEventListener('click', event => {
      const page = currentPage();
      const btn = event.target.closest('button,[data-row-action]');
      if (!btn) return;
      const text = (btn.dataset.rowAction || btn.innerText || '').trim();
      if (!allPages[page]) return;
      if (['新增','详情','修改','新增无形资产','新增固定资产'].some(action => text.includes(action))) {
        event.stopPropagation();
        const mode = text.includes('详情') ? '详情' : text.includes('修改') ? '修改' : '新增';
        setTimeout(() => modal(`${mode}${page}`, buildForm(page, mode)), 0);
      } else if (text.includes('一键生成') || text === '预览') {
        event.stopPropagation();
        setTimeout(() => modal(`${text}${page}`, `${buildForm(page, '新增')}${reportPreview(page)}`), 0);
      }
    }, true);
  }
  function patchReportRows() {
    const page = currentPage();
    if (!reportFields[page]) return;
    document.querySelectorAll('[data-row-action]').forEach(btn => {
      const text = btn.dataset.rowAction || btn.innerText;
      if ((text === '下载' || text === '预览') && !btn.dataset.round9) {
        btn.dataset.round9 = '1';
        btn.addEventListener('click', e => { e.stopPropagation(); toast(text === '下载' ? '文件下载已开始' : '报表预览已打开'); }, true);
      }
    });
  }
  function apply() { patchReportRows(); }
  document.addEventListener('click', () => setTimeout(apply, 120), true);
  new MutationObserver(apply).observe(document.body, { childList: true, subtree: true });
  bind();
  setTimeout(apply, 300);
})();
