const menuGroups = [
  { title: '首页', items: ['首页'] },
  { title: '工作台', items: ['我的导入导出', 'AI数据采集'] },
  { title: '公司档案', items: ['基本信息', '人员档案', '无形资产', '固定资产', '经营租赁资产', '会计科目对照表'] },
  { title: '项目管理', items: ['项目立项', '项目结项', '项目暂停', '项目终止', '文件模版'] },
  { title: '研发过程管理', items: ['人员考勤表', '人员工时表', '无形资产工时表', '固定资产工时表', '经营租赁资产工时表'] },
  { title: '研发费用管理', items: ['人员人工费用', '直接投入费用', '折旧费用', '无形资产费用', '新产品设计费', '装备调试费用', '委托研发费用', '其他相关费用', '应冲减研发费用', '审计调整研发费用', '会计凭证导入'] },
  { title: '样品管理', items: ['领料申请', '物料档案', '样品及其他入库', '样品及其他出库', '物料报废', '物料盘点'] },
  { title: '半成品管理', items: ['半成品入库', '半成品领用', '半成品退库', '半成品报废', '半成品费用化', '半成品台账'] },
  { title: '知识产权管理', items: ['专利信息库', '专利查重查新', '专利匹配推荐', '情报分析'] },
  { title: '研发支配管理', items: ['支出分配汇总', '支出分配台账'] },
  { title: '报表生成查询', items: ['加计扣除留存备查资料', '加计扣除相关报表', '高新技术企业相关报表', '补充数据录入'] },
  { title: '风险扫描预警', items: ['风险扫描预警'] },
  { title: '系统管理', items: ['租户列表', '租户套餐', '租户审核', '机构用户', '角色管理', '部门管理', '岗位管理', '套餐配置'] },
];

const projectRows = [
  ['XM001', '学富网', '费用化研发项目', '人员(3)<br>无形资产(0)<br>固定资产(1)<br>租赁资产(0)', '2025-11-20', '2027-01-31', '进行中', '', '', '1', '+添加', '详情  修改  删除'],
  ['XM002', '力企云', '资本化研发项目', '人员(2)<br>无形资产(1)<br>固定资产(1)<br>租赁资产(1)', '2025-11-01', '2027-01-31', '进行中', '', '', '2', '+添加', '详情  修改  删除'],
];

const directRows = [
  ['2025-08','XM001','学富网','研发专用材料投入','和美','2026-03-01','001','3333','电脑设备','dsd','台','10','500.00','5,000.00','　','王雁','修改  删除'],
  ['2026-03','XM002','力企云','研发专用材料投入','李四','2026-03-03','002','00000','钢笔','dsafa','件','1000','30.00','30,000.00','　','王雁','修改  删除'],
];

const sampleRows = [
  ['001','2026-03-01','XM001','学富网','','和美','3333','电脑设备','研发专用材料投入','王雁'],
  ['002','2026-03-03','XM002','力企云','','李四','00000','钢笔','研发专用材料投入','王雁'],
];

const allocRows = [
  ['2025-11','学富网','XM001','费用化研发项目','3,966.34','641.28','63.94','32.58','32.58','32.58','2,814.08','0.00'],
  ['2025-11','力企云','XM002','资本化研发项目','4,620.32','1,022.13','101.92','51.93','51.93','51.93','1,267.54','0.00'],
  ['2025-12','学富网','XM001','费用化研发项目','0.00','0.00','0.00','0.00','0.00','0.00','0.00','0.00'],
  ['2025-12','力企云','XM002','资本化研发项目','0.00','0.00','0.00','0.00','0.00','0.00','0.00','0.00'],
  ['2026-01','学富网','XM001','费用化研发项目','0.00','0.00','0.00','0.00','0.00','0.00','0.00','0.00'],
  ['2026-01','力企云','XM002','资本化研发项目','0.00','0.00','0.00','0.00','0.00','0.00','0.00','0.00'],
];

const employeeRows = [
  ['YG001','和美','10,500.00','1,300.00','350.00','180.00','420.00','80.00','XM001','学富网'],
  ['YG002','李四','12,200.00','1,450.00','410.00','210.00','490.00','95.00','XM002','力企云'],
  ['YG003','王雁','13,800.00','1,600.00','460.00','240.00','520.00','110.00','XM001','学富网'],
];

const assetsRows = [
  ['ZC001','服务器设备','固定资产','2025-10-01','120,000.00','36个月','3,333.33','王雁'],
  ['WX001','研发软件著作权','无形资产','2025-11-10','60,000.00','24个月','2,500.00','王雁'],
];

const reportRows = [
  ['2026','研发费用加计扣除辅助账汇总表','已生成','2026-06-22 15:37:42','下载  预览'],
  ['2026','高新技术企业研发费用结构明细表','已生成','2026-06-22 15:37:42','下载  预览'],
];

const pageConfigs = {
  '基本信息': { type: 'detail', group: '公司档案' },
  '人员档案': { title: '研发人员信息列表', filters: ['员工工号','员工姓名','所属部门'], actions: ['新增','导出','导入','批量删除'], columns: ['员工工号','员工姓名','岗位','部门','入职日期','人员类型','创建人','操作'], rows: employeeRows.map(r=>[r[0],r[1],'研发工程师','研发中心','2025-10-01','研发人员','王雁','详情  修改  删除']), group: '公司档案' },
  '无形资产': { title: '无形资产列表', filters: ['资产编号','资产名称'], actions: ['新增','导出','导入','批量删除'], columns: ['资产编号','资产名称','资产类型','开始使用日期','原值(元)','摊销期限','月摊销额(元)','创建人','操作'], rows: assetsRows.map(r=>[r[0],r[1],r[2],r[3],r[4],r[5],r[6],r[7],'修改  删除']), group: '公司档案' },
  '固定资产': { title: '固定资产列表', filters: ['资产编号','资产名称'], actions: ['新增','导出','导入','批量删除'], columns: ['资产编号','资产名称','规格型号','购入日期','资产原值(元)','折旧年限','月折旧额(元)','创建人','操作'], rows: [['GD001','研发服务器','PowerEdge','2025-10-01','120,000.00','36个月','3,333.33','王雁','修改  删除']], group: '公司档案' },
  '经营租赁资产': { title: '经营租赁资产列表', filters: ['资产编号','资产名称'], actions: ['新增','导出','导入','批量删除'], columns: ['资产编号','资产名称','租赁开始日期','租赁结束日期','月租金(元)','项目编号','项目名称','操作'], rows: [['ZL001','研发办公场地','2025-11-01','2027-01-31','8,000.00','XM002','力企云','修改  删除']], group: '公司档案' },
  '会计科目对照表': { title: '会计科目对照列表', filters: ['科目编码','科目名称'], actions: ['新增','导出','导入'], columns: ['科目编码','科目名称','研发费用类别','费用归集口径','创建人','操作'], rows: [['660201','研发支出-工资','人员人工费用','工资薪金','王雁','修改  删除'],['660203','研发支出-材料','直接投入费用','材料投入','王雁','修改  删除']], group: '公司档案' },
  '项目立项': { title: '项目立项列表', filters: ['项目名称','项目编号','项目类型','项目状态','项目开始日期','项目结束日期'], actions: ['新增','导出','导入','批量删除'], columns: ['项目编号','项目名称','项目类型','项目资源','开始日期','结束日期','项目状态','项目预算','项目计划','研发产出','过程文件','操作'], rows: projectRows, group: '项目管理' },
  '项目结项': { title: '项目结项列表', filters: ['项目名称','项目编号','项目状态'], actions: ['新增','导出','导入'], columns: ['项目编号','项目名称','项目类型','结项日期','项目状态','结项报告','操作'], rows: [['XM001','学富网','费用化研发项目','2027-01-31','进行中','','详情  修改'],['XM002','力企云','资本化研发项目','2027-01-31','进行中','','详情  修改']], group: '项目管理' },
  '项目暂停': { title: '项目暂停列表', filters: ['项目名称','项目编号'], actions: ['新增','导出'], columns: ['项目编号','项目名称','暂停日期','恢复日期','暂停原因','操作'], rows: [], group: '项目管理' },
  '项目终止': { title: '项目终止列表', filters: ['项目名称','项目编号'], actions: ['新增','导出'], columns: ['项目编号','项目名称','终止日期','终止原因','操作'], rows: [], group: '项目管理' },
  '文件模版': { title: '文件模版列表', filters: ['模版名称','模版类型'], actions: ['新增','导出','上传模板'], columns: ['模版名称','模版类型','适用环节','更新时间','操作'], rows: [['项目立项书','项目管理','立项','2026-06-22','下载  修改'],['研发过程记录','过程文件','过程管理','2026-06-22','下载  修改']], group: '项目管理' },
  '人员考勤表': { title: '员工考勤时长列表', filters: ['年月','员工工号','员工姓名'], actions: ['导出','导入','下载模板'], columns: ['员工工号','员工姓名',...Array.from({length:31},(_,i)=>`${i+1}日`),'工时合计(h)'], rows: [], group: '研发过程管理' },
  '人员工时表': { title: '人员工时列表', filters: ['费用月份','员工工号','员工姓名','项目编号'], actions: ['新增','导出','导入','批量删除'], columns: ['费用月份','员工工号','员工姓名','项目编号','项目名称','研发工时(h)','考勤工时(h)','研发占比','操作'], rows: [['2025-11','YG001','和美','XM001','学富网','120','176','68.18%','修改  删除'],['2025-11','YG002','李四','XM002','力企云','96','176','54.55%','修改  删除']], group: '研发过程管理' },
  '无形资产工时表': { title: '无形资产工时列表', filters: ['费用月份','资产编号','项目编号'], actions: ['新增','导出','导入'], columns: ['费用月份','资产编号','资产名称','项目编号','项目名称','使用工时','分配比例','操作'], rows: [['2025-11','WX001','研发软件著作权','XM002','力企云','80','45.45%','修改  删除']], group: '研发过程管理' },
  '固定资产工时表': { title: '固定资产工时列表', filters: ['费用月份','资产编号','项目编号'], actions: ['新增','导出','导入'], columns: ['费用月份','资产编号','资产名称','项目编号','项目名称','使用工时','分配比例','操作'], rows: [['2025-11','GD001','研发服务器','XM001','学富网','110','62.50%','修改  删除']], group: '研发过程管理' },
  '经营租赁资产工时表': { title: '经营租赁资产工时列表', filters: ['费用月份','资产编号','项目编号'], actions: ['新增','导出','导入'], columns: ['费用月份','资产编号','资产名称','项目编号','项目名称','使用工时','分配比例','操作'], rows: [['2025-11','ZL001','研发办公场地','XM002','力企云','176','100.00%','修改  删除']], group: '研发过程管理' },
  '人员人工费用': { title: '人员人工费用列表', filters: ['费用月份','员工工号','员工姓名','项目编号'], actions: ['新增','导出','导入','批量删除'], columns: ['员工工号','员工姓名','工资金额(元)','住房公积金(元)','养老保险(元)','失业保险(元)','医疗保险(元)','工伤保险(元)','项目编号','项目名称','操作'], rows: employeeRows.map(r=>[...r,'修改  删除']), group: '研发费用管理' },
  '直接投入费用': { title: '材料直接投入明细列表', tabs: ['材料直接投入明细表','其他直接投入明细表','经营租赁费用明细表'], filters: ['费用月份','项目编号','项目名称','材料直接投入类别'], actions: ['新增','导出','导入','批量删除'], columns: ['费用月份','项目编号','项目名称','材料投入类别','领料申请人','领料日期','领料编号','物料编号','物料名称','规格型号','数量单位','出库数量','出库单价(元)','出库总金额(元)','备注','创建人','操作'], rows: directRows, group: '研发费用管理' },
  '折旧费用': { title: '固定资产折旧费用列表', filters: ['费用月份','资产编号','项目编号'], actions: ['新增','导出','导入'], columns: ['费用月份','资产编号','资产名称','项目编号','项目名称','折旧金额(元)','创建人','操作'], rows: [['2025-11','GD001','研发服务器','XM001','学富网','2,083.33','王雁','修改  删除']], group: '研发费用管理' },
  '无形资产费用': { title: '无形资产摊销费用列表', filters: ['费用月份','资产编号','项目编号'], actions: ['新增','导出','导入'], columns: ['费用月份','资产编号','资产名称','项目编号','项目名称','摊销金额(元)','创建人','操作'], rows: [['2025-11','WX001','研发软件著作权','XM002','力企云','2,500.00','王雁','修改  删除']], group: '研发费用管理' },
  '新产品设计费': { title: '新产品设计费列表', filters: ['费用月份','项目编号','项目名称'], actions: ['新增','导出','导入'], columns: ['费用月份','项目编号','项目名称','费用名称','发生金额(元)','备注','操作'], rows: [], group: '研发费用管理' },
  '装备调试费用': { title: '装备调试费用列表', filters: ['费用月份','项目编号','项目名称'], actions: ['新增','导出','导入'], columns: ['费用月份','项目编号','项目名称','费用名称','发生金额(元)','备注','操作'], rows: [], group: '研发费用管理' },
  '委托研发费用': { title: '委托研发费用列表', filters: ['费用月份','项目编号','受托单位'], actions: ['新增','导出','导入'], columns: ['费用月份','项目编号','项目名称','受托单位','合同金额(元)','本期金额(元)','操作'], rows: [], group: '研发费用管理' },
  '其他相关费用': { title: '其他相关费用列表', filters: ['费用月份','项目编号','费用类型'], actions: ['新增','导出','导入'], columns: ['费用月份','项目编号','项目名称','费用类型','金额(元)','备注','操作'], rows: [], group: '研发费用管理' },
  '应冲减研发费用': { title: '应冲减研发费用列表', filters: ['费用月份','项目编号'], actions: ['新增','导出','导入'], columns: ['费用月份','项目编号','项目名称','冲减类型','冲减金额(元)','操作'], rows: [], group: '研发费用管理' },
  '审计调整研发费用': { title: '审计调整研发费用列表', filters: ['费用月份','项目编号'], actions: ['新增','导出','导入'], columns: ['费用月份','项目编号','项目名称','调整类型','调整金额(元)','操作'], rows: [], group: '研发费用管理' },
  '会计凭证导入': { title: '会计凭证导入列表', filters: ['凭证日期','凭证字号','科目名称'], actions: ['导入','导出','下载模板'], columns: ['凭证日期','凭证字号','科目编码','科目名称','摘要','借方金额','贷方金额','操作'], rows: [['2025-11-30','记-001','660201','研发支出-工资','研发人员工资','8,586.66','0.00','查看']], group: '研发费用管理' },
  '领料申请': { title: '领料申请列表', filters: ['领料日期','项目编号','项目名称','领料人'], actions: ['导出'], columns: ['领料编号','领料日期','项目编号','项目名称','关联领料清单','领料人','物料编号','物料名称','材料投入类别','创建人'], rows: sampleRows, group: '样品管理' },
  '物料档案': { title: '物料档案列表', filters: ['物料编号','物料名称'], actions: ['新增','导出','导入','批量删除'], columns: ['物料编号','物料名称','规格型号','数量单位','库存数量','单价(元)','创建人','操作'], rows: [['3333','电脑设备','dsd','台','10','500.00','王雁','修改  删除'],['00000','钢笔','dsafa','件','1000','30.00','王雁','修改  删除']], group: '样品管理' },
  '样品及其他入库': { title: '样品及其他入库列表', filters: ['入库日期','物料编号','物料名称'], actions: ['新增','导出','导入'], columns: ['入库单号','入库日期','物料编号','物料名称','入库数量','入库金额(元)','操作'], rows: [['RK001','2026-03-01','3333','电脑设备','10','5,000.00','修改  删除']], group: '样品管理' },
  '样品及其他出库': { title: '样品及其他出库列表', filters: ['出库日期','物料编号','物料名称'], actions: ['新增','导出','导入'], columns: ['出库单号','出库日期','物料编号','物料名称','出库数量','出库金额(元)','操作'], rows: [['CK001','2026-03-01','3333','电脑设备','10','5,000.00','修改  删除']], group: '样品管理' },
  '物料报废': { title: '物料报废列表', filters: ['报废日期','物料编号','物料名称'], actions: ['新增','导出'], columns: ['报废单号','报废日期','物料编号','物料名称','报废数量','报废原因','操作'], rows: [], group: '样品管理' },
  '物料盘点': { title: '物料盘点列表', filters: ['盘点日期','物料编号','物料名称'], actions: ['新增','导出'], columns: ['盘点单号','盘点日期','物料编号','物料名称','账面数量','盘点数量','差异数量','操作'], rows: [], group: '样品管理' },
  '半成品入库': { title: '半成品入库列表', tabs: ['入库列表','成本结构视图','状态流转看板'], filters: ['入库日期','项目编号','项目名称','物料编号'], actions: ['新增','导出','导入','生成凭证'], columns: ['入库单号','入库日期','项目编号','项目名称','物料编号','物料名称','规格型号','数量单位','入库数量','入库金额(元)','研发支出科目','经办人','状态','操作'], rows: [['BK001','2026-03-15','XM001','学富网','3333','电脑设备组件','dsd','套','5','38,500.00','研发支出-材料','王雁','已入库','详情  修改  删除']], group: '半成品管理' },
  '半成品领用': { title: '半成品领用列表', tabs: ['领用列表','领用去向追踪'], filters: ['领用日期','项目编号','项目名称','领用人'], actions: ['新增','导出','导入'], columns: ['领用单号','领用日期','项目编号','项目名称','物料编号','物料名称','领用数量','领用用途','领料人','预期去向','状态','操作'], rows: [['LY001','2026-03-20','XM001','学富网','3333','电脑设备组件','2','组装测试','和美','样机试制','已领用','详情  转样机  退库']], group: '半成品管理' },
  '半成品退库': { title: '半成品退库列表', filters: ['退库日期','项目编号','原领用单号'], actions: ['新增','导出','费用化结转'], columns: ['退库单号','退库日期','原领用单号','项目编号','项目名称','物料编号','物料名称','退库数量','折算金额(元)','费用化金额(元)','退库原因','操作'], rows: [['TK001','2026-04-05','LY001','XM001','学富网','3333','电脑设备组件','1','7,700.00','0.00','测试失败，组件可复用','修改  删除']], group: '半成品管理' },
  '半成品报废': { title: '半成品报废列表', filters: ['报废日期','项目编号','物料编号'], actions: ['新增','导出'], columns: ['报废单号','报废日期','项目编号','物料编号','物料名称','报废数量','报废金额(元)','报废原因','费用化金额(元)','操作'], rows: [['BF002','2026-04-10','XM001','3333','电脑设备组件','1','7,700.00','测试中不可逆损坏','7,700.00','修改  删除']], group: '半成品管理' },
  '半成品费用化': { title: '半成品费用化列表', filters: ['费用化日期','项目编号','来源单号'], actions: ['新增','导出','一键结转'], columns: ['费用化单号','费用化日期','项目编号','物料编号','物料名称','数量','费用化金额(元)','来源类型','目标科目','结转状态','操作'], rows: [['FYH001','2026-04-12','XM001','3333','电脑设备组件','1','7,700.00','报废','管理费用-研发费用','已结转','查看  撤销']], group: '半成品管理' },
  '半成品台账': { title: '半成品台账总表', tabs: ['汇总总表','入库明细','领用明细','退库明细','报废明细','费用化明细','期末结存'], filters: ['项目编号','项目名称','费用月份'], actions: ['一键生成台账','导出','打印'], columns: ['物料编号','物料名称','规格型号','期初数量','本期入库','本期领用','本期退库','本期报废','本期费用化','期末结存','期初金额(元)','本期入库金额(元)','本期减少金额(元)','期末金额(元)','操作'], rows: [['3333','电脑设备组件','dsd','0','5','2','1','1','1','2','0.00','38,500.00','23,100.00','15,400.00','查看明细']], group: '半成品管理' },
  '专利信息库': { title: '专利信息库列表', tabs: ['全部专利','已授权','申请中','已失效'], filters: ['专利编号','专利名称','专利类型','关联项目'], actions: ['新增','导出','导入','批量检索'], columns: ['专利编号','专利名称','专利类型','申请号','申请日期','授权日期','专利权人','发明人','关联项目','法律状态','操作'], rows: [['ZL001','一种基于ERP的研发费用自动归集方法','发明专利','CN202610012345.6','2026-01-15','2026-06-10','大亚金属有限公司','张工、王雁','XM001 学富网','已授权','详情  修改  删除'],['ZL002','半成品成本自动核算系统','发明专利','CN202610023456.7','2026-02-20','','大亚金属有限公司','李工','XM002 力企云','实质审查','详情  修改']], group: '知识产权管理' },
  '专利查重查新': { title: '专利查重查新列表', filters: ['查新日期','查新技术方向','风险等级'], actions: ['新建查新','批量查新','导出报告'], columns: ['查新单号','查新日期','查新技术方向','关键词','查新结果','相关专利数','新颖性判断','风险等级','建议措施','操作'], rows: [['CX001','2026-03-01','半成品成本核算方法','半成品、成本分摊、研发费用','存在部分相关专利','12','具备改进新颖性','中','建议限定技术范围后申报','详情  报告'],['CX002','2026-05-10','金属表面处理工艺','耐磨、涂层、热处理','无高度相关在先专利','3','新颖性较高','低','可安排专利申报','详情  报告']], group: '知识产权管理' },
  '专利匹配推荐': { title: '专利匹配推荐列表', filters: ['项目编号','项目名称','推荐专利类型'], actions: ['智能推荐','导出'], columns: ['推荐编号','项目编号','项目名称','推荐专利类型','推荐名称','匹配度(%)','技术关键词','推荐理由','操作'], rows: [['TJ001','XM001','学富网','发明专利','基于大数据的研发费用智能分摊方法','92%','研发费用、智能分摊、大数据','项目核心技术具有算法创新性，适合申报发明专利','采纳  忽略'],['TJ002','XM002','力企云','实用新型','一种研发物料自动追踪装置','78%','物料追踪、自动识别','项目涉及物料流转硬件改进，适合实用新型保护','采纳  忽略']], group: '知识产权管理' },
  '情报分析': { title: '技术情报分析列表', filters: ['分析日期','分析主题','技术领域'], actions: ['新建分析','导出报告','订阅更新'], columns: ['分析编号','分析日期','分析主题','技术领域','分析摘要','竞品动态','风险提示','操作'], rows: [['QB001','2026-06-15','耐磨金属材料技术趋势','新材料/金属材料','近3年全球专利申请增长32%，主要集中在涂层技术和复合材料方向，竞争者A公司2025年布局了12件相关专利','A公司已形成专利壁垒，B公司2026年初有新产品发布','建议差异化定位，聚焦稀土合金方向','详情  下载'],['QB002','2026-05-20','工业ERP研发管理软件专利地图','信息技术/ERP','国内ERP研发管理领域专利申请活跃，主要集中在费用自动归集和流程自动化两个方向，头部企业已形成较完整专利布局','SAP、Oracle在费用管理方向有大量基础专利','需关注开源技术专利风险，建议申请外围改进专利','详情  下载']], group: '知识产权管理' },
  '支出分配汇总': { title: '人工费用项目分配列表', tabs: ['研发费用加计扣除','高新技术企业认定','人工费用项目分配表','材料及其他投入费用汇总表','固定资产折旧费用项目分配表','无形资产摊销费用项目分配表','经营租赁资产费用项目分配表','新产品设计费等项目汇总表','其他相关费用汇总表','委托研发费用项目汇总表','应冲减研发费用汇总表','审计调整研发费用汇总表'], filters: ['项目编号','项目名称','费用月份'], actions: ['一键生成分配汇总数据','一键更新数据','导出'], columns: ['费用月份','项目名称','项目编号','项目类型','工资金额(元)','住房公积金(元)','基本养老保险金额(元)','失业保险金额(元)','基本医疗保险(含生育)金额(元)','工伤保险金额(元)','股权激励金额/奖金(元)','外聘研发人员的劳务费用(元)'], rows: allocRows, group: '研发支配管理' },
  '支出分配台账': { title: '支出分配台账列表', filters: ['项目编号','项目名称','费用月份'], actions: ['一键更新数据','导出'], columns: ['费用月份','项目编号','项目名称','费用类型','归集金额(元)','分配金额(元)','操作'], rows: [['2025-11','XM001','学富网','人工费用','7,583.36','7,583.36','查看'],['2025-11','XM002','力企云','直接投入','30,000.00','30,000.00','查看']], group: '研发支配管理' },
  '加计扣除留存备查资料': { title: '加计扣除留存备查资料列表', filters: ['年度','资料名称'], actions: ['一键生成','导出'], columns: ['年度','资料名称','生成状态','生成时间','操作'], rows: reportRows, group: '报表生成查询' },
  '加计扣除相关报表': { title: '加计扣除相关报表列表', filters: ['年度','报表名称'], actions: ['一键生成','导出'], columns: ['年度','报表名称','生成状态','生成时间','操作'], rows: reportRows, group: '报表生成查询' },
  '高新技术企业相关报表': { title: '高新技术企业相关报表列表', filters: ['年度','报表名称'], actions: ['一键生成','导出'], columns: ['年度','报表名称','生成状态','生成时间','操作'], rows: reportRows, group: '报表生成查询' },
  '补充数据录入': { title: '补充数据录入列表', filters: ['年度','项目编号'], actions: ['新增','导出'], columns: ['年度','项目编号','项目名称','数据项','金额(元)','操作'], rows: [], group: '报表生成查询' },
  '风险扫描预警': { title: '风险扫描预警列表', filters: ['年度','风险类型','风险等级'], actions: ['扫描','导出'], columns: ['风险类型','风险等级','风险描述','涉及项目','处理状态','操作'], rows: [['项目工时异常','高','研发工时占比超过合理阈值','XM001 学富网','待处理','查看'],['费用归集异常','中','材料投入缺少关联领料单','XM002 力企云','待处理','查看']], group: '风险扫描预警' },
  '我的导入导出': { title: '我的导入导出列表', filters: ['任务名称','任务状态'], actions: ['刷新'], columns: ['任务名称','任务类型','任务状态','创建时间','操作'], rows: [['项目立项导入','导入','成功','2026-06-22 15:37:42','下载']], group: '工作台' },
  'AI数据采集': { title: 'AI数据采集列表', filters: ['采集类型','采集状态'], actions: ['新增采集','导出'], columns: ['采集对象','采集类型','采集状态','更新时间','操作'], rows: [['华润万家有限公司','企业工商信息','已完成','2026-06-22 15:37:42','查看']], group: '工作台' },
  '租户列表': { title: '租户列表', filters: ['租户名称','联系人'], actions: ['新增','导出'], columns: ['租户名称','联系人','手机号','套餐','状态','操作'], rows: [['华润万家有限公司','王雁','15625250363','企业版','启用','详情  修改']], group: '系统管理' },
  '租户套餐': { title: '租户套餐列表', filters: ['套餐名称'], actions: ['新增','导出'], columns: ['套餐名称','应用数量','有效期','状态','操作'], rows: [['企业版','52','2027-12-31','启用','修改']], group: '系统管理' },
  '租户审核': { title: '租户审核列表', filters: ['租户名称','审核状态'], actions: ['导出'], columns: ['租户名称','申请人','申请时间','审核状态','操作'], rows: [], group: '系统管理' },
  '机构用户': { title: '机构用户列表', filters: ['用户姓名','手机号'], actions: ['新增','导出'], columns: ['用户姓名','手机号','部门','角色','状态','操作'], rows: [['王雁','15625250363','研发中心','管理员','启用','修改']], group: '系统管理' },
  '角色管理': { title: '角色管理列表', filters: ['角色名称'], actions: ['新增','导出'], columns: ['角色名称','权限范围','用户数','状态','操作'], rows: [['管理员','全部权限','1','启用','授权  修改']], group: '系统管理' },
  '部门管理': { title: '部门管理列表', filters: ['部门名称'], actions: ['新增','导出'], columns: ['部门名称','负责人','排序','状态','操作'], rows: [['研发中心','王雁','1','启用','修改']], group: '系统管理' },
  '岗位管理': { title: '岗位管理列表', filters: ['岗位名称'], actions: ['新增','导出'], columns: ['岗位名称','岗位编码','排序','状态','操作'], rows: [['研发工程师','RD','1','启用','修改']], group: '系统管理' },
  '套餐配置': { title: '套餐配置列表', filters: ['配置名称'], actions: ['新增','导出'], columns: ['配置名称','配置值','更新时间','操作'], rows: [['最大用户数','50','2026-06-22','修改']], group: '系统管理' },
};

