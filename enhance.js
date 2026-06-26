(function () {
  const state = {
    filtersCollapsed: false,
    selectedRows: new Set(),
    theme: 'light',
    sidebarCollapsed: false,
  };

  const sampleRows = {
    '项目暂停': [['XM003','智慧供应链','2026-04-01','2026-05-01','需求范围重新评估','详情  修改  删除']],
    '项目终止': [['XM004','门店智能巡检','2026-02-28','投入产出不达预期','详情  修改  删除']],
    '新产品设计费': [['2026-03','XM001','学富网','界面交互设计','18,000.00','原型与视觉设计','修改  删除']],
    '装备调试费用': [['2026-03','XM002','力企云','测试设备调试','9,600.00','联调环境搭建','修改  删除']],
    '委托研发费用': [['2026-03','XM002','力企云','深圳力企云技术服务有限公司','120,000.00','30,000.00','修改  删除']],
    '其他相关费用': [['2026-03','XM001','学富网','资料检索费','2,800.00','研发技术资料检索','修改  删除']],
    '应冲减研发费用': [['2026-03','XM001','学富网','研发样品销售收入','1,200.00','修改  删除']],
    '审计调整研发费用': [['2026-03','XM002','力企云','调减','3,000.00','修改  删除']],
    '物料报废': [['BF001','2026-03-15','00000','钢笔','5','研发测试损耗','修改  删除']],
    '物料盘点': [['PD001','2026-03-31','3333','电脑设备','10','10','0','修改  删除']],
    '补充数据录入': [['2026','XM001','学富网','知识产权数量','2','修改  删除']],
    '租户审核': [['华润万家有限公司','王雁','2026-06-22 15:37:42','待审核','通过  驳回']],
    '人员考勤表': [['YG001','和美',...Array.from({length:31},(_,i)=> i < 22 ? '8' : '0'),'176'], ['YG002','李四',...Array.from({length:31},(_,i)=> i < 20 ? '8' : '0'),'160']],
  };

  function getActivePage() {
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
    setTimeout(() => {
      el.classList.remove('show');
      setTimeout(() => el.remove(), 220);
    }, 2200);
  }

  function closeModal() {
    const root = document.querySelector('.overlay-root');
    if (root) root.innerHTML = '';
  }

  function modal(title, body, footer = '') {
    const root = document.querySelector('.overlay-root');
    if (!root) return;
    root.innerHTML = `<div class="modal-mask"><section class="modal-panel" role="dialog" aria-modal="true"><header><h2>${title}</h2><button class="modal-close" aria-label="关闭">×</button></header><div class="modal-body">${body}</div><footer>${footer || '<button class="ghost-btn modal-close-action">取 消</button><button class="primary-btn modal-ok">确 定</button>'}</footer></section></div>`;
    root.querySelectorAll('.modal-close,.modal-close-action').forEach(btn => btn.addEventListener('click', closeModal));
    root.querySelectorAll('.modal-ok').forEach(btn => btn.addEventListener('click', () => { closeModal(); toast(`${title}已完成`); }));
  }

  function demoValue(name) {
    const map = { 项目编号:'XM001', 项目名称:'学富网', 费用月份:'2026-03', 创建人:'王雁', 员工工号:'YG001', 员工姓名:'和美', 租户名称:'华润万家有限公司', 联系人:'王雁', 联系电话:'15625250363', 状态:'启用', 项目负责人:'王雁', 研发类型:'自主研发', 项目类型:'费用化研发项目', 项目阶段:'开发阶段', 技术来源:'企业自有技术', 项目开展形式:'独立研发', 项目成果当年形式:'软件著作权', 技术经济指标:'提升研发费用归集效率' };
    return map[name] || '示例数据';
  }

  function formFields(page) {
    const common = ['项目编号','项目名称','费用月份','创建人'];
    if (page.includes('租户')) return ['租户名称','联系人','联系电话','套餐版本','状态'];
    if (page.includes('物料')) return ['物料编号','物料名称','规格型号','数量单位','库存数量'];
    if (page.includes('人员')) return ['员工工号','员工姓名','所属部门','岗位','入职日期'];
    if (page.includes('资产') || page.includes('折旧')) return ['资产编号','资产名称','原值(元)','开始使用日期','分摊期限'];
    if (page.includes('半成品入库')) return ['入库日期','项目编号','项目名称','物料编号','物料名称','规格型号','数量单位','入库数量','入库金额(元)','研发支出科目','经办人'];
    if (page.includes('半成品领用')) return ['领用日期','项目编号','项目名称','物料编号','物料名称','领用数量','领用用途','领料人','预期去向'];
    if (page.includes('半成品退库')) return ['退库日期','原领用单号','项目编号','物料编号','物料名称','退库数量','折算金额(元)','退库原因'];
    if (page.includes('半成品报废')) return ['报废日期','项目编号','物料编号','物料名称','报废数量','报废金额(元)','报废原因'];
    if (page.includes('半成品费用化')) return ['费用化日期','项目编号','物料编号','物料名称','数量','费用化金额(元)','来源类型','目标科目'];
    if (page.includes('专利信息库')) return ['专利编号','专利名称','专利类型','申请号','申请日期','专利权人','发明人','关联项目','法律状态'];
    if (page.includes('专利查重')) return ['查新日期','查新技术方向','关键词','查新结果','新颖性判断','风险等级','建议措施'];
    if (page.includes('专利匹配')) return ['项目编号','项目名称','推荐专利类型','推荐名称','匹配度(%)','技术关键词','推荐理由'];
    if (page.includes('情报分析')) return ['分析日期','分析主题','技术领域','分析摘要','竞品动态','风险提示'];
    return common;
  }

  function projectFormBody(mode) {
    const readonly = mode === '详情' ? 'readonly' : '';
    const value = (name, fallback = '') => mode === '新增' ? '' : (demoValue(name) || fallback);
    const input = (label, placeholder = '', required = false) => `<label class="modal-field"><span>${required ? '<i>*</i> ' : ''}${label}</span><input ${readonly} value="${value(label)}" placeholder="${placeholder || '请输入' + label}"></label>`;
    const select = (label, placeholder, required = false) => `<label class="modal-field"><span>${required ? '<i>*</i> ' : ''}${label}</span><button class="n-select-like" ${readonly}>${value(label, placeholder) || placeholder}<em>⌄</em></button></label>`;
    function upload(title, hasTemplate) {
  hasTemplate = hasTemplate !== false;
  var aiBtn = '';
  if (title === '立项决议书' || title === '项目计划书') {
    aiBtn = "<button type='button' class='ai-generate-link' data-type='" + title + "'>AI一键生成</button>";
  }
  var tplBtn = hasTemplate ? "<button class='ghost-btn'>下载模版</button>" : '';
  var uploadBtn = "<button class='ghost-btn'>上传</button>";
  return "<div class='project-upload'><div class='upload-title'>" + title + "</div><div class='upload-actions'>" + uploadBtn + tplBtn + aiBtn + "</div><p>请上传不超过 100MB 的 txt/doc/docx/xls/xlsx/jpg/jpeg/gif/png/pdf/mp3/mp4/ppt/pptx/zip 格式文件</p></div>";
}
    return `<div class="project-form-grid">
      ${input('项目编号', '请输入项目编号', true)}
      ${input('项目名称', '请输入项目名称', true)}
      ${input('开始日期', '请选择开始日期', true)}
      ${input('结束日期', '请选择结束日期', true)}
      ${select('项目负责人', '请选择', true)}
      ${select('研发类型', '请选择研发类型', true)}
      ${select('项目类型', '请选择项目类型', false)}
      ${select('项目阶段', '请选择项目阶段')}
      ${select('技术来源', '请选择技术来源', true)}
      ${select('项目开展形式', '请选择项目开展形式')}
      ${select('项目成果当年形式', '请选择项目成果当年形式')}
      ${select('技术经济指标', '请选择技术经济指标')}
      <label class="modal-field project-intro"><span>项目简介</span><textarea ${readonly} placeholder="请输入项目简介">${mode === '详情' ? '项目围绕研发费用管理业务进行技术研发，形成过程文件与研发成果。' : ''}</textarea></label>
      ${upload('立项决议书')}
      ${upload('项目计划书')}
      ${upload('相关附件', false)}
    </div>`;
  }

  function openProjectForm(mode) {
    modal(mode === '新增' ? '新增项目' : `${mode}项目`, projectFormBody(mode), '<button class="ghost-btn modal-close-action">取 消</button><button class="primary-btn modal-ok">确 认</button>');
    document.querySelector('.modal-panel')?.classList.add('project-modal');
  }

  function openForm(mode, page) {
    if (page === '项目立项') {
      openProjectForm(mode);
      return;
    }
    const fields = formFields(page).map(name => `<label class="modal-field"><span>${name}</span><input value="${mode === '详情' ? demoValue(name) : ''}" placeholder="请输入${name}" ${mode === '详情' ? 'readonly' : ''}></label>`).join('');
    modal(`${mode}${page}`, `<div class="modal-grid">${fields}</div><label class="modal-field wide"><span>备注</span><textarea placeholder="请输入备注">${mode === '详情' ? '系统演示数据，仅用于原型验收。' : ''}</textarea></label>`);
  }

  function openConfirm(action, page) {
    modal(`${action}确认`, `<p class="confirm-text">确定要${action}「${page}」当前选中数据吗？该操作在 demo 中会展示成功反馈，不会真实删除数据。</p>`, '<button class="ghost-btn modal-close-action">取 消</button><button class="danger-btn modal-ok">确 定</button>');
  }

  function openImport(page) {
    modal(`导入${page}`, `<div class="upload-box"><div class="upload-icon">⬆</div><p>点击或拖拽 Excel 文件到此处上传</p><small>支持 .xlsx / .xls，demo 将模拟校验和导入成功。</small></div><div class="import-tips"><span>1 下载模板</span><span>2 填写数据</span><span>3 上传校验</span></div>`, '<button class="ghost-btn modal-close-action">取 消</button><button class="primary-btn modal-ok">开始导入</button>');
  }

  function openExport(page) {
    toast(`${page}导出任务已创建，可在「我的导入导出」查看`);
  }

  // ========== AI 一键生成功能 ==========
  function showAIGenerating(btn) {
    btn.disabled = true;
    btn.innerHTML = '⏳ 生成中...';
    btn.style.opacity = '0.7';
  }

  function showAIComplete(btn) {
    btn.disabled = false;
    btn.innerHTML = 'AI一键生成';
    btn.style.opacity = '1';
    
    var docType = btn.dataset.type || '项目立项书';
    var now = new Date();
    var y = now.getFullYear();
    var m = String(now.getMonth() + 1).padStart(2, '0');
    var d = String(now.getDate()).padStart(2, '0');
    var h = String(now.getHours()).padStart(2, '0');
    var min = String(now.getMinutes()).padStart(2, '0');
    var s = String(now.getSeconds()).padStart(2, '0');
    var timestamp = '' + y + m + d + h + min + s;
    var fileName = docType + '-' + timestamp + '.docx';
    
    var uploadRow = btn.closest('.project-upload');
    if (uploadRow) {
      var oldFile = uploadRow.querySelector('.ai-generated-file');
      if (oldFile) oldFile.remove();
      
      var fileEl = document.createElement('div');
      fileEl.className = 'ai-generated-file';
      fileEl.style.cssText = 'display: flex; align-items: center; gap: 12px; padding: 8px 12px; margin-top: 8px; background: #f0f9ff; border: 1px solid #c9e0ff; border-radius: 6px; animation: fadeIn .3s ease-out;';
      fileEl.innerHTML = '<div style="display: flex; align-items: center; gap: 8px; flex: 1;"><span style="font-size: 18px;">📄</span><div><div style="font-weight: 500; color: #333;">' + fileName + '</div><div style="font-size: 12px; color: #999;">28.5 KB · 刚刚生成</div></div></div><div style="display: flex; gap: 8px;"><button class="ghost-btn ai-download-file" style="height: 26px; font-size: 12px; padding: 0 10px;">下载</button><button class="ghost-btn ai-remove-file" style="height: 26px; font-size: 12px; padding: 0 10px;">删除</button></div>';
      
      uploadRow.appendChild(fileEl);
      
      fileEl.querySelector('.ai-download-file').addEventListener('click', function(e) {
        e.stopPropagation();
        toast('文件「' + fileName + '」下载已开始');
      });
      
      fileEl.querySelector('.ai-remove-file').addEventListener('click', function(e) {
        e.stopPropagation();
        fileEl.remove();
      });
    }
    
    var introTextarea = document.querySelector('.project-intro textarea');
    if (introTextarea) {
      introTextarea.value = '本项目旨在构建一体化的研发费用管理平台，实现项目全生命周期管理，覆盖人员人工、直接投入、折旧费用、无形资产摊销等模块。项目采用敏捷开发模式，预期提升团队协同效率40%以上，降低项目交付风险，为企业数字化转型提供支撑。';
    }
  }

  document.addEventListener('click', function(e) {
    var aiBtn = e.target.closest && e.target.closest('.ai-generate-link');
    if (!aiBtn) return;
    e.preventDefault();
    e.stopPropagation();
    showAIGenerating(aiBtn);
    setTimeout(function() {
      showAIComplete(aiBtn);
    }, 1800);
  }, true);



  function openResourceModal(type, count) {
    const data = {
      '人员': [['YG001','和美','研发工程师','研发中心'], ['YG002','李四','研发工程师','研发中心'], ['YG003','王雁','项目负责人','研发中心']],
      '无形资产': [['WX001','研发软件著作权','2025-11-10','60,000.00']],
      '固定资产': [['GD001','研发服务器','2025-10-01','120,000.00']],
      '租赁资产': [['ZL001','研发办公场地','2025-11-01','8,000.00']],
    }[type] || [];
    const rows = data.slice(0, Number(count) || data.length);
    const body = `<div class="resource-title">${type}资源明细（${count}）</div><table class="resource-table"><thead><tr><th>编号</th><th>名称</th><th>类型/岗位</th><th>金额/部门</th></tr></thead><tbody>${rows.length ? rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('') : '<tr><td colspan="4" class="empty">暂无数据</td></tr>'}</tbody></table>`;
    modal(`${type}资源`, body, '<button class="primary-btn modal-close-action">关 闭</button>');
  }

  function openGlobalSearch() {
    modal('全局搜索', `<div class="global-search"><input autofocus placeholder="搜索菜单、项目、人员、费用单据"><div class="search-result"><button data-jump="项目立项">项目立项 / XM001 学富网</button><button data-jump="人员人工费用">人员人工费用 / 和美</button><button data-jump="直接投入费用">直接投入费用 / 电脑设备</button></div></div>`, '<button class="ghost-btn modal-close-action">关 闭</button>');
    document.querySelectorAll('[data-jump]').forEach(btn => btn.addEventListener('click', () => {
      closeModal();
      document.querySelector(`[data-page="${btn.dataset.jump}"]`)?.click();
      toast(`已跳转到${btn.dataset.jump}`);
    }));
  }

  function bindTopbar() {
    document.querySelector('.icon-btn[aria-label="折叠菜单"]')?.addEventListener('click', () => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
      document.body.classList.toggle('sidebar-collapsed', state.sidebarCollapsed);
    });
    document.querySelector('.collapse')?.addEventListener('click', () => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
      document.body.classList.toggle('sidebar-collapsed', state.sidebarCollapsed);
    });
    document.querySelector('.icon-btn[aria-label="刷新"]')?.addEventListener('click', () => { toast('当前页面已刷新'); enhanceCurrentPage(); });
    document.querySelector('.search')?.addEventListener('click', openGlobalSearch);
    document.addEventListener('keydown', e => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openGlobalSearch(); } });
    document.querySelector('.theme-btn')?.addEventListener('click', () => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      document.body.classList.toggle('dark-mode', state.theme === 'dark');
      document.querySelector('.theme-btn').textContent = state.theme === 'dark' ? 'light' : 'dark';
      toast(`已切换${state.theme === 'dark' ? '深色' : '浅色'}主题`);
    });
    document.querySelector('.icon-btn[aria-label="全屏"]')?.addEventListener('click', () => toast('已进入全屏演示状态'));
    document.querySelector('.icon-btn[aria-label="通知"]')?.addEventListener('click', () => modal('通知中心', '<div class="notice-list"><p><b>风险预警</b><span>2 条待处理风险</span></p><p><b>导入任务</b><span>项目立项导入成功</span></p><p><b>系统消息</b><span>研发费用数据已更新</span></p></div>', '<button class="primary-btn modal-close-action">知道了</button>'));
    document.querySelector('.company-select')?.addEventListener('click', () => modal('切换公司', '<div class="select-list"><button>华润万家有限公司</button><button>华润万家便利超市（深圳）有限公司</button><button>示例科技有限公司</button></div>', '<button class="ghost-btn modal-close-action">取 消</button>'));
    document.querySelector('.user-btn')?.addEventListener('click', () => modal('用户菜单', '<div class="select-list"><button>个人中心</button><button>修改密码</button><button>退出登录</button></div>', '<button class="ghost-btn modal-close-action">关 闭</button>'));
  }

  function normalizeProjectFilters(card) {
    if (getActivePage() !== '\u9879\u76ee\u7acb\u9879' || card.dataset.projectNormalized) return;
    card.dataset.projectNormalized = '1';
    const boxes = Array.from(card.querySelectorAll('.input-like'));
    const typeBox = boxes[2];
    const statusBox = boxes[3];
    const startBox = boxes[4];
    const endBox = boxes[5];
    if (typeBox) typeBox.innerHTML = '<input placeholder="\u8bf7\u9009\u62e9\u9879\u76ee\u7c7b\u578b"><em>\u2304</em>';
    if (statusBox) statusBox.innerHTML = '<input placeholder="\u8bf7\u9009\u62e9\u9879\u76ee\u72b6\u6001"><em>\u2304</em>';
    [startBox, endBox].forEach(box => {
      if (!box) return;
      box.classList.add('range-like');
      box.innerHTML = '<input placeholder="\u5f00\u59cb\u65e5\u671f"><b></b><input placeholder="\u7ed3\u675f\u65f6\u95f4">';
    });
  }
  function enhanceFilters() {
    const card = document.querySelector('.filter-card');
    if (!card || card.dataset.enhanced) return;
    card.dataset.enhanced = '1';
    normalizeProjectFilters(card);
    card.querySelectorAll('.input-like').forEach((box, index) => {
      const raw = box.textContent.trim().replace('⌄','');
      const input = document.createElement('input');
      input.placeholder = raw || '请输入';
      input.dataset.filterIndex = String(index);
      box.textContent = '';
      box.appendChild(input);
      if (raw.startsWith('请选择')) {
        const arrow = document.createElement('em');
        arrow.textContent = '⌄';
        box.appendChild(arrow);
      }
    });
    const [resetBtn, searchBtn, collapseBtn] = card.querySelectorAll('.filter-actions button');
    resetBtn?.addEventListener('click', () => { card.querySelectorAll('input').forEach(input => input.value = ''); markRows(''); toast('筛选条件已重置'); });
    searchBtn?.addEventListener('click', () => {
      const keyword = Array.from(card.querySelectorAll('input')).map(i => i.value.trim()).filter(Boolean).join(' ');
      markRows(keyword);
      toast(keyword ? `已按「${keyword}」筛选` : '已执行查询');
    });
    collapseBtn?.addEventListener('click', () => {
      state.filtersCollapsed = !state.filtersCollapsed;
      card.classList.toggle('collapsed', state.filtersCollapsed);
      collapseBtn.textContent = state.filtersCollapsed ? '展开' : '收起';
    });
  }

  function markRows(keyword) {
    const rows = document.querySelectorAll('tbody tr');
    let visible = 0;
    rows.forEach(row => {
      const hit = !keyword || row.innerText.includes(keyword);
      row.style.display = hit ? '' : 'none';
      if (hit) visible += 1;
    });
    const pager = document.querySelector('.pager span');
    if (pager) pager.textContent = `共 ${visible} 条记录`;
  }

  function updateBatchState() {
    const batch = Array.from(document.querySelectorAll('.table-actions button')).find(btn => btn.textContent.trim().includes('批量删除'));
    if (batch) batch.disabled = state.selectedRows.size === 0;
  }

  function addHeaderCheckbox(table) {
    const headCell = table.querySelector('thead .check-col');
    if (!headCell || headCell.querySelector('.checkbox')) return;
    headCell.innerHTML = '<span class="checkbox header-checkbox"></span>';
    headCell.querySelector('.checkbox').addEventListener('click', () => {
      const checked = !headCell.querySelector('.checkbox').classList.contains('checked');
      state.selectedRows.clear();
      document.querySelectorAll('tbody .checkbox').forEach((box, index) => {
        box.classList.toggle('checked', checked);
        if (checked) state.selectedRows.add(index);
      });
      headCell.querySelector('.checkbox').classList.toggle('checked', checked);
      updateBatchState();
    });
    updateBatchState();
  }

  function addTableTools() {
    const head = document.querySelector('.table-head');
    if (!head || head.querySelector('.table-tools')) return;
    head.insertAdjacentHTML('beforeend', '<div class="table-tools"><button title="刷新"></button><button title="密度"></button><button title="列设置"></button><button title="全屏"></button></div>');
    head.querySelectorAll('.table-tools button').forEach(btn => btn.addEventListener('click', () => toast(`${btn.title || '表格工具'}已触发`)));
  }

  function enhanceProjectResourceCells(page) {
    if (page !== '项目立项') return;
    document.querySelectorAll('tbody tr').forEach(row => {
      const cell = row.children[4];
      if (!cell || cell.dataset.resourceEnhanced) return;
      cell.dataset.resourceEnhanced = '1';
      const text = cell.innerText;
      cell.innerHTML = text.split(/\n|\s+/).filter(Boolean).map(part => {
        const match = part.match(/^(.+?)\((\d+)\)$/);
        if (!match) return part;
        return `<button class="resource-link" data-resource-type="${match[1]}" data-resource-count="${match[2]}">${match[1]}(${match[2]})</button>`;
      }).join('');
    });
    document.querySelectorAll('.resource-link').forEach(btn => {
      if (btn.dataset.bound) return;
      btn.dataset.bound = '1';
      btn.addEventListener('click', () => openResourceModal(btn.dataset.resourceType, btn.dataset.resourceCount));
    });
  }

  function enhanceTable() {
    const table = document.querySelector('table');
    if (!table || table.dataset.enhanced) return;
    table.dataset.enhanced = '1';
    const page = getActivePage();
    addHeaderCheckbox(table);
    addTableTools();
    enhanceProjectResourceCells(page);
    document.querySelectorAll('tbody .checkbox').forEach((box, index) => {
      box.addEventListener('click', () => {
        box.classList.toggle('checked');
        box.classList.contains('checked') ? state.selectedRows.add(index) : state.selectedRows.delete(index);
        updateBatchState();
      });
    });
    document.querySelectorAll('.table-actions button').forEach(btn => {
      if (btn.hasAttribute('onclick')) return;
      const text = btn.textContent.trim();
      if (text.includes('新增')) btn.addEventListener('click', () => openForm('新增', page));
      else if (text.includes('导入') || text.includes('上传')) btn.addEventListener('click', () => openImport(page));
      else if (text.includes('导出') || text.includes('下载')) btn.addEventListener('click', () => openExport(page));
      else if (text.includes('删除')) btn.addEventListener('click', () => { if (!btn.disabled) openConfirm('批量删除', page); });
      else if (text.includes('生成') || text.includes('更新') || text.includes('扫描') || text.includes('刷新')) btn.addEventListener('click', () => toast(`${text}已完成`));
    });
    document.querySelectorAll('tbody td:last-child').forEach(td => {
      const actions = td.textContent.trim();
      if (!actions || actions === '　' || td.querySelector('button')) return;
      td.classList.add('row-actions');
      td.innerHTML = actions.split(/\s+/).filter(Boolean).map(action => `<button data-row-action="${action}">${action}</button>`).join('');
    });
    document.querySelectorAll('[data-row-action]').forEach(btn => {
      if (btn.dataset.bound) return;
      btn.dataset.bound = '1';
      btn.addEventListener('click', () => {
        const action = btn.dataset.rowAction;
        if (action.includes('删除') || action.includes('驳回')) openConfirm(action, page);
        else if (action.includes('下载')) toast('文件下载已开始');
        else if (action.includes('通过')) toast('审核已通过');
        else openForm(action, page);
      });
    });
    enhancePager();
    updateBatchState();
  }

  function enhancePager() {
    const pager = document.querySelector('.pager');
    if (!pager || pager.dataset.enhanced) return;
    pager.dataset.enhanced = '1';
    const total = document.querySelectorAll('tbody tr').length;
    pager.innerHTML = `<span>共 ${total} 条记录</span><button title="首页"></button><button title="上一页"></button><button title="上一页"></button><button class="active">1</button><button title="下一页"></button><button title="下一页"></button><button title="末页"></button><select><option selected>20条/页</option><option>10条/页</option><option>50条/页</option></select>`;
    pager.querySelectorAll('button,select').forEach(el => el.addEventListener('click', () => toast('分页状态已更新')));
  }

  function patchEmptyTables() {
    const page = getActivePage();
    const rows = sampleRows[page];
    const empty = document.querySelector('td.empty');
    if (!rows || !empty) return;
    const columns = Array.from(document.querySelectorAll('thead th')).slice(1).map(th => th.textContent.trim());
    const tbody = empty.closest('tbody');
    tbody.innerHTML = rows.map(row => `<tr><td class="check-col"><span class="checkbox"></span></td>${columns.map((_, i) => `<td>${row[i] ?? ''}</td>`).join('')}</tr>`).join('');
  }

  function enhanceTabs() {
    const row = document.querySelector('.tabs-row');
    if (!row) return;
    row.querySelectorAll('.tab').forEach(tab => {
      if (tab.textContent.trim() === '首页' || tab.querySelector('.tab-close')) return;
      const close = document.createElement('span');
      close.className = 'tab-close';
      close.textContent = '×';
      close.addEventListener('click', e => { e.stopPropagation(); tab.remove(); toast('标签页已关闭'); });
      tab.appendChild(close);
    });
    row.querySelector('.tab-more')?.addEventListener('click', () => modal('标签页操作', '<div class="select-list"><button>关闭其他</button><button>关闭左侧</button><button>刷新当前</button></div>', '<button class="ghost-btn modal-close-action">关 闭</button>'));
  }

  function addChartTips() {
    document.querySelectorAll('.chart-card').forEach(card => {
      if (card.dataset.enhanced) return;
      card.dataset.enhanced = '1';
      card.addEventListener('mousemove', e => {
        let tip = card.querySelector('.chart-tip');
        if (!tip) {
          tip = document.createElement('div');
          tip.className = 'chart-tip';
          card.appendChild(tip);
        }
        tip.textContent = card.querySelector('h2')?.textContent + '：5.15 万元';
        tip.style.left = `${e.offsetX + 12}px`;
        tip.style.top = `${e.offsetY + 12}px`;
      });
      card.addEventListener('mouseleave', () => card.querySelector('.chart-tip')?.remove());
    });
  }

  function enhanceCurrentPage() {
    setTimeout(() => {
      state.selectedRows.clear();
      patchEmptyTables();
      enhanceFilters();
      enhanceTable();
      enhanceTabs();
      addChartTips();
      const title = document.querySelector('.table-head h1, .detail-card h1, .dashboard-head h1')?.textContent || '页面';
      document.title = `${title} - 研发费用管理系统 Demo`;
    }, 30);
  }

  function observeContent() {
    const content = document.querySelector('.content');
    if (!content) return;
    new MutationObserver(enhanceCurrentPage).observe(content, { childList: true, subtree: true });
    const tabs = document.querySelector('.tabs-row');
    if (tabs) new MutationObserver(enhanceTabs).observe(tabs, { childList: true, subtree: true });
  }

  document.addEventListener('DOMContentLoaded', () => {
    bindTopbar();
    observeContent();
    enhanceCurrentPage();
    toast('项目立项 1:1 标杆页增强已加载');
  });

  // 挂载关键函数到全局，供 app.js 中的 inline onclick 使用
  window.openForm = openForm;
  window.openProjectForm = openProjectForm;
  window.openImport = openImport;
  window.openExport = openExport;
  window.openConfirm = openConfirm;
  window.openResourceModal = openResourceModal;
})();

  