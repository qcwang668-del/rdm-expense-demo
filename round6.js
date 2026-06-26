(function () {
  const days = Array.from({ length: 31 }, (_, i) => `${i + 1}日`);
  const pageData = {};
  const empty = [];

  pageData['无形资产'] = table('无形资产列表', ['资产编号', '资产名称', '资产产研性质'], ['新增无形资产', '导出', '导入', '批量删除'], ['资产编号', '资产名称', '资产类型', '资产产研性质', '资产来源', '资产原值', '参与研发活动最高比例', '归属项目类型', '参与项目', '操作'], [['002', '算法专利', '软件', '生产研发共用', '资本化研发项目形成', '1,000.00元', '100%', '研发公共类', '1', '详情 修改 删除']]);
  pageData['固定资产'] = table('固定资产列表', ['资产名称', '资产编号', '资产类型', '资产产研性质'], ['新增固定资产', '导出', '导入', '批量删除'], ['资产名称', '资产编号', '资产类型', '资产产研性质', '规格型号', '资产原值', '资产每天运行时长', '参与研发活动最高比例', '归属项目类型', '参与项目', '操作'], [['建模设备', '001', '设备', '生产研发共用', '008', '10,000.00元', '24h', '50%', '研发公共类', '2', '详情 修改 删除']]);
  pageData['经营租赁资产'] = table('经营租赁资产列表', ['资产编号', '资产名称', '资产类型', '资产产研性质'], ['新增', '导出', '导入', '批量删除'], ['资产编号', '资产名称', '资产类型', '资产产研性质', '规格型号', '功率(kW)', '资产每天运行时长(h)', '参与研发活动最高比例(%)', '归属项目类型', '参与项目', '操作'], [['002', '测试租赁资产', '仪器', '生产研发共用', '001', '100kW', '24h', '80%', '研发公共类', '1', '详情 修改 删除']]);
  pageData['会计科目对照表'] = table('会计科目对照表', ['费用类型', '会计科目'], ['新增', '导出', '导入', '批量删除'], ['费用类型', '一级科目', '二级科目', '三级科目', '启用状态', '创建人', '操作'], [['人员人工费用', '研发支出', '费用化支出', '工资', '启用', '王雁', '修改 删除']]);

  pageData['项目结项'] = table('项目结项列表', ['项目编号', '项目名称'], ['新增', '导出', '批量删除'], ['项目名称', '项目编号', '结项日期', '创建人', '结项说明', '操作'], empty);
  pageData['项目暂停'] = table('项目暂停列表', ['项目编号', '项目名称'], ['新增', '导出', '批量删除'], ['项目名称', '项目编号', '暂停日期', '预计恢复日期', '创建人', '暂停说明', '操作'], empty);
  pageData['项目终止'] = table('项目终止列表', ['项目编号', '项目名称'], ['新增', '导出', '批量删除'], ['项目名称', '项目编号', '终止日期', '创建人', '终止说明', '操作'], empty);
  pageData['文件模版'] = table('文件模版列表', ['模版名称', '文件类型'], ['新增', '导出', '批量删除'], ['模版名称', '文件类型', '适用项目类型', '上传时间', '创建人', '操作'], [['项目立项计划书', 'word', '通用', '2026-03-23 17:57:42', '王雁', '下载 修改 删除']]);

  pageData['无形资产工时表'] = hours('无形资产工时列表', ['年月', '资产编号', '资产名称', '资产产研性质', '项目名称', '项目编号'], ['资产编号', '资产名称', '资产产研性质', '项目名称', '项目编号'], empty, '以上为系统根据录入的资产参与研发项目的信息生成的研发工时，仅供参考，可点击编辑按钮或导入模板进行修改');
  pageData['固定资产工时表'] = hours('固定资产工时列表', ['年月', '资产编号', '资产名称', '资产产研性质', '项目名称', '项目编号'], ['资产编号', '资产名称', '资产产研性质', '项目名称', '项目编号'], [['001', '建模设备', '生产研发共用', '学富网', 'XM001'].concat(Array(31).fill('8')).concat(['248', '修改'])]);
  pageData['经营租赁资产工时表'] = hours('经营租赁资产工时列表', ['年月', '资产编号', '资产名称', '项目名称', '项目编号'], ['资产编号', '资产名称', '资产产研性质', '项目名称', '项目编号'], [['002', '测试租赁资产', '生产研发共用', '力企云', 'XM002'].concat(Array(31).fill('6')).concat(['186', '修改'])]);

  pageData['无形资产费用'] = table('无形资产费用列表', ['费用月份', '无形资产编号', '无形资产名称'], ['新增', '导出', '导入', '批量删除'], ['费用月份', '无形资产名称', '无形资产编号', '无形资产类型', '无形资产摊销入账金额(元)', '备注', '创建人', '操作'], [['2026-03', '算法专利', '002', '软件', '1,000.00', '　', '王雁', '修改 删除']]);
  pageData['新产品设计费'] = fee('新产品设计费列表', '设计费用类别');
  pageData['装备调试费用'] = fee('装备调试费用列表', '装备调试费用类别');
  pageData['委托研发费用'] = fee('委托研发费用列表', '委托研发类别');
  pageData['其他相关费用'] = fee('其他相关费用列表', '费用类别');
  pageData['应冲减研发费用'] = adjust('应冲减研发费用列表', '冲减类别');
  pageData['审计调整研发费用'] = adjust('审计调整研发费用列表', '调整类别');
  pageData['会计凭证导入'] = table('会计凭证导入列表', ['凭证月份', '凭证字号', '会计科目'], ['导入', '导出', '下载模板', '批量删除'], ['凭证月份', '凭证字号', '摘要', '会计科目', '借方金额(元)', '贷方金额(元)', '导入人', '操作'], empty);

  pageData['物料报废'] = table('物料报废列表', ['物料类型', '物料名称', '物料编号'], ['新增', '导出', '导入', '批量删除'], ['物料类型', '物料名称', '物料编号', '数量单位', '申请报废数量', '申请报废日期', '预计报废日期', '预计报废方式', '报废产生收入(元)', '报废处置人员', '创建人', '操作'], empty);
  pageData['物料盘点'] = table('物料盘点列表', ['盘点日期', '物料编号', '物料名称'], ['新增', '导出', '导入', '批量删除'], ['盘点单号', '盘点日期', '物料编号', '物料名称', '账面数量', '盘点数量', '差异数量', '盘点人', '操作'], empty);

  pageData['加计扣除留存备查资料'] = { special: 'retained' };
  pageData['高新技术企业相关报表'] = table('高新技术企业相关报表列表', ['年份'], ['一键生成', '刷 新'], ['序号', '年份', '生成状态', '生成时间', '操作'], [['1', '2026', '已生成', '2026-03-23 17:57:42', '详情 下载']]);
  pageData['补充数据录入'] = table('补充数据录入列表', ['年份', '数据类型'], ['新增', '导出', '批量删除'], ['年份', '数据类型', '数据项', '数值', '单位', '创建人', '操作'], [['2026', '财务数据', '营业收入', '0.00', '元', '王雁', '修改 删除']]);
  pageData['风险扫描预警'] = { special: 'risk' };

  function table(title, filters, actions, columns, rows) { return { title, filters, actions, columns, rows }; }
  function hours(title, filters, leading, rows, note) { const cfg = table(title, filters, ['一键更新工时数据', '导出', '导入', '下载模板'], leading.concat(days, ['工时合计(h)', '操作']), rows); cfg.note = note; return cfg; }
  function fee(title, typeLabel) { return table(title, ['费用月份', '项目编号', '项目名称', typeLabel], ['新增', '导出', '导入', '批量删除'], ['费用月份', '项目编号', '项目名称', typeLabel, '金额(元)', '备注', '创建人', '操作'], empty); }
  function adjust(title, typeLabel) { return table(title, ['费用月份', '项目编号', '项目名称', typeLabel], ['新增', '导出', '导入', '批量删除'], ['费用月份', '项目编号', '项目名称', typeLabel, '费用类型', '金额(元)', '备注', '创建人', '操作'], empty); }
  function currentPage() { return document.querySelector('.tab.active')?.dataset.page || document.querySelector('.sub-link.selected')?.dataset.page || ''; }
  function inputFor(label) {
    if (/日期|月份|年月/.test(label)) return `<div class="input-like range-like"><input placeholder="${label}"><b></b><input placeholder="结束时间"></div>`;
    if (/类型|性质|类别|状态|项目名称/.test(label)) return `<div class="input-like"><input placeholder="请选择${label}"><em>⌄</em></div>`;
    return `<div class="input-like"><input placeholder="${label}"></div>`;
  }
  function rowAction(value) { return String(value || '').split(/\s+/).filter(Boolean).map(text => `<button data-row-action="${text}">${text}</button>`).join(''); }
  function renderTable(cfg) {
    const rows = cfg.rows.length ? cfg.rows.map(row => `<tr><td class="check-col"><span class="checkbox"></span></td>${row.map((cell, index) => `<td class="${index === row.length - 1 ? 'row-actions' : ''}">${index === row.length - 1 ? rowAction(cell) : cell}</td>`).join('')}</tr>`).join('') : `<tr><td class="empty-cell" colspan="${cfg.columns.length + 1}">暂无数据</td></tr>`;
    return `<section class="filter-card"><div class="filter-grid">${cfg.filters.map(item => `<label class="form-item"><span>${item}</span>${inputFor(item)}</label>`).join('')}</div><div class="filter-actions"><button class="ghost-btn">重 置</button><button class="primary-btn">搜 索</button><button class="link-btn">收起</button></div></section><section class="table-card"><div class="table-head"><h1>${cfg.title}</h1><div class="table-actions">${cfg.actions.map((name, index) => `<button class="${index ? 'ghost-btn' : 'primary-btn'}" ${name.includes('批量') ? 'disabled' : ''}>${name}</button>`).join('')}</div><div class="table-tools"><button title="刷新"></button><button title="密度"></button><button title="列设置"></button><button title="全屏"></button></div></div><div class="table-scroll"><table data-enhanced="1"><thead><tr><th class="check-col"><span class="checkbox header-checkbox"></span></th>${cfg.columns.map(name => `<th>${name}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table></div>${cfg.note ? `<div class="table-note">${cfg.note}</div>` : ''}<div class="pager"><span>共 ${cfg.rows.length} 条记录</span><button></button><button></button><button></button><button class="active">1</button><button></button><button></button><button></button><select><option selected>20条/页</option><option>10条/页</option><option>50条/页</option></select></div></section>`;
  }
  function renderRetained() {
    const years = ['2023', '2024', '2010', '2011', '2020', '2021', '2025', '2026'];
    const rows = years.map((year, index) => [String(index + 1), `${year}年备查资料`, '已完成', index < 2 ? '2026-03-23 17:57:42' : '2026-03-23 17:52:06', '详情 下载']);
    const list = table('加计扣除留存备查资料', ['年份'], ['一键生成', '刷 新'], ['序号', '年份', '生成状态', '生成时间', '操作'], rows);
    return `<section class="filter-card retained-filter"><label class="form-item"><span>年份</span><div class="input-like"><input value="2026"></div></label><div class="filter-actions"><button class="primary-btn">一键生成</button><button class="ghost-btn">刷 新</button></div></section><div class="warning-box">请确认项目管理模块上传的项目计划书中的立项开始日期和结束日期是否与项目的实际日期一致；<br>项目计划书中的参与研发人员名单、研发费用预算和实际参与项目的人员名单、实际发生费用的偏差是否超过20%。如果偏差超过20%，建议修改项目计划书后再上传。</div>${renderTable(list).replace(/<section class="filter-card">[\s\S]*?<\/section>/, '')}`;
  }
  function renderRisk() {
    const risks = ['批发和零售业被判定为以负面清单行业为主营业务，不适用研发费用加计扣除优惠政策', '研发活动直接消耗材料、燃料和动力费用占全部加计扣除金额比例过高，请确认风险', '当期研发支出费用占营业收入比例偏高，请确认风险', '当期的无形资产总摊销费用高于录入的全部无形资产摊销额，请确认风险', '当期的固定资产总折旧费用高于录入的全部固定资产折旧额，请确认风险', '当期申报享受研发费用加计优惠金额超过净资产，请确认风险'];
    return `<section class="filter-card retained-filter"><label class="form-item"><span>年份</span><div class="input-like"><input value="2026"></div></label><div class="filter-actions"><button class="primary-btn">一键扫描风险</button></div></section><section class="table-card risk-card"><div class="table-head"><h1>扫描结果</h1></div><div class="risk-list">${risks.map(text => `<div class="risk-item"><span></span><p>${text}</p></div>`).join('')}</div></section>`;
  }
  function render(cfg) { return cfg.special === 'retained' ? renderRetained() : cfg.special === 'risk' ? renderRisk() : renderTable(cfg); }
  function applyRound6() {
    const name = currentPage();
    const cfg = pageData[name];
    const content = document.querySelector('.content');
    if (!cfg || !content || content.dataset.round6Page === name) return;
    content.dataset.round6Page = name;
    content.innerHTML = render(cfg);
  }
  document.addEventListener('click', () => setTimeout(applyRound6, 120), true);
  new MutationObserver(applyRound6).observe(document.body, { childList: true, subtree: true });
  setTimeout(applyRound6, 300);
})();