let activePage = '首页';
const openedTabs = ['首页','人员人工费用','人员工时表','直接投入费用','折旧费用'];
var openGroups = new Set(['\u9879\u76ee\u7ba1\u7406']);

function iconFor(title) {
  const map = { 首页:'⌂', 工作台:'▣', 公司档案:'□', 项目管理:'▤', 研发过程管理:'◫', 研发费用管理:'￥', 样品管理:'▧', 半成品管理:'◈', 知识产权管理:'◎', 研发支配管理:'⇄', 报表生成查询:'▥', 风险扫描预警:'⚠', 系统管理:'⚙' };
  return map[title] || '▣';
}

function renderMenu() {
  const nav = document.querySelector('.side-nav');
  nav.innerHTML = '';
  menuGroups.forEach(group => {
    if (group.title === '首页') {
      nav.insertAdjacentHTML('beforeend', `<button class="nav-item ${activePage==='首页'?'active':''}" data-page="首页"><span class="ico">${iconFor('首页')}</span><span>首页</span></button>`);
      return;
    }
    const open = openGroups.has(group.title);
    nav.insertAdjacentHTML('beforeend', `<button class="nav-item group-open" data-group="${group.title}"><span class="ico">${iconFor(group.title)}</span><span>${group.title}</span><span class="chev">${open?'\u2303':'\u2304'}</span></button>`);
    if (open) {
      const links = group.items.map(item => `<button class="sub-link ${item===activePage?'selected':''}" data-page="${item}">${item}</button>`).join('');
      nav.insertAdjacentHTML('beforeend', `<div class="sub-nav">${links}</div>`);
    }
  });
  nav.querySelectorAll('[data-group]').forEach(el => el.addEventListener('click', () => {
    openGroups.has(el.dataset.group) ? openGroups.delete(el.dataset.group) : openGroups.add(el.dataset.group);
    renderMenu();
  }));
  nav.querySelectorAll('[data-page]').forEach(el => el.addEventListener('click', () => setPage(el.dataset.page)));
}

