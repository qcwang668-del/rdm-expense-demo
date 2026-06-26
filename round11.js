(function () {
  // ============================================================
  //  半成品管理 - 全局数据存储
  // ============================================================
  var STORE = {
    '半成品入库': [
      { id:'BK001', date:'2026-03-15', projectId:'XM001', projectName:'学富网', materialId:'3333', materialName:'电脑设备组件', spec:'dsd', unit:'套', qty:5, amount:38500, subject:'研发支出-材料', operator:'王雁', status:'已入库' },
      { id:'BK002', date:'2026-04-20', projectId:'XM002', projectName:'力企云', materialId:'5555', materialName:'精密传感器模块', spec:'PS-200', unit:'个', qty:8, amount:64000, subject:'研发支出-材料', operator:'李四', status:'已入库' }
    ],
    '半成品领用': [
      { id:'LY001', date:'2026-03-20', projectId:'XM001', projectName:'学富网', materialId:'3333', materialName:'电脑设备组件', qty:2, purpose:'组装测试', operator:'和美', expectedUse:'样机试制', status:'已领用', sourceStockId:'BK001' },
      { id:'LY002', date:'2026-05-02', projectId:'XM002', projectName:'力企云', materialId:'5555', materialName:'精密传感器模块', qty:3, purpose:'性能验证', operator:'李四', expectedUse:'样机试制', status:'已领用', sourceStockId:'BK002' }
    ],
    '半成品退库': [
      { id:'TK001', date:'2026-04-05', sourceId:'LY001', projectId:'XM001', projectName:'学富网', materialId:'3333', materialName:'电脑设备组件', qty:1, amount:7700, expenseAmt:0, reason:'测试失败，组件可复用' }
    ],
    '半成品报废': [
      { id:'BF001', date:'2026-04-10', projectId:'XM001', materialId:'3333', materialName:'电脑设备组件', qty:1, amount:7700, reason:'测试中不可逆损坏', expenseAmt:7700, sourceStockId:'BK001', sourcePickId:'LY001' }
    ],
    '半成品费用化': [
      { id:'FYH001', date:'2026-04-12', projectId:'XM001', materialId:'3333', materialName:'电脑设备组件', qty:1, amount:7700, sourceType:'报废', targetSubject:'管理费用-研发费用', status:'已结转', sourceRefId:'BF001' }
    ]
  };

  var NEXT_IDS = { '半成品入库':3, '半成品领用':3, '半成品退库':2, '半成品报废':2, '半成品费用化':2 };

  function nextId(page) { return (page === '半成品入库' ? 'BK' : page === '半成品领用' ? 'LY' : page === '半成品退库' ? 'TK' : page === '半成品报废' ? 'BF' : 'FYH') + String(NEXT_IDS[page]++).padStart(3,'0'); }

  // ============================================================
  //  库存汇总计算
  // ============================================================
  function getInventory() {
    var inv = {};
    STORE['半成品入库'].forEach(function(r) {
      if (!inv[r.materialId]) inv[r.materialId] = { materialId:r.materialId, materialName:r.materialName, spec:r.spec||'', unit:r.unit||'个', totalIn:0, totalAmount:0 };
      inv[r.materialId].totalIn += r.qty;
      inv[r.materialId].totalAmount += r.amount;
    });
    // 计算 unitCost
    Object.keys(inv).forEach(function(k) { inv[k].unitCost = inv[k].totalIn > 0 ? inv[k].totalAmount / inv[k].totalIn : 0; });

    STORE['半成品领用'].forEach(function(r) {
      if (inv[r.materialId]) { inv[r.materialId]._picked = (inv[r.materialId]._picked||0) + r.qty; }
    });
    STORE['半成品退库'].forEach(function(r) {
      if (inv[r.materialId]) { inv[r.materialId]._returned = (inv[r.materialId]._returned||0) + r.qty; }
    });
    STORE['半成品报废'].forEach(function(r) {
      if (inv[r.materialId]) { inv[r.materialId]._scrapped = (inv[r.materialId]._scrapped||0) + r.qty; }
    });

    Object.keys(inv).forEach(function(k) {
      var v = inv[k];
      v.totalPicked = v._picked || 0;
      v.totalReturned = v._returned || 0;
      v.totalScrapped = v._scrapped || 0;
      v.available = v.totalIn - v.totalPicked + v.totalReturned - v.totalScrapped; // simplified
      v.inUse = v.totalPicked - v.totalReturned - v.totalScrapped;
    });
    return inv;
  }

  function getUnitCost(materialId) {
    var inv = getInventory();
    return inv[materialId] ? inv[materialId].unitCost : 0;
  }

  // ============================================================
  //  半成品台账计算
  // ============================================================
  function getLedger() {
    var inv = getInventory();
    var ledger = [];
    Object.keys(inv).forEach(function(k) {
      var v = inv[k];
      var inQty = v.totalIn, pickQty = v.totalPicked, retQty = v.totalReturned, scrpQty = v.totalScrapped;
      var expQty = 0, expAmt = 0;
      STORE['半成品费用化'].forEach(function(r) {
        if (r.materialId === k && r.status === '已结转') { expQty += r.qty; expAmt += r.amount; }
      });
      var endQty = v.available; // simplified: in - picked + returned - scrapped
      var inAmt = v.totalAmount;
      var reduceAmt = (pickQty - retQty) * v.unitCost + scrpQty * v.unitCost;
      var endAmt = inAmt - reduceAmt;
      if (endAmt < 0) endAmt = 0;
      ledger.push({
        materialId: v.materialId, materialName: v.materialName, spec: v.spec,
        beginQty: 0, inQty: inQty, pickQty: pickQty, retQty: retQty, scrpQty: scrpQty, expQty: expQty, endQty: endQty,
        beginAmt: 0, inAmt: inAmt, reduceAmt: reduceAmt, endAmt: endAmt
      });
    });
    return ledger;
  }

  // ============================================================
  //  Toast
  // ============================================================
  function toast(msg, type) {
    type = type || 'success';
    var root = document.querySelector('.toast-root');
    if (!root) return;
    var el = document.createElement('div');
    el.className = 'toast ' + type;
    el.textContent = msg;
    root.appendChild(el);
    setTimeout(function(){ el.classList.add('show'); }, 20);
    setTimeout(function(){ el.classList.remove('show'); setTimeout(function(){ el.remove(); }, 220); }, 2400);
  }
  window.semiToast = toast;

  function currentPage() {
    return document.querySelector('.tab.active')?.dataset.page || document.querySelector('.sub-link.selected')?.dataset.page || '';
  }

  // ============================================================
  //  半成品状态流转看板 (交互增强)
  // ============================================================
  function renderSemiStatusBoard() {
    var page = currentPage();
    if (!page.startsWith('半成品')) return;
    var content = document.querySelector('.content');
    if (!content || document.querySelector('.semi-status-board')) return;

    var inv = getInventory();
    var totalIn = Object.values(inv).reduce(function(s,v){ return s+v.totalIn; },0);
    var totalPicked = Object.values(inv).reduce(function(s,v){ return s+v.totalPicked; },0);
    var totalReturned = Object.values(inv).reduce(function(s,v){ return s+v.totalReturned; },0);
    var totalScrapped = Object.values(inv).reduce(function(s,v){ return s+v.totalScrapped; },0);
    var expensedCount = STORE['半成品费用化'].filter(function(r){ return r.status==='已结转'; }).length;

    var steps = [
      { label:'研发支出', desc:'费用归集\n'+totalIn+'笔', icon:'￥', active: totalIn>0 },
      { label:'半成品入库', desc:'借:库存商品\n贷:研发支出', icon:'□', active: totalIn>0 },
      { label:'领用组装', desc:'BOM领用\n'+totalPicked+'笔', icon:'▣', active: totalPicked>0 },
      { label:'结果判定', desc:'成功/失败', icon:'?', active: totalPicked>0 },
      { label:'成功→样机', desc:'出售/送测', icon:'✓', active: false },
      { label:'失败→退库', desc:'可复用退回\n'+totalReturned+'笔', icon:'↩', active: totalReturned>0 },
      { label:'失败→报废', desc:'不可用销毁\n'+totalScrapped+'笔', icon:'✕', active: totalScrapped>0 },
      { label:'费用化结转', desc:'借:管理费用\n贷:研发支出\n'+expensedCount+'笔', icon:'→', active: expensedCount>0 }
    ];

    var html = '<div class="semi-status-board" style="display:flex;align-items:center;gap:0;padding:14px 16px;margin-bottom:16px;background:var(--white);border-radius:8px;box-shadow:0 1px 2px rgba(16,24,40,.04);overflow-x:auto;font-size:13px;cursor:default">';
    steps.forEach(function(s,i){
      var isLast = i===steps.length-1;
      var bg = s.active ? (i<=1?'#e8f3ff':i<=3?'#fff8e6':i<=4?'#e6f7ee':i===7?'#f3efff':'#fce8ea') : '#f0f0f0';
      var fg = s.active ? (i<=1?'#006be6':i<=3?'#ba7517':i<=4?'#20b26b':i===7?'#7a5af8':'#d03050') : '#aaa';
      // Step node
      html += '<div class="semi-step-node" data-step="'+s.label+'" style="flex-shrink:0;text-align:center;min-width:86px;padding:10px 8px;border-radius:8px;background:'+bg+';transition:all .2s;cursor:pointer;border:2px solid transparent" onmouseover="this.style.borderColor=\''+fg+'\';this.style.boxShadow=\'0 0 0 3px '+fg+'22\'" onmouseout="this.style.borderColor=\'transparent\';this.style.boxShadow=\'none\'">';
      html += '<div style="width:34px;height:34px;border-radius:50%;margin:0 auto 6px;display:grid;place-items:center;font-weight:600;font-size:15px;background:'+fg+'18;color:'+fg+'">'+s.icon+'</div>';
      html += '<div style="font-weight:500;font-size:12px;color:'+(s.active?'#323639':'#aaa')+'">'+s.label+'</div>';
      html += '<div style="font-size:10px;color:'+(s.active?'rgba(50,54,57,.55)':'#bbb')+';line-height:1.5;white-space:pre-line;margin-top:2px">'+s.desc+'</div>';
      html += s.active ? '<div style="margin-top:4px;width:8px;height:8px;border-radius:50%;background:'+fg+';display:inline-block"></div>' : '';
      html += '</div>';
      // Arrow (after node, not wrapped with it)
      if (!isLast) html += '<div style="flex-shrink:0;width:20px;text-align:center;color:rgba(50,54,57,.25);font-size:18px">→</div>';
    });
    html += '</div>';

    // 汇总卡片
    html += '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:16px">';
    html += metricCard('累计入库', totalIn+' 笔', '#006be6');
    html += metricCard('在研领用', (totalPicked - totalReturned - totalScrapped)+' 笔', '#ba7517');
    html += metricCard('已退库/报废', (totalReturned+totalScrapped)+' 笔', '#d03050');
    html += metricCard('已费用化', expensedCount+' 笔', '#7a5af8');
    html += '</div>';

    content.insertAdjacentHTML('afterbegin', html);
  }

  function metricCard(label, val, color) {
    return '<div class="semi-metric" style="padding:14px;background:#fff;border-radius:8px;box-shadow:0 1px 2px rgba(16,24,40,.04);text-align:center;border-left:3px solid '+color+'">'+
      '<div class="semi-metric-val" style="font-size:22px;font-weight:600;color:'+color+'">'+val+'</div>'+
      '<div class="semi-metric-label" style="font-size:12px;color:rgba(50,54,57,.55);margin-top:2px">'+label+'</div></div>';
  }

  // ============================================================
  //  表格重绘
  // ============================================================
  function rebuildSemiTable(page) {
    var tb = document.querySelector('.content table tbody');
    if (!tb) return;
    var cfg = getPageConfig(page);
    if (!cfg) return;

    var rows;
    if (page === '半成品台账') {
      rows = getLedger();
    } else {
      rows = (STORE[page] || []).slice();
    }

    var inv = getInventory();

    if (rows.length === 0) {
      tb.innerHTML = '<tr><td class="empty" colspan="'+(cfg.columns.length+1)+'"><span class="empty-icon">📦</span><p>暂无数据，请点击「新增」添加</p></td></tr>';
      updatePagerCount(page, 0);
      return;
    }

    var html = '';
    rows.forEach(function(r, ri) {
      html += '<tr>';
      html += '<td class="check-col"><span class="checkbox"></span></td>';
      cfg.columns.forEach(function(col) {
        html += '<td>'+formatCell(col, r, page, inv)+'</td>';
      });
      html += '</tr>';
    });
    tb.innerHTML = html;
    updatePagerCount(page, rows.length);

    // 延迟绑定操作按钮
    setTimeout(function(){ enhanceSemiRowActions(page); }, 50);
  }

  function formatCell(col, r, page, inv) {
    if (col === '操作') return renderActions(col, r, page);
    var key = colMap(col);
    var val = r[key];
    if (val === undefined || val === null) {
      // computed fields
      if (col === '期末结存' && r.endQty !== undefined) return String(r.endQty);
      if (col === '期末金额(元)' && r.endAmt !== undefined) return r.endAmt.toFixed(2);
      if (col === '本期入库金额(元)' && r.inAmt !== undefined) return r.inAmt.toFixed(2);
      if (col === '本期减少金额(元)' && r.reduceAmt !== undefined) return r.reduceAmt.toFixed(2);
      if (col === '期初金额(元)' && r.beginAmt !== undefined) return r.beginAmt.toFixed(2);
      if (col === '费用化金额(元)' && r.expenseAmt !== undefined) return r.expenseAmt.toFixed(2);
      if (col === '入库金额(元)' && r.amount !== undefined) return r.amount.toFixed(2);
      if (col === '折算金额(元)' && r.amount !== undefined) return r.amount.toFixed(2);
      if (col === '报废金额(元)' && r.amount !== undefined) return r.amount.toFixed(2);
      return '--';
    }
    // format amounts
    if (col.includes('金额') && typeof val === 'number') return val.toFixed(2);
    // status badge
    if (col === '状态' || col === '结转状态') {
      var cmap = { '已入库':'#006be6', '已领用':'#ba7517', '已退库':'#20b26b', '已报废':'#d03050', '已费用化':'#7a5af8', '已结转':'#20b26b', '已撤销':'#d03050', '转样机':'#12a9c7' };
      var bgmap = { '已入库':'#e8f3ff', '已领用':'#fff8e6', '已退库':'#e6f7ee', '已报废':'#fce8ea', '已费用化':'#f3efff', '已结转':'#e6f7ee', '已撤销':'#fce8ea', '转样机':'#e6f9fc' };
      return '<span style="display:inline-block;padding:2px 10px;border-radius:10px;background:'+(bgmap[val]||'#f7f8fa')+';color:'+(cmap[val]||'#666')+';font-size:12px;font-weight:500">'+val+'</span>';
    }
    return String(val);
  }

  function colMap(col) {
    var m = {
      '入库单号':'id','入库日期':'date','项目编号':'projectId','项目名称':'projectName','物料编号':'materialId','物料名称':'materialName',
      '规格型号':'spec','数量单位':'unit','入库数量':'qty','入库金额(元)':'amount','研发支出科目':'subject','经办人':'operator','状态':'status',
      '领用单号':'id','领用日期':'date','领用数量':'qty','领用用途':'purpose','领料人':'operator','预期去向':'expectedUse',
      '退库单号':'id','退库日期':'date','原领用单号':'sourceId','退库数量':'qty','折算金额(元)':'amount','费用化金额(元)':'expenseAmt','退库原因':'reason',
      '报废单号':'id','报废日期':'date','报废数量':'qty','报废金额(元)':'amount','报废原因':'reason',
      '费用化单号':'id','费用化日期':'date','数量':'qty','来源类型':'sourceType','目标科目':'targetSubject','结转状态':'status',
      // 台账
      '期初数量':'beginQty','本期入库':'inQty','本期领用':'pickQty','本期退库':'retQty','本期报废':'scrpQty','本期费用化':'expQty',
      '期初金额(元)':'beginAmt','本期入库金额(元)':'inAmt','本期减少金额(元)':'reduceAmt','期末金额(元)':'endAmt'
    };
    return m[col] || col;
  }

  function renderActions(col, r, page) {
    if (page === '半成品入库') {
      if (r.status === '已入库') return '<button class="link-btn" data-act="详情">详情</button> <button class="link-btn" data-act="修改">修改</button> <button class="link-btn danger" data-act="删除">删除</button>';
      return '<button class="link-btn" data-act="详情">详情</button>';
    }
    if (page === '半成品领用') {
      if (r.status === '已领用') return '<button class="link-btn" data-act="详情">详情</button> <button class="link-btn" data-act="转样机">转样机</button> <button class="link-btn" data-act="退库">退库</button> <button class="link-btn danger" data-act="报废">报废</button>';
      if (r.status === '转样机') return '<button class="link-btn" data-act="详情">详情</button> <span style="color:#12a9c7;font-size:12px">已转样机</span>';
      return '<button class="link-btn" data-act="详情">详情</button>';
    }
    if (page === '半成品退库') {
      return '<button class="link-btn" data-act="修改">修改</button> <button class="link-btn danger" data-act="删除">删除</button> <button class="link-btn" data-act="费用化结转" style="color:#7a5af8">费用化结转</button>';
    }
    if (page === '半成品报废') {
      return '<button class="link-btn" data-act="详情">详情</button> <button class="link-btn" data-act="修改">修改</button> <button class="link-btn danger" data-act="删除">删除</button>';
    }
    if (page === '半成品费用化') {
      if (r.status === '已结转') return '<button class="link-btn" data-act="查看">查看</button> <button class="link-btn" data-act="撤销">撤销</button>';
      return '<button class="link-btn" data-act="查看">查看</button>';
    }
    if (page === '半成品台账') {
      return '<button class="link-btn" data-act="查看明细">查看明细</button>';
    }
    return '';
  }

  function updatePagerCount(page, count) {
    var pager = document.querySelector('.content .pager span');
    if (pager) pager.textContent = '共 '+count+' 条记录';
  }

  function getPageConfig(page) {
    if (typeof pageConfigs === 'undefined') return null;
    return pageConfigs[page] || null;
  }

  // ============================================================
  //  CRUD 表单弹窗
  // ============================================================
  function openSemiForm(mode, page, rowData) {
    var isView = mode === '详情' || mode === '查看' || mode === '查看明细';
    var title = mode + ' - ' + page;
    var inv = getInventory();
    var fieldsHTML = buildFormFields(page, isView, rowData, inv);

    var extraHTML = '';
    if (page === '半成品退库' && rowData) extraHTML += renderReturnCalc(rowData, inv);
    if (page === '半成品报废' && !isView) extraHTML += renderScrapNote(rowData, inv);

    var footer = '';
    if (!isView) {
      footer = '<footer style="padding:14px 18px;border-top:1px solid #edf0f5;display:flex;justify-content:flex-end;gap:10px"><button class="ghost-btn" onclick="this.closest(\'.modal-overlay\').remove()">取 消</button><button class="primary-btn semi-form-submit">确 认</button></footer>';
    } else {
      footer = '<footer style="padding:14px 18px;border-top:1px solid #edf0f5;display:flex;justify-content:flex-end;gap:10px"><button class="ghost-btn" onclick="this.closest(\'.modal-overlay\').remove()">关 闭</button></footer>';
    }

    var overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.onclick = function(e){ if(e.target===overlay) overlay.remove(); };
    overlay.innerHTML = '<div class="modal-panel" onclick="event.stopPropagation()" style="width:min(640px, calc(100vw - 48px));max-height:85vh;overflow-y:auto">'+
      '<header><h3>'+title+'</h3><button class="modal-close" onclick="this.closest(\'.modal-overlay\').remove()">×</button></header>'+
      '<div class="modal-body"><div class="modal-grid">'+fieldsHTML+extraHTML+'</div></div>'+footer+'</div>';
    document.body.appendChild(overlay);

    if (!isView) {
      overlay.querySelector('.semi-form-submit').addEventListener('click', function(e){
        e.stopPropagation();
        submitSemiForm(this, overlay, page, mode, rowData);
      });
    }

    return overlay;
  }

  function buildFormFields(page, isView, rowData, inv) {
    var ro = isView ? 'readonly' : '';
    var bg = isView ? 'background:#f7f8fa' : '';
    function fld(label, key, type, opts) {
      type = type || 'text';
      var val = rowData ? (rowData[key]!==undefined?rowData[key]:'') : '';
      if (typeof val === 'number') val = type==='number' ? val : val.toFixed(2);
      if (type === 'select' && opts) {
        var projectOptions = opts.map(function(o){ return '<option value="'+o.v+'"'+(String(val)===String(o.v)?' selected':'')+'>'+o.l+'</option>'; }).join('');
        return '<label class="modal-field"><span>'+label+'</span><select '+ro+' data-field="'+key+'" style="width:100%;padding:8px 12px;border:1px solid #d9d9d9;border-radius:6px;'+bg+'">'+projectOptions+'</select></label>';
      }
      if (type === 'number') {
        return '<label class="modal-field"><span>'+label+'</span><input '+ro+' type="number" value="'+val+'" data-field="'+key+'" placeholder="请输入'+label+'" style="'+bg+'"></label>';
      }
      if (type === 'textarea') {
        return '<label class="modal-field" style="grid-column:1/-1"><span>'+label+'</span><textarea '+ro+' data-field="'+key+'" placeholder="请输入'+label+'" style="'+bg+';min-height:80px">'+val+'</textarea></label>';
      }
      return '<label class="modal-field"><span>'+label+'</span><input '+ro+' value="'+val+'" data-field="'+key+'" placeholder="请输入'+label+'" style="'+bg+'"></label>';
    }

    var projects = [{v:'XM001',l:'XM001 学富网'},{v:'XM002',l:'XM002 力企云'}];
    var materials = Object.values(inv).map(function(v){ return {v:v.materialId, l:v.materialId+' '+v.materialName}; });
    if (materials.length===0) materials = [{v:'3333',l:'3333 电脑设备组件'},{v:'5555',l:'5555 精密传感器模块'}];

    switch(page) {
      case '半成品入库':
        return fld('入库日期','date','text')+fld('项目','projectId','select',projects)+
               fld('物料编号','materialId','text')+fld('物料名称','materialName','text')+
               fld('规格型号','spec','text')+fld('数量单位','unit','text')+
               fld('入库数量','qty','number')+fld('入库金额(元)','amount','number')+
               fld('研发支出科目','subject','select',[{v:'研发支出-材料',l:'研发支出-材料'},{v:'研发支出-人工',l:'研发支出-人工'},{v:'研发支出-折旧',l:'研发支出-折旧'}])+
               fld('经办人','operator','select',[{v:'王雁',l:'王雁'},{v:'李四',l:'李四'},{v:'和美',l:'和美'}]);
      case '半成品领用':
        return fld('领用日期','date','text')+fld('项目','projectId','select',projects)+
               fld('物料编号','materialId','select',materials)+fld('物料名称','materialName','text')+
               fld('领用数量','qty','number')+fld('领用用途','purpose','text')+
               fld('领料人','operator','select',[{v:'王雁',l:'王雁'},{v:'李四',l:'李四'},{v:'和美',l:'和美'}])+
               fld('预期去向','expectedUse','select',[{v:'样机试制',l:'样机试制'},{v:'性能测试',l:'性能测试'},{v:'送测',l:'送测'}]);
      case '半成品退库':
        return fld('退库日期','date','text')+fld('原领用单号','sourceId','text')+
               fld('项目','projectId','select',projects)+
               fld('物料编号','materialId','text')+fld('物料名称','materialName','text')+
               fld('退库数量','qty','number')+fld('折算金额(元)','amount','number')+
               fld('退库原因','reason','textarea');
      case '半成品报废':
        return fld('报废日期','date','text')+fld('项目','projectId','select',projects)+
               fld('物料编号','materialId','select',materials)+fld('物料名称','materialName','text')+
               fld('报废数量','qty','number')+fld('报废金额(元)','amount','number')+
               fld('报废原因','reason','textarea');
      case '半成品费用化':
        return fld('费用化日期','date','text')+fld('项目','projectId','select',projects)+
               fld('物料编号','materialId','text')+fld('物料名称','materialName','text')+
               fld('数量','qty','number')+fld('费用化金额(元)','amount','number')+
               fld('来源类型','sourceType','select',[{v:'报废',l:'报废'},{v:'退库',l:'退库'},{v:'直接费用化',l:'直接费用化'}])+
               fld('目标科目','targetSubject','select',[{v:'管理费用-研发费用',l:'管理费用-研发费用'},{v:'研发支出',l:'研发支出'}]);
      default: return '';
    }
  }

  function renderReturnCalc(rowData, inv) {
    var v = inv && rowData ? inv[rowData.materialId] : null;
    var uc = v ? v.unitCost : 0;
    var qty = rowData ? rowData.qty : 0;
    return '<div style="margin-top:14px;padding:12px 14px;background:#f7f8fa;border-radius:6px;font-size:12px;color:rgba(50,54,57,.7);line-height:1.8">'+
      '<strong>计算说明：</strong><br>'+
      '① 单位成本 = 入库总金额 ÷ 入库总数量 = '+uc.toFixed(2)+' 元<br>'+
      '② 退库金额 = 单位成本 × 退库数量<br>'+
      '③ 费用化金额 = 0（本次全额退库，无未退款部分）'+
      '</div>';
  }

  function renderScrapNote(rowData, inv) {
    return '<div style="margin-top:14px;padding:12px 14px;background:#fff3f3;border:1px solid #fcc;border-radius:6px;font-size:12px;color:#a00;line-height:1.8">'+
      '<strong>⚠ 提示：</strong>报废操作将自动生成一张对应的费用化结转单，将报废金额转入「管理费用-研发费用」科目。'+
      '</div>';
  }

  function submitSemiForm(btn, overlay, page, mode, rowData) {
    var inputs = overlay.querySelectorAll('[data-field]');
    var data = {};
    inputs.forEach(function(inp){
      var key = inp.dataset.field;
      var val = inp.value;
      if (['qty','amount','expenseAmt'].indexOf(key) >= 0) val = Number(val) || 0;
      data[key] = val;
    });

    // 补充 data
    if (page === '半成品入库') {
      data.id = rowData ? rowData.id : nextId(page);
      data.status = '已入库';
      // auto-fill projectName from projectId
      if (data.projectId === 'XM001') data.projectName = '学富网';
      else if (data.projectId === 'XM002') data.projectName = '力企云';
      if (!data.amount && data.qty) data.amount = data.qty * 7700; // default unit cost
    } else if (page === '半成品领用') {
      data.id = rowData ? rowData.id : nextId(page);
      data.status = '已领用';
      data.sourceStockId = rowData ? rowData.sourceStockId : '';
      if (data.projectId === 'XM001') data.projectName = '学富网';
      else if (data.projectId === 'XM002') data.projectName = '力企云';
    } else if (page === '半成品退库') {
      data.id = rowData ? rowData.id : nextId(page);
      data.expenseAmt = data.expenseAmt || 0;
      if (data.projectId === 'XM001') data.projectName = '学富网';
      else if (data.projectId === 'XM002') data.projectName = '力企云';
    } else if (page === '半成品报废') {
      data.id = rowData ? rowData.id : nextId(page);
      data.expenseAmt = data.amount || 0;
      // auto-create 费用化
      var eid = nextId('半成品费用化');
      STORE['半成品费用化'].push({
        id: eid, date: data.date, projectId: data.projectId, materialId: data.materialId,
        materialName: data.materialName, qty: data.qty, amount: data.expenseAmt,
        sourceType: '报废', targetSubject: '管理费用-研发费用', status: '已结转', sourceRefId: data.id
      });
      toast('已自动生成费用化单：'+eid, 'success');
    } else if (page === '半成品费用化') {
      data.id = rowData ? rowData.id : nextId(page);
      data.status = data.status || '已结转';
    }

    // Save
    if (mode === '新增') {
      STORE[page].push(data);
      toast(page+'单号 '+data.id+' 已创建');
    } else if (mode === '修改' && rowData) {
      var idx = STORE[page].findIndex(function(r){ return r.id === rowData.id; });
      if (idx >= 0) {
        var merged = {};
        Object.keys(rowData).forEach(function(k){ merged[k] = rowData[k]; });
        Object.keys(data).forEach(function(k){ merged[k] = data[k]; });
        STORE[page][idx] = merged;
        toast(page+'单号 '+rowData.id+' 已更新');
      }
    }

    overlay.remove();
    refreshCurrentSemiPage();
    refreshStatusBoard();
  }

  function refreshStatusBoard() {
    var old = document.querySelector('.semi-status-board');
    if (old) {
      var parent = old.parentNode;
      // Remove board + metric cards
      var next = old.nextElementSibling;
      while (next && (next.classList.contains('semi-metric') || next.querySelector('.semi-metric'))) {
        var toRemove = next;
        next = next.nextElementSibling;
        toRemove.remove();
      }
      old.remove();
    }
    renderSemiStatusBoard();
  }

  function refreshCurrentSemiPage() {
    var page = currentPage();
    if (page.startsWith('半成品')) rebuildSemiTable(page);
  }

  // ============================================================
  //  状态流转操作
  // ============================================================
  function handleSemiAction(action, rowData, page) {
    if (action === '删除') {
      if (!confirm('确定要删除 '+rowData.id+' 吗？此操作不可恢复。')) return;
      var idx = STORE[page].findIndex(function(r){ return r.id === rowData.id; });
      if (idx >= 0) { STORE[page].splice(idx, 1); }
      toast(page+'单号 '+rowData.id+' 已删除', 'success');
      refreshCurrentSemiPage();
      refreshStatusBoard();
      return;
    }

    if (action === '修改') {
      openSemiForm('修改', page, rowData);
      return;
    }

    if (action === '详情' || action === '查看' || action === '查看明细') {
      openSemiForm('详情', page, rowData);
      return;
    }

    if (action === '转样机') {
      var idx = STORE[page].findIndex(function(r){ return r.id === rowData.id; });
      if (idx >= 0) { STORE[page][idx].status = '转样机'; }
      toast(rowData.id+' 已标记为样机，可用于样品管理', 'success');
      refreshCurrentSemiPage();
      refreshStatusBoard();
      return;
    }

    if (action === '退库') {
      // Open 退库 dialog pre-filled
      var inv = getInventory();
      var uc = inv[rowData.materialId] ? inv[rowData.materialId].unitCost : 0;
      var returnData = {
        date: new Date().toISOString().slice(0,10),
        sourceId: rowData.id,
        projectId: rowData.projectId,
        projectName: rowData.projectName,
        materialId: rowData.materialId,
        materialName: rowData.materialName,
        qty: rowData.qty,
        amount: rowData.qty * uc,
        expenseAmt: 0,
        reason: ''
      };
      openSemiForm('新增', '半成品退库', returnData);
      return;
    }

    if (action === '报废') {
      var inv2 = getInventory();
      var uc2 = inv2[rowData.materialId] ? inv2[rowData.materialId].unitCost : 0;
      var scrapData = {
        date: new Date().toISOString().slice(0,10),
        projectId: rowData.projectId,
        materialId: rowData.materialId,
        materialName: rowData.materialName,
        qty: rowData.qty,
        amount: rowData.qty * uc2,
        reason: ''
      };
      openSemiForm('新增', '半成品报废', scrapData);
      return;
    }

    if (action === '费用化结转') {
      if (!confirm('确定将退库单 '+rowData.id+'（金额 ¥'+rowData.amount.toFixed(2)+'）结转至费用化吗？')) return;
      var eid = nextId('半成品费用化');
      STORE['半成品费用化'].push({
        id: eid, date: new Date().toISOString().slice(0,10), projectId: rowData.projectId,
        materialId: rowData.materialId, materialName: rowData.materialName,
        qty: rowData.qty, amount: rowData.expenseAmt || rowData.amount,
        sourceType: '退库', targetSubject: '管理费用-研发费用', status: '已结转', sourceRefId: rowData.id
      });
      toast('退库单 '+rowData.id+' 已结转至费用化（单号：'+eid+'）', 'success');
      refreshCurrentSemiPage();
      refreshStatusBoard();
      return;
    }

    if (action === '撤销') {
      if (!confirm('确定要撤销 '+rowData.id+' 的费用化结转吗？')) return;
      var idx2 = STORE['半成品费用化'].findIndex(function(r){ return r.id === rowData.id; });
      if (idx2 >= 0) { STORE['半成品费用化'][idx2].status = '已撤销'; }
      toast(rowData.id+' 费用化结转已撤销', 'success');
      refreshCurrentSemiPage();
      refreshStatusBoard();
      return;
    }

    toast(action+'操作已完成');
  }

  // ============================================================
  //  行操作事件绑定
  // ============================================================
  function enhanceSemiRowActions(page) {
    document.querySelectorAll('.content [data-act]').forEach(function(btn){
      if (btn.dataset.semiBound) return;
      btn.dataset.semiBound = '1';
      btn.addEventListener('click', function(e){
        e.stopPropagation();
        e.preventDefault();
        var act = this.dataset.act;
        var tr = this.closest('tr');
        if (!tr) return;

        // Find row data by ID
        var cells = tr.querySelectorAll('td');
        var idCell = cells[1]; // first data cell is ID
        if (!idCell) return;
        var rid = idCell.textContent.trim();
        var records = STORE[page] || [];
        var rowData = records.find(function(r){ return r.id === rid; });

        if (rowData) {
          handleSemiAction(act, rowData, page);
        }
      });
    });
  }

  // ============================================================
  //  表格操作按钮 (新增/导出/生成凭证/一键结转等)
  // ============================================================
  function enhanceSemiTableActions(page) {
    var tableActions = document.querySelector('.content .table-actions');
    if (!tableActions || tableActions.dataset.semiActionBound) return;
    tableActions.dataset.semiActionBound = '1';

    tableActions.querySelectorAll('button').forEach(function(btn){
      var clone = btn.cloneNode(true);
      btn.parentNode.replaceChild(clone, btn);
      var text = clone.textContent.trim();

      clone.addEventListener('click', function(e){
        e.stopPropagation();
        e.preventDefault();

        if (text === '新增') {
          openSemiForm('新增', page, null);
        } else if (text === '导出' || text === '导入') {
          toast(page + ' ' + text + '任务已创建，可在「我的导入导出」查看');
        } else if (text === '生成凭证') {
          var records = STORE[page] || [];
          var pendings = records.filter(function(r){ return r.status === '已入库'; });
          toast('已生成 '+pendings.length+' 张凭证并推送至U9系统');
        } else if (text === '一键结转') {
          if (!confirm('确定将所有未结转的退库/报废记录统一结转至费用化吗？')) return;
          var newCount = 0;
          // Process all 退库 without 费用化
          STORE['半成品退库'].forEach(function(r){
            var already = STORE['半成品费用化'].some(function(e){ return e.sourceRefId === r.id && e.status === '已结转'; });
            if (!already && r.expenseAmt > 0) {
              var eid = nextId('半成品费用化');
              STORE['半成品费用化'].push({
                id: eid, date: new Date().toISOString().slice(0,10), projectId: r.projectId,
                materialId: r.materialId, materialName: r.materialName,
                qty: r.qty, amount: r.expenseAmt, sourceType: '退库', targetSubject: '管理费用-研发费用',
                status: '已结转', sourceRefId: r.id
              });
              newCount++;
            }
          });
          toast('一键结转完成，新增 '+newCount+' 笔费用化记录');
          refreshCurrentSemiPage();
          refreshStatusBoard();
        } else if (text === '一键生成台账') {
          toast('台账数据已更新至最新月份');
          refreshCurrentSemiPage();
        } else if (text === '打印') {
          toast('打印任务已发送至打印机');
        }
      });
    });
  }

  // ============================================================
  //  专利 & 知识产权模块 (保持原逻辑)
  // ============================================================
  function openSemiCostDetail(btn) {
    var row = btn.closest('tr');
    var cells = row.querySelectorAll('td');
    var materialName = (cells[5] || cells[4] || {}).innerText || '半成品';
    var amount = (cells[8] || cells[7] || {}).innerText || '0.00';

    var overlayDiv = document.createElement('div');
    overlayDiv.className = 'modal-overlay';
    overlayDiv.onclick = function(e){ if(e.target===overlayDiv) overlayDiv.remove(); };
    overlayDiv.innerHTML = '<div class="modal-panel modal-wide" onclick="event.stopPropagation()" style="width:min(680px, calc(100vw - 48px))">'+
      '<header><h3>半成品成本结构 - '+materialName+'</h3><button class="modal-close" onclick="this.closest(\'.modal-overlay\').remove()">×</button></header>'+
      '<div class="modal-body"><div class="cost-breakdown">'+
      '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:16px">'+
      '<div class="semi-metric"><div class="semi-metric-val" style="color:#006be6">'+amount+'</div><div class="semi-metric-label">入库总金额(元)</div></div>'+
      '<div class="semi-metric"><div class="semi-metric-val" style="color:#ba7517">5</div><div class="semi-metric-label">入库数量(套)</div></div>'+
      '<div class="semi-metric"><div class="semi-metric-val" style="color:#20b26b">7,700.00</div><div class="semi-metric-label">单位成本(元/套)</div></div>'+
      '</div>'+
      '<h4 style="font-size:13px;font-weight:500;margin:0 0 10px">各科目费用拆分（按产量比例推算）</h4>'+
      '<table class="resource-table" style="width:100%"><thead><tr><th>费用科目</th><th>科目编码</th><th>归集金额(元)</th><th>产量占比</th><th>分摊金额(元)</th></tr></thead><tbody>'+
      '<tr><td>人员人工费用</td><td>660201</td><td>18,500.00</td><td>48.05%</td><td>18,500.00</td></tr>'+
      '<tr><td>直接投入费用</td><td>660203</td><td>12,000.00</td><td>31.17%</td><td>12,000.00</td></tr>'+
      '<tr><td>折旧费用</td><td>660204</td><td>5,000.00</td><td>12.99%</td><td>5,000.00</td></tr>'+
      '<tr><td>动力费用</td><td>660205</td><td>2,000.00</td><td>5.19%</td><td>2,000.00</td></tr>'+
      '<tr><td>其他费用</td><td>660206</td><td>1,000.00</td><td>2.60%</td><td>1,000.00</td></tr>'+
      '<tr style="font-weight:500;background:#fafbfc"><td colspan="2">合计</td><td>38,500.00</td><td>100%</td><td>38,500.00</td></tr>'+
      '</tbody></table>'+
      '<div style="margin-top:14px;padding:10px 14px;background:#f7f8fa;border-radius:6px;font-size:12px;color:rgba(50,54,57,.7);line-height:1.8">'+
      '<strong>计算规则说明：</strong><br>① 半成品成本 = Σ(各科目费用 × 该半成品产量占比)<br>② 退库金额 = 单位成本 × 退库数量（按数量直接折算）<br>③ 费用化金额 = 原入库金额 - 退库金额（未退款部分）<br>④ 费用化部分从「研发支出」转入「管理费用-研发费用」</div>'+
      '</div></div>'+
      '<footer style="padding:14px 18px;border-top:1px solid #edf0f5;display:flex;justify-content:flex-end;gap:10px">'+
      '<button class="ghost-btn" onclick="this.closest(\'.modal-overlay\').remove()">关 闭</button>'+
      '<button class="primary-btn" onclick="this.closest(\'.modal-overlay\').remove();window.semiToast(\'成本凭证已生成\')">生成凭证</button></footer></div>';
    document.body.appendChild(overlayDiv);
  }

  function openPatentDetail(btn) {
    var row = btn.closest('tr');
    var cells = row.querySelectorAll('td');
    var title = (cells[1] || {}).innerText || '专利详情';
    var overlayDiv = document.createElement('div');
    overlayDiv.className = 'modal-overlay';
    overlayDiv.onclick = function(e){ if(e.target===overlayDiv) overlayDiv.remove(); };
    overlayDiv.innerHTML = '<div class="modal-panel modal-wide" onclick="event.stopPropagation()" style="width:min(720px, calc(100vw - 48px))">'+
      '<header><h3>'+title+'</h3><button class="modal-close" onclick="this.closest(\'.modal-overlay\').remove()">×</button></header>'+
      '<div class="modal-body">'+
      '<section class="detail-card" style="box-shadow:none;border:1px solid #edf0f5;margin-bottom:14px">'+
      '<h1 style="font-size:16px;margin-bottom:16px">一种基于ERP的研发费用自动归集方法</h1>'+
      '<div class="detail-grid">'+
      '<div class="detail-cell"><label>专利类型</label><p>发明专利</p></div>'+
      '<div class="detail-cell"><label>申请号</label><p>CN202610012345.6</p></div>'+
      '<div class="detail-cell"><label>申请日期</label><p>2026-01-15</p></div>'+
      '<div class="detail-cell"><label>授权日期</label><p>2026-06-10</p></div>'+
      '<div class="detail-cell"><label>专利权人</label><p>大亚金属有限公司</p></div>'+
      '<div class="detail-cell"><label>发明人</label><p>张工、王雁</p></div>'+
      '<div class="detail-cell"><label>法律状态</label><p><span style="display:inline-block;padding:2px 10px;border-radius:10px;background:#e6f7ee;color:#20b26b;font-size:12px">已授权</span></p></div>'+
      '<div class="detail-cell"><label>关联项目</label><p>XM001 学富网</p></div>'+
      '</div>'+
      '<div class="detail-long"><label>技术摘要</label><p>本发明公开了一种基于ERP系统的研发费用自动归集方法，包括：从ERP系统获取研发项目、人员工时、物料领用等原始数据；根据预设的费用归集规则自动将费用分配到对应研发项目和费用科目；生成符合高新技术企业和加计扣除要求的研发费用辅助账。本发明实现了研发费用的自动化、标准化归集，显著降低了人工核算成本。</p></div>'+
      '</section>'+
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">'+
      '<div style="padding:12px;background:#f7f8fa;border-radius:6px;font-size:12px;line-height:1.8"><strong style="color:#323639">IPC分类号</strong><br><span style="color:rgba(50,54,57,.65)">G06Q10/06（资源、工作流管理）<br>G06Q40/00（金融、税务数据处理）</span></div>'+
      '<div style="padding:12px;background:#f7f8fa;border-radius:6px;font-size:12px;line-height:1.8"><strong style="color:#323639">同族专利</strong><br><span style="color:rgba(50,54,57,.65)">PCT/CN2026/078901（国际申请中）</span></div>'+
      '</div></div>'+
      '<footer style="padding:14px 18px;border-top:1px solid #edf0f5;display:flex;justify-content:flex-end;gap:10px">'+
      '<button class="ghost-btn" onclick="this.closest(\'.modal-overlay\').remove()">关 闭</button>'+
      '<button class="ghost-btn" onclick="this.closest(\'.modal-overlay\').remove();window.semiToast(\'专利文档已下载\')">下载专利文档</button>'+
      '<button class="primary-btn" onclick="this.closest(\'.modal-overlay\').remove();window.semiToast(\'年费监控已开启\')">开启年费监控</button></footer></div>';
    document.body.appendChild(overlayDiv);
  }

  function openPatentReport(btn) {
    var row = btn.closest('tr');
    var cells = row.querySelectorAll('td');
    var direction = (cells[2] || {}).innerText || '技术查新';
    var overlayDiv = document.createElement('div');
    overlayDiv.className = 'modal-overlay';
    overlayDiv.onclick = function(e){ if(e.target===overlayDiv) overlayDiv.remove(); };
    overlayDiv.innerHTML = '<div class="modal-panel modal-wide" onclick="event.stopPropagation()" style="width:min(780px, calc(100vw - 48px))">'+
      '<header><h3>专利查新报告 - '+direction+'</h3><button class="modal-close" onclick="this.closest(\'.modal-overlay\').remove()">×</button></header>'+
      '<div class="modal-body">'+
      '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:16px">'+
      '<div class="semi-metric"><div class="semi-metric-val" style="color:#ba7517">中风险</div><div class="semi-metric-label">综合风险评级</div></div>'+
      '<div class="semi-metric"><div class="semi-metric-val" style="color:#006be6">12</div><div class="semi-metric-label">相关专利数量</div></div>'+
      '<div class="semi-metric"><div class="semi-metric-val" style="color:#20b26b">具备改进新颖性</div><div class="semi-metric-label">新颖性判断</div></div>'+
      '</div>'+
      '<h4 style="font-size:13px;font-weight:500;margin:0 0 10px">相关在先专利列表</h4>'+
      '<table class="resource-table" style="width:100%"><thead><tr><th>序号</th><th>专利号</th><th>专利名称</th><th>申请人</th><th>申请日</th><th>相关性</th><th>对比结论</th></tr></thead><tbody>'+
      '<tr><td>1</td><td>CN202110012345.6</td><td>一种制造企业成本分摊系统</td><td>A公司</td><td>2021-03</td><td><span style="color:#d03050">高</span></td><td>技术方案部分重叠，但本方案在产量动态权重方面有改进</td></tr>'+
      '<tr><td>2</td><td>CN202080045678.9</td><td>研发费用智能归集方法及装置</td><td>B公司</td><td>2020-09</td><td><span style="color:#ba7517">中</span></td><td>归集框架相似，但未涉及半成品成本反算逻辑</td></tr>'+
      '<tr><td>3</td><td>CN202260067890.1</td><td>ERP研发辅助账自动生成系统</td><td>C公司</td><td>2022-11</td><td><span style="color:#ba7517">中</span></td><td>报表生成方式不同，本方案采用动态模板引擎</td></tr>'+
      '</tbody></table>'+
      '<div style="margin-top:14px;padding:10px 14px;background:#fff8e6;border:1px solid #ffe0a3;border-radius:6px;font-size:12px;color:#7a4d00;line-height:1.8">'+
      '<strong>建议：</strong>限定技术范围后可以申报，建议重点突出「半成品成本按产量动态反算」和「多系统数据自动抓取」两个差异点。</div>'+
      '</div>'+
      '<footer style="padding:14px 18px;border-top:1px solid #edf0f5;display:flex;justify-content:flex-end;gap:10px">'+
      '<button class="ghost-btn" onclick="this.closest(\'.modal-overlay\').remove()">关 闭</button>'+
      '<button class="ghost-btn" onclick="this.closest(\'.modal-overlay\').remove();window.semiToast(\'查新报告PDF已导出\')">导出PDF</button>'+
      '<button class="primary-btn" onclick="this.closest(\'.modal-overlay\').remove();window.semiToast(\'已启动专利申请流程\')">启动专利申请</button></footer></div>';
    document.body.appendChild(overlayDiv);
  }

  function openIntelDetail(btn) {
    var row = btn.closest('tr');
    var cells = row.querySelectorAll('td');
    var topic = (cells[2] || {}).innerText || '技术情报';
    var overlayDiv = document.createElement('div');
    overlayDiv.className = 'modal-overlay';
    overlayDiv.onclick = function(e){ if(e.target===overlayDiv) overlayDiv.remove(); };
    overlayDiv.innerHTML = '<div class="modal-panel modal-wide" onclick="event.stopPropagation()" style="width:min(780px, calc(100vw - 48px))">'+
      '<header><h3>技术情报分析 - '+topic+'</h3><button class="modal-close" onclick="this.closest(\'.modal-overlay\').remove()">×</button></header>'+
      '<div class="modal-body">'+
      '<div style="margin-bottom:16px"><h4 style="font-size:13px;font-weight:500;margin:0 0 8px">专利趋势分析（近5年）</h4>'+
      '<div style="display:flex;align-items:flex-end;gap:8px;height:120px;padding:16px 0;border-bottom:1px solid #edf0f5">'+
      '<div style="flex:1;text-align:center"><div style="width:100%;height:40px;background:#e8f3ff;border-radius:4px 4px 0 0"></div><span style="font-size:11px;color:rgba(50,54,57,.55)">2022</span></div>'+
      '<div style="flex:1;text-align:center"><div style="width:100%;height:58px;background:#b5d4f4;border-radius:4px 4px 0 0"></div><span style="font-size:11px;color:rgba(50,54,57,.55)">2023</span></div>'+
      '<div style="flex:1;text-align:center"><div style="width:100%;height:76px;background:#85b7eb;border-radius:4px 4px 0 0"></div><span style="font-size:11px;color:rgba(50,54,57,.55)">2024</span></div>'+
      '<div style="flex:1;text-align:center"><div style="width:100%;height:95px;background:#378add;border-radius:4px 4px 0 0"></div><span style="font-size:11px;color:rgba(50,54,57,.55)">2025</span></div>'+
      '<div style="flex:1;text-align:center"><div style="width:100%;height:112px;background:#185fa5;border-radius:4px 4px 0 0"></div><span style="font-size:11px;color:#006be6;font-weight:500">2026</span></div>'+
      '</div><div style="text-align:center;font-size:11px;color:rgba(50,54,57,.55);margin-top:4px">全球专利申请量年增长率 32%</div></div>'+
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">'+
      '<div style="padding:12px;background:#f7f8fa;border-radius:6px;font-size:12px;line-height:1.8"><strong style="color:#323639">竞品分析</strong><br>'+
      '<span style="color:rgba(50,54,57,.65)">• A公司：2025年布局12件相关专利<br>• B公司：2026年初推出新型耐磨合金<br>• C公司：专注稀土合金方向</span></div>'+
      '<div style="padding:12px;background:#f7f8fa;border-radius:6px;font-size:12px;line-height:1.8"><strong style="color:#323639">建议策略</strong><br>'+
      '<span style="color:rgba(50,54,57,.65)">• 差异化定位：聚焦稀土合金+表面处理<br>• 外围专利布局<br>• 定期监控：每季度更新</span></div>'+
      '</div></div>'+
      '<footer style="padding:14px 18px;border-top:1px solid #edf0f5;display:flex;justify-content:flex-end;gap:10px">'+
      '<button class="ghost-btn" onclick="this.closest(\'.modal-overlay\').remove()">关 闭</button>'+
      '<button class="ghost-btn" onclick="this.closest(\'.modal-overlay\').remove();window.semiToast(\'已订阅情报更新\')">订阅更新</button>'+
      '<button class="primary-btn" onclick="this.closest(\'.modal-overlay\').remove();window.semiToast(\'分析报告已导出\')">导出报告</button></footer></div>';
    document.body.appendChild(overlayDiv);
  }

  // ============================================================
  //  页面增强入口
  // ============================================================
  function enhanceSemiProductPage() {
    var page = currentPage();
    if (!page.startsWith('半成品') && !page.startsWith('专利') && page !== '情报分析') return;

    if (page.startsWith('半成品')) {
      renderSemiStatusBoard();
      // 替换表格为动态数据
      setTimeout(function(){
        rebuildSemiTable(page);
        enhanceSemiTableActions(page);
      }, 80);
    }

    // 知识产权页面事件
    if (page.startsWith('专利') || page === '情报分析') {
      setTimeout(function(){
        // bind row actions
        document.querySelectorAll('.content [data-act]').forEach(function(btn){
          if (btn.dataset.ipBound) return;
          btn.dataset.ipBound = '1';
          btn.addEventListener('click', function(e){
            e.stopPropagation();
            var act = this.dataset.act || this.textContent.trim();
            if (act === '详情' && page.startsWith('专利')) openPatentDetail(this);
            else if (act === '报告') openPatentReport(this);
            else if (act === '采纳') toast('已采纳推荐');
            else if (act === '忽略') toast('已忽略该推荐');
          });
        });

        // IP table action buttons
        document.querySelectorAll('.content .table-actions button').forEach(function(btn){
          if (btn.dataset.ipActBound) return;
          btn.dataset.ipActBound = '1';
          var text = btn.textContent.trim();
          var msgMap = {
            '新增':'已打开新增表单','导出':'导出任务已创建','导入':'请选择导入文件','批量检索':'批量专利检索任务已提交',
            '新建查新':'专利查新任务已创建','批量查新':'批量查新任务已提交','导出报告':'分析报告已导出',
            '智能推荐':null,'新建分析':'情报分析任务已创建','订阅更新':'已订阅技术情报更新'
          };
          btn.addEventListener('click', function(){
            if (text === '智能推荐') {
              toast('AI智能推荐已启动，正在分析项目成果...');
              setTimeout(function(){ toast('推荐完成！已为2个项目匹配了合适的专利类型'); }, 1500);
            } else {
              toast(msgMap[text] || text+'操作已完成');
            }
          });
        });
      }, 150);
    }
  }

  // 挂载到 window
  window.openSemiCostDetail = openSemiCostDetail;
  window.openPatentDetail = openPatentDetail;
  window.openPatentReport = openPatentReport;
  window.openIntelDetail = openIntelDetail;

  // ============================================================
  //  监听页面切换
  // ============================================================
  function observeContent() {
    var content = document.querySelector('.content');
    if (!content) return;
    var obs = new MutationObserver(function(){
      enhanceSemiProductPage();
    });
    obs.observe(content, { childList: true, subtree: true });
  }

  document.addEventListener('DOMContentLoaded', function(){
    observeContent();
    setTimeout(enhanceSemiProductPage, 300);
  });

  document.addEventListener('click', function(e){
    var btn = e.target.closest('[data-page]');
    if (!btn) return;
    var page = btn.dataset.page;
    if (page && (page.startsWith('半成品') || page.startsWith('专利') || page === '情报分析')) {
      setTimeout(enhanceSemiProductPage, 400);
    }
  });
})();