function setPage(page) {
  activePage = page;
  const owner = menuGroups.find(group => group.title !== '首页' && group.items.includes(page));
  if (owner) {
    openGroups.clear();
    openGroups.add(owner.title);
  }
  if (!openedTabs.includes(page)) openedTabs.push(page);
  renderMenu();
  renderTabs();
  renderContent();
}

function renderTabs() {
  const row = document.querySelector('.tabs-row');
  row.innerHTML = openedTabs.slice(-8).map(tab => `<button class="tab ${tab===activePage?'active':''}" data-page="${tab}">${tab}</button>`).join('') + '<button class="tab-more">⌄</button>';
  row.querySelectorAll('[data-page]').forEach(el => el.addEventListener('click', () => setPage(el.dataset.page)));
}

function breadcrumbFor(page) {
  if (page === '首页') return ['首页'];
  const cfg = pageConfigs[page] || {};
  return ['核心业务', cfg.group || '工作台', page];
}

function renderBreadcrumb() {
  const bc = document.querySelector('.breadcrumb');
  bc.innerHTML = breadcrumbFor(activePage).map((x,i,arr)=>`<span class="${i===arr.length-1?'now':''}">${x}</span>`).join('<em>/</em>');
}

function renderContent() {
  renderBreadcrumb();
  const content = document.querySelector('.content');
  if (activePage === '首页') {
    content.innerHTML = homeTemplate();
  } else if (pageConfigs[activePage]?.type === 'detail') {
    content.innerHTML = detailTemplate();
  } else {
    content.innerHTML = listTemplate(pageConfigs[activePage] || pageConfigs['项目立项']);
  }
  bindProcessFileButtons();
  setTimeout(bindTableActions, 100);
}
function bindProcessFileButtons() {
  document.querySelectorAll('.add-process-file').forEach(btn => {
    btn.addEventListener('click', () => {
      const row = btn.closest('tr');
      const projectName = row.querySelectorAll('td')[2]?.innerText || '';
      openProcessFileModal(projectName);
    });
  });
  // 绑定 AI生成文档按钮
  setTimeout(() => {
    document.querySelectorAll('.ai-gen-doc-btn').forEach(btn => {
      if (btn.dataset.bound) return;
      btn.dataset.bound = '1';
      btn.addEventListener('click', openAiGenModal);
    });
  }, 100);
}

function bindTableActions() {
  const tableActions = document.querySelector('.table-actions');
  if (!tableActions) return;
  const addBtn = tableActions.querySelector('.primary-btn');
  if (!addBtn || addBtn.dataset.appBound) return;
  addBtn.dataset.appBound = '1';
  addBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.openForm) {
      window.openForm('新增', activePage);
    } else if (window.openProjectForm) {
      window.openProjectForm('新增');
    } else {
      alert('新增功能正在加载，请稍后刷新页面重试');
    }
  });
}

function homeTemplate() {
  return `
    <div class="dashboard-head"><h1>年度数据统计</h1><div class="year-action"><label class="year-field"><input value="2026" aria-label="年度" /><span>⌄</span></label><button class="primary-btn">更新数据</button></div></div>
    <p class="updated">最近更新时间：2026-06-22 15:37:42</p>
    <div class="metric-grid">
      ${metric('总研发费用','5.15 万元','blue')}${metric('研发费用加计扣除总金额','0.10 万元','cyan')}${metric('总项目数','2 个','green')}${metric('总人员数','3 个','purple')}
    </div>
    <div class="chart-grid"><section class="chart-card"><h2>年度数据图表统计</h2><div class="chart-area horizontal-bars"><div class="axis-label left">金额（万元）</div><div class="bar-row"><span>总研发费用</span><i style="width:82%"></i><b>5.15</b></div><div class="bar-row"><span>加计扣除</span><i style="width:18%"></i><b>0.10</b></div><div class="grid-lines"></div></div></section><section class="chart-card"><h2>近3年总研发费用</h2><div class="chart-area line-chart"><svg viewBox="0 0 449 300" preserveAspectRatio="none"><g class="grid"><line x1="34" y1="44" x2="426" y2="44"/><line x1="34" y1="98" x2="426" y2="98"/><line x1="34" y1="152" x2="426" y2="152"/><line x1="34" y1="206" x2="426" y2="206"/><line x1="34" y1="260" x2="426" y2="260"/></g><polyline points="58,242 232,238 400,78" fill="none" stroke="#006be6" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><g class="dots"><circle cx="58" cy="242" r="5"/><circle cx="232" cy="238" r="5"/><circle cx="400" cy="78" r="5"/></g></svg><div class="x-axis"><span>2024</span><span>2025</span><span>2026</span></div></div></section></div>`;
}

function metric(label, value, tone) {
  return `<article class="metric-card"><div class="metric-icon ${tone}"><svg viewBox="0 0 54 54"><circle cx="27" cy="27" r="25" fill="currentColor" opacity=".12"/><path d="M17 30h20M17 23h20" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg></div><div><span class="metric-label">${label}</span><strong>${value}</strong></div></article>`;
}

function detailTemplate() {
  const fields = [
    ['英文名称','China Resources Vanguard Co., Ltd.'], ['曾用名','华润万家便利超市（深圳）有限公司'], ['法定代表人','魏晋有'], ['成立日期','1991-06-18'],
    ['注册资本','664,359.74万元'], ['组织机构代码','192201295'], ['经营状态','存续（在营、开业、在册）'], ['工商注册号','440301503240240'],
    ['统一社会信用代码','914403001922012959'], ['企业规模','大型'], ['行业大类','批发和零售业'], ['行业小类','零售业'],
    ['企业类型','有限责任公司（外商合资）'], ['参保人数','797'], ['经营期限','1991-06-18 至 2032-08-20'], ['登记机关','深圳市市场监督管理局'],
    ['核准日期','2025-07-18'], ['注册地址','深圳市罗湖区黄贝街道黄贝路国家动漫画产业基地动漫大厦18层']
  ];
  return `<section class="detail-card"><h1>华润万家有限公司</h1><div class="detail-grid">${fields.map(([k,v])=>`<div class="detail-cell"><label>${k}</label><p>${v}</p></div>`).join('')}</div><div class="detail-long"><label>经营范围</label><p>经营电子商务。体育用品及器材批发；化工产品销售；建筑材料销售；机械设备销售；家具销售；工艺美术品及收藏品零售；消防器材销售；计算机软硬件及辅助设备零售；通讯设备销售。特殊医学用途配方食品、商品零售及依托第三方平台开展如下商品的销售，经营商品种类包括食品、日用百货、文教体育用品、五金家电等。</p></div><div class="setting-row"><span>考勤方式</span><button class="primary-btn">设 置</button></div></section>`;
}

function listTemplate(cfg) {
  const tabs = cfg.tabs ? `<div class="inner-tabs">${cfg.tabs.map((t,i)=>`<button class="inner-tab ${i===0?'active':''}">${t}</button>`).join('')}</div>` : '';
  return `${tabs}<section class="filter-card"><div class="filter-grid">${cfg.filters.map(f=>fieldTemplate(f)).join('')}</div><div class="filter-actions"><button class="ghost-btn">重 置</button><button class="primary-btn">搜 索</button><button class="link-btn">收起</button></div></section><section class="table-card"><div class="table-head"><h1>${cfg.title}</h1><div class="table-actions">${cfg.actions.map((a,i)=>`<button class="${i===0?'primary-btn':'ghost-btn'}">${a}</button>`).join('')}</div></div><div class="table-scroll"><table><thead><tr><th class="check-col"></th>${cfg.columns.map(c=>`<th>${c}</th>`).join('')}</tr></thead><tbody>${cfg.rows.length ? cfg.rows.map(r=>`<tr><td class="check-col"><span class="checkbox"></span></td>${r.map(c=>`<td>${String(c)=== '+添加' ? '<button class="link-btn add-process-file">${c}</button>' : String(c).replace(/\n/g,'<br>')}</td>`).join('')}</tr>`).join('') : `<tr><td class="empty" colspan="${cfg.columns.length+1}">暂无数据</td></tr>`}</tbody></table></div><div class="pager"><span>共 ${cfg.rows.length} 条记录</span><button>1</button></div></section>`;
}

function fieldTemplate(label) {
  const placeholder = label.includes('类型') || label.includes('状态') || label.includes('类别') ? `请选择${label.replace('项目','')}` : label.includes('人') ? `请输入${label}查询` : '';
  return `<label class="form-item"><span>${label}</span><div class="input-like">${placeholder}<em>${placeholder.startsWith('请选择')?'⌄':''}</em></div></label>`;
}
let processFileList = [];
function renderProcessFileTableBody(projectName) {
  if (!processFileList.length) {
    return `<tr><td class="empty" colspan="7">
<span class="empty-icon">📁</span>
<p>暂无数据</p>
</td></tr>`;
  }
  return processFileList.map((file, i) => `<tr>
<td class="check-col"><span class="checkbox"></span></td>
<td>${file.name}</td>
<td>${file.project || projectName}</td>
<td>${file.type}</td>
<td>${file.desc}</td>
<td>${file.creator}</td>
<td>
<button class="link-btn" onclick="downloadProcessFile(${i})">下载</button>
<button class="link-btn danger" onclick="deleteProcessFile(${i})">删除</button>
</td>
</tr>`).join('');
}
function processFileModal(projectName) {
  return `<div class="modal-overlay" onclick="closeProcessFileModal()">
<div class="modal-panel modal-wide" onclick="event.stopPropagation()">
<header>
<h3>项目过程文件</h3>
<button class="modal-close" onclick="closeProcessFileModal()">×</button>
</header>
<div class="modal-body">
<div class="filter-card">
<div class="filter-grid">
<label class="form-item"><span>文件名称</span><div class="input-like">请输入文件名称</div></label>
<label class="form-item"><span>文件类型</span><div class="input-like">请选择文件类型<em>⌄</em></div></label>
</div>
<div class="filter-actions">
<button class="ghost-btn">重 置</button>
<button class="primary-btn">搜 索</button>
<button class="link-btn">收起⌃</button>
</div>
</div>
<section class="table-card">
<div class="table-head">
<h6>项目过程文件列表</h6>
<div class="table-actions">
<button class="primary-btn">+ 上传文件</button>
<button class="ghost-btn">批量删除</button>
<button class="ghost-btn ai-gen-doc-btn" onclick="openAiGenModal()">✨ AI生成文档</button>
<button class="icon-btn">⌕</button>
<button class="icon-btn">↺</button>
</div>
</div>
<div class="table-scroll file-list-container">
<table>
<thead>
<tr><th class="check-col"></th><th>文件名称</th><th>关联项目</th><th>文件类型</th><th>内容描述</th><th>创建人</th><th>操作</th></tr>
</thead>
<tbody>${renderProcessFileTableBody(projectName)}
</tbody>
</table>
</div>
<div class="pager">
<span>共 ${processFileList.length} 条记录</span>
<select><option>20条/页</option></select>
<button class="active">1</button>
</div>
</section>
</div>
</div>
</div>`;
}
function refreshFileList(projectName) {
  const container = document.querySelector('.file-list-container');
  const pager = document.querySelector('.modal-panel .pager');
  if (container) container.querySelector('tbody').innerHTML = renderProcessFileTableBody(projectName);
  if (pager) pager.querySelector('span').innerText = `共 ${processFileList.length} 条记录`;
}
function downloadProcessFile(index) {
  const file = processFileList[index];
  if (window.toast) window.toast(`开始下载：${file.name}`);
  else alert(`开始下载：${file.name}`);
}
function deleteProcessFile(index) {
  const file = processFileList[index];
  if (!confirm(`确认删除文件：${file.name}？`)) return;
  processFileList.splice(index, 1);
  refreshFileList('');
  if (window.toast) window.toast('文件已删除');
}
function openProcessFileModal(project) {
  const overlay = document.createElement('div');
  overlay.id = 'process-file-overlay';
  overlay.innerHTML = processFileModal(project);
  document.body.appendChild(overlay);
}
function closeProcessFileModal() {
  const overlay = document.getElementById('process-file-overlay');
  if (overlay) overlay.remove();
}

renderMenu();
renderTabs();
renderContent();

let aiGenSelectedType = '技术调查报告';
const aiGenDocTypes = ['技术调查报告','测试报告','中期验收报告','项目结题验收结论'];

function openAiGenModal() {
  const modal = document.createElement('div');
  modal.id = 'ai-gen-modal';
  modal.className = 'modal-overlay ai-gen-overlay';
  modal.onclick = (e) => { if (e.target === modal) closeAiGenModal(); };
  modal.innerHTML = `<div class="modal-panel ai-gen-panel" onclick="event.stopPropagation()">
<header>
<h4>✨ AI生成文档</h4>
<button class="modal-close" onclick="closeAiGenModal()">×</button>
</header>
<div class="modal-body" style="padding:20px">
<div style="margin-bottom:8px;color:#606266">请选择文件类型</div>
<div class="ai-doc-type-select">
${aiGenDocTypes.map((t,i) => `<button class="ai-doc-type-btn ${i===0?'active':''}" onclick="selectAiDocType('${t}', this)">${t}</button>`).join('')}
</div>
</div>
<footer style="padding:14px 20px;border-top:1px solid #ebeef5;display:flex;justify-content:flex-end;gap:10px">
<button class="ghost-btn" onclick="closeAiGenModal()">取 消</button>
<button class="primary-btn ai-gen-submit" onclick="submitAiGen()">生 成</button>
</footer>
</div>`;
  document.body.appendChild(modal);
}
function closeAiGenModal() {
  document.getElementById('ai-gen-modal')?.remove();
}
function selectAiDocType(type, btn) {
  aiGenSelectedType = type;
  document.querySelectorAll('.ai-doc-type-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}
function submitAiGen() {
  const btn = document.querySelector('.ai-gen-submit');
  btn.disabled = true;
  btn.innerText = '生成中...';
  setTimeout(() => {
    const timestamp = new Date().toLocaleDateString().replace(/\//g,'');
    const fileName = `项目${aiGenSelectedType}-${timestamp}.docx`;
    processFileList.unshift({
      name: fileName,
      project: '学富网',
      type: aiGenSelectedType,
      desc: 'AI自动生成',
      creator: '王雁',
      createdAt: new Date().toLocaleString()
    });
    closeAiGenModal();
    refreshFileList('学富网');
    if (window.toast) window.toast(`文档「${fileName}」生成成功`);
  }, 1500);
}
// 挂载到 window 确保 inline onclick 可调用
window.openAiGenModal = openAiGenModal;
window.closeAiGenModal = closeAiGenModal;
window.selectAiDocType = selectAiDocType;
window.submitAiGen = submitAiGen;
window.downloadProcessFile = downloadProcessFile;
window.deleteProcessFile = deleteProcessFile;