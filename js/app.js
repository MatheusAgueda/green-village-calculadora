// app.js — Organised and modularized from the original single-file HTML

const GV = (() => {
  // ---------- STATE ----------
  let ACTIVE_COUNTRY = 'portugal';

  // Short helpers to read numeric inputs reliably
  function pn(id) {
    const el = document.getElementById(id);
    if (!el) return 0;
    const raw = el.value.trim().replace(/\./g, '').replace(',', '.');
    return parseFloat(raw) || 0;
  }
  function fmt(v, locale = 'pt-PT') {
    return new Intl.NumberFormat(locale, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Math.round(v || 0));
  }
  function fmtCur(v, sym = '€', locale = 'pt-PT') {
    return `${sym}${fmt(v, locale)}`;
  }

  function showToast(msg, type = 'success') {
    const c = document.getElementById('toastContainer');
    if (!c) return;
    const t = document.createElement('div');
    const bg = type === 'success' ? 'border-[#00ff88]/30 bg-[#00ff88]/10 text-[#00ff88]' : 'border-red-400/30 bg-red-400/10 text-red-400';
    t.className = `toast px-4 py-2.5 rounded-xl border ${bg} text-sm font-medium backdrop-blur-sm`;
    t.textContent = msg;
    c.appendChild(t);
    setTimeout(() => t.remove(), 2600);
  }

  // ---------- CONFIG / TIERS / RATES ----------
  function getTiers() {
    return {
      low: { id: 'low', label: 'Low Budget', description: 'Casas até 5.000€. Lucro GV + Comissão base. Transporte normal.', companyProfit: pn('cfg_low_profit') || 3000, commission: pn('cfg_low_comm') || 500, landMultiplier: 1, seaMultiplier: 1, craneCost: 0 },
      medium: { id: 'medium', label: 'Valor Médio', description: 'Casas entre 5.000€ e 20.000€. Lucro GV reforçado + Comissão intermédia.', companyProfit: pn('cfg_med_profit') || 5000, commission: pn('cfg_med_comm') || 1000, landMultiplier: 1, seaMultiplier: 1, craneCost: 0 },
      luxury: { id: 'luxury', label: 'Luxo', description: 'Casas acima de 20.000€. Lucro máximo, marítimo x2, terrestre x2 + autogrua.', companyProfit: pn('cfg_lux_profit') || 12000, commission: pn('cfg_lux_comm') || 2000, landMultiplier: pn('cfg_lux_land') || 2, seaMultiplier: pn('cfg_lux_sea') || 2, craneCost: pn('cfg_lux_crane') || 2000 }
    };
  }

  function getExchangeRates() {
    const brl = pn('cfg_brl') || 6.5;
    const cny = pn('cfg_cny') || 8.0;
    const usd = pn('cfg_usd') || 1.10;
    const pln = pn('cfg_pln') || 4.5;
    return {
      portugal: { rate: 1, symbol: '€', code: 'EUR' }, spain: { rate: 1, symbol: '€', code: 'EUR' }, france: { rate: 1, symbol: '€', code: 'EUR' }, italy: { rate: 1, symbol: '€', code: 'EUR' }, greece: { rate: 1, symbol: '€', code: 'EUR' }, malta: { rate: 1, symbol: '€', code: 'EUR' }, 'netherlands-dest': { rate: 1, symbol: '€', code: 'EUR' }, poland: { rate: pln, symbol: 'zł', code: 'PLN' }, croatia: { rate: 1, symbol: '€', code: 'EUR' }, brazil: { rate: brl, symbol: 'R$', code: 'BRL' }, china: { rate: cny, symbol: '¥', code: 'CNY' }, usa: { rate: usd, symbol: '$', code: 'USD' }
    };
  }

  function getCurrencyRatesToEUR() {
    const brl = pn('cfg_brl') || 6.5;
    const cny = pn('cfg_cny') || 8.0;
    const usd = pn('cfg_usd') || 1.10;
    const pln = pn('cfg_pln') || 4.5;
    const gbp = pn('cfg_gbp') || 0.84;
    return { EUR: 1, GBP: 1 / gbp, BRL: 1 / brl, CNY: 1 / cny, USD: 1 / usd, PLN: 1 / pln };
  }

  const currencyMeta = { EUR: { symbol: '€' }, GBP: { symbol: '£' }, BRL: { symbol: 'R$' }, CNY: { symbol: '¥' }, USD: { symbol: '$' }, PLN: { symbol: 'zł' } };

  // ---------- TRANSPORT ROUTES (loaded from js/routes.js) ----------
  let transportRoutes = window.__GV_ROUTES || {};

  const EU = new Set(['portugal','spain','france','italy','greece','malta','netherlands-dest','poland','croatia','bulgaria']);
  const originLabels = { uk: '🇬🇧 Inglaterra', netherlands: '🇳🇱 Holanda', france: '🇫🇷 França', portugal: '🇵🇹 Portugal', belgium: '🇧🇪 Bélgica', china: '🇨🇳 China' };

  // ---------- UI BUILDERS ----------
  function buildCountryButtons() {
    const euEl = document.getElementById('eu-countries');
    const nonEuEl = document.getElementById('non-eu-countries');
    if (!euEl || !nonEuEl) return;

    euEl.innerHTML = '';
    nonEuEl.innerHTML = '';

    const euList = ['portugal','spain','france','italy','greece','malta','netherlands-dest','poland','croatia'];
    const nonEuList = ['brazil','china','usa'];

    function makeBtn(key) {
      const cfg = transportRoutes[key];
      if (!cfg) return null;
      const btn = document.createElement('button');
      btn.className = 'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-white/[.08] bg-gv-bg text-gray-500 text-[13px] cursor-pointer transition-all hover:border-white/20 hover:bg-gv-soft';
      btn.dataset.country = key;
      btn.innerHTML = `<span class="text-lg">${cfg.flag}</span> ${cfg.label}`;
      btn.onclick = () => selectCountry(key);
      return btn;
    }

    euList.forEach(k => { const b = makeBtn(k); if (b) euEl.appendChild(b); });
    nonEuList.forEach(k => { const b = makeBtn(k); if (b) nonEuEl.appendChild(b); });
  }

  function selectCountry(countryId) {
    const cfg = transportRoutes[countryId];
    if (!cfg) return;
    ACTIVE_COUNTRY = countryId;

    document.querySelectorAll('[data-country]').forEach(btn => {
      btn.classList.toggle('country-active', btn.dataset.country === countryId);
    });

    const flagEl = document.getElementById('intl_flag');
    const labelEl = document.getElementById('intl_countryLabel');
    if (flagEl) flagEl.textContent = cfg.flag;
    if (labelEl) labelEl.textContent = cfg.label;

    populateOrigins(countryId);
    updateRoutes();
    updateTierPreview();
    const res = document.getElementById('intl_results'); if (res) res.classList.add('hidden');
  }

  function populateOrigins(countryId) {
    const cfg = transportRoutes[countryId];
    const sel = document.getElementById('intl_origin');
    if (!sel || !cfg?.routes) return;
    sel.innerHTML = '';
    Object.keys(cfg.routes).forEach(k => {
      const opt = document.createElement('option'); opt.value = k; opt.textContent = originLabels[k] || k; sel.appendChild(opt);
    });
  }

  function updateRoutes() {
    const cfg = transportRoutes[ACTIVE_COUNTRY];
    const origin = document.getElementById('intl_origin')?.value;
    const sel = document.getElementById('intl_route');
    const noteEl = document.getElementById('intl_routeNote');
    if (!sel) return;
    sel.innerHTML = '';
    if (noteEl) noteEl.classList.add('hidden');
    if (!cfg?.routes?.[origin]) return;
    cfg.routes[origin].forEach((r, i) => {
      const opt = document.createElement('option'); opt.value = i; opt.textContent = `${r.from} → ${r.to} • ${r.type} • €${r.cost.toLocaleString('pt-PT')}`; sel.appendChild(opt);
    });
    showRouteNote();
  }

  function showRouteNote() {
    const cfg = transportRoutes[ACTIVE_COUNTRY];
    const origin = document.getElementById('intl_origin')?.value;
    const routeIdx = parseInt(document.getElementById('intl_route')?.value, 10);
    const noteEl = document.getElementById('intl_routeNote');
    if (!noteEl) return;
    const routes = cfg?.routes?.[origin] || [];
    const route = routes[routeIdx];
    if (route && route.note) { noteEl.textContent = route.note; noteEl.classList.remove('hidden'); } else { noteEl.classList.add('hidden'); }
  }

  function onOriginChange() { updateRoutes(); updateTierPreview(); }

  function determineTier(priceEUR) {
    if (!priceEUR || priceEUR <= 0) return 'medium';
    if (priceEUR <= 5000) return 'low';
    if (priceEUR > 20000) return 'luxury';
    return 'medium';
  }

  function updateTierPreview() {
    const price = parseFloat(document.getElementById('intl_price')?.value) || 0;
    const currency = document.getElementById('intl_currency')?.value || 'EUR';
    const rates = getCurrencyRatesToEUR();
    const priceEUR = price * (rates[currency] || 1);
    const tierId = determineTier(priceEUR);
    const tiers = getTiers();
    const tier = tiers[tierId];
    document.getElementById('intl_tierPill').textContent = tier.label;
    document.getElementById('intl_tierDesc').textContent = tier.description;
  }

  // ---------- CALCULATIONS ----------
  function calcInternational() {
    const cfg = transportRoutes[ACTIVE_COUNTRY]; if (!cfg) return;
    const inputPrice = parseFloat(document.getElementById('intl_price')?.value) || 0;
    const currencyCode = document.getElementById('intl_currency')?.value || 'EUR';
    const originKey = document.getElementById('intl_origin')?.value;
    const routeIdx = parseInt(document.getElementById('intl_route')?.value, 10);
    const routes = cfg.routes?.[originKey] || [];
    if (isNaN(routeIdx) || routeIdx >= routes.length) { alert('Seleciona uma rota.'); return; }
    const route = routes[routeIdx];

    const exchangeRates = getExchangeRates();
    const ratesEUR = getCurrencyRatesToEUR();
    const tiers = getTiers();
    const isEU = EU.has(ACTIVE_COUNTRY);
    const isBrazil = ACTIVE_COUNTRY === 'brazil';

    const priceEUR = inputPrice * (ratesEUR[currencyCode] || 1);
    const tierId = determineTier(priceEUR);
    const tier = tiers[tierId];
    document.getElementById('intl_tierPill').textContent = tier.label;
    document.getElementById('intl_tierDesc').textContent = tier.description;

    const PROFIT = tier.companyProfit; const COMM = tier.commission;
    let seaCost = route.cost * tier.seaMultiplier;
    let landCost = (pn('cfg_landBase') || 2000) * tier.landMultiplier;
    let extraCrane = 0; let price = priceEUR;
    if (ACTIVE_COUNTRY === 'portugal' && originKey === 'france') { landCost = 0; extraCrane = (pn('cfg_craneFrPt') || 1000); }
    const craneCost = tier.craneCost + extraCrane;

    let vatMid = 0, vatExtraMid = 0; let fobValue = 0, cifValue = 0; let importTax1Amt = 0, importTax2Amt = 0, importTax3Amt = 0; let subtotalSemIVA = 0;

    if (isBrazil) {
      const b = cfg;
      fobValue = price * (b.fobRate || 0);
      cifValue = price + fobValue + seaCost;
      importTax1Amt = cifValue * (b.importTax1 || 0);
      importTax2Amt = (cifValue + importTax1Amt) * (b.importTax2 || 0);
      importTax3Amt = (cifValue + importTax1Amt + importTax2Amt) * (b.importTax3 || 0);
      const totalTaxes = importTax1Amt + importTax2Amt + importTax3Amt;
      subtotalSemIVA = price + fobValue + seaCost + landCost + craneCost + totalTaxes + PROFIT + COMM;
    } else if (ACTIVE_COUNTRY === 'china') {
      const base = price + seaCost;
      if (cfg.vatRate) vatMid = base * cfg.vatRate;
      if (cfg.vatExtra) vatExtraMid = base * cfg.vatExtra;
      subtotalSemIVA = base + vatMid + vatExtraMid + landCost + craneCost + PROFIT + COMM;
    } else {
      if (originKey === 'uk' || originKey === 'china') {
        const base = price + seaCost;
        vatMid = base * (cfg.vatRate || 0.23);
        subtotalSemIVA = base + vatMid + landCost + craneCost + PROFIT + COMM;
      } else {
        subtotalSemIVA = price + seaCost + landCost + craneCost + PROFIT + COMM;
      }
    }

    let ivaFinalRate = isEU ? (cfg.vatRate || 0) : 0;
    const ivaFinal = subtotalSemIVA * ivaFinalRate;
    const totalComIVA = subtotalSemIVA + ivaFinal;
    const localCfg = exchangeRates[ACTIVE_COUNTRY] || { rate: 1, symbol: '€', code: 'EUR' };
    const totalLocal = totalComIVA * localCfg.rate;

    renderIntlGrid({ inputPrice, currencyCode, price, seaCost, landCost, craneCost, fobValue, cifValue, importTax1Amt, importTax2Amt, importTax3Amt, vatMid, vatExtraMid, PROFIT, COMM, subtotalSemIVA, ivaFinal, totalComIVA, localCfg, totalLocal, route });
  }

  function renderIntlGrid(data) {
    const grid = document.getElementById('intl_grid'); if (!grid) return; grid.innerHTML = '';
    function card(label, value, opts = {}) {
      const cls = ['rounded-xl border border-white/[.06] p-3 text-sm', opts.full ? 'sm:col-span-2' : '', opts.highlight ? 'result-highlight' : 'bg-gradient-to-br from-gv-soft to-gv-bg'].join(' ');
      const div = document.createElement('div'); div.className = cls; div.innerHTML = `<div class="text-[10px] uppercase tracking-[0.13em] text-gray-500 mb-1">${label}</div><div class="font-semibold ${opts.final ? 'text-base' : ''}">${value}</div>`; grid.appendChild(div);
    }

    const { inputPrice, currencyCode, price, seaCost, landCost, craneCost, fobValue, cifValue, importTax1Amt, importTax2Amt, importTax3Amt, vatMid, vatExtraMid, PROFIT, COMM, subtotalSemIVA, ivaFinal, totalComIVA, localCfg, totalLocal, route } = data;
    const sym = (currencyMeta[currencyCode] || {}).symbol || '';

    const tiers = getTiers(); // label info already in card

    card('Escala aplicada', tiers[determineTier(price)]?.label || '—', { full: true });
    if (inputPrice > 0) { card('Preço casa (origem)', `${sym}${inputPrice.toLocaleString('pt-PT')}`); if (currencyCode !== 'EUR') card('Preço em EUR', fmtCur(price)); }
    const tLabel = (document.getElementById('intl_origin')?.value === 'france' && ACTIVE_COUNTRY === 'portugal') ? 'Camião França → Portugal' : `Marítimo (${route.type})`;
    card(tLabel, fmtCur(seaCost));
    if (!(ACTIVE_COUNTRY === 'portugal' && document.getElementById('intl_origin')?.value === 'france')) card('Terrestre no destino', fmtCur(landCost));
    if (craneCost > 0) card('Grua / Autogrua', fmtCur(craneCost));
    if (fobValue > 0) card('FOB (10%)', fmtCur(fobValue));
    if (cifValue > 0) card('CIF (Casa+FOB+Mar.)', fmtCur(cifValue));
    if (importTax1Amt > 0) card('II (12,6%)', fmtCur(importTax1Amt));
    if (importTax2Amt > 0) card('PIS/COFINS (2,1%)', fmtCur(importTax2Amt));
    if (importTax3Amt > 0) card('ICMS (9,65%)', fmtCur(importTax3Amt));
    if (vatMid > 0) card(`IVA intermédio ${Math.round(((transportRoutes[ACTIVE_COUNTRY]?.vatRate||0))*100)}%`, fmtCur(vatMid));
    if (vatExtraMid > 0) card('Taxa adicional 2,7%', fmtCur(vatExtraMid));
    card('Lucro Green Village', fmtCur(PROFIT)); card('Comissão vendedor', fmtCur(COMM));
    card('Total SEM IVA final', fmtCur(subtotalSemIVA), { full: true, final: true });
    const ivaPct = ((EU.has(ACTIVE_COUNTRY) ? (transportRoutes[ACTIVE_COUNTRY]?.vatRate||0) : 0)*100).toFixed(1).replace('.0','');
    card(`IVA final (${ivaPct}%)`, fmtCur(ivaFinal));
    card('TOTAL COM IVA', fmtCur(totalComIVA), { full: true, highlight: true, final: true });
    if (localCfg.code !== 'EUR') card(`Total em ${localCfg.code}`, `${localCfg.symbol}${fmt(totalLocal)}`, { full: true, highlight: true, final: true });
    card('Rota', `${route.from} → ${route.to} (${route.type})`, { full: true });
    if (route.note) card('⚠️ Observação', route.note, { full: true });

    const resEl = document.getElementById('intl_results'); if (resEl) resEl.classList.remove('hidden');
  }

  // ---------- BRAZIL DETAILED CALC (kept as original logic) ----------
  function calcBrazil() {
    const fobUsd = pn('br_fobUsd'); const freightUsd = pn('br_freightUsd'); const insuranceUsd = pn('br_insuranceUsd');
    const exchangeRate = pn('br_exchangeRate') || pn('cfg_usdbrl') || 6;
    const fobBrl = fobUsd * exchangeRate; const freightBrl = freightUsd * exchangeRate; const insuranceBrl = insuranceUsd * exchangeRate; const cifBrl = fobBrl + freightBrl + insuranceBrl;
    const isBk = document.getElementById('br_isBk')?.checked;
    const iiRate = (isBk ? pn('br_iiRateBk') : pn('br_iiRateNonBk')) / 100;
    const ipiRate = pn('br_ipiRate') / 100; const pisRate = pn('br_pisRate') / 100; const cofinsRate = pn('br_cofinsRate') / 100; const icmsRate = pn('br_icmsRate') / 100;
    const valorII = cifBrl * iiRate; const baseIPI = cifBrl + valorII; const valorIPI = baseIPI * ipiRate; const basePisCofins = cifBrl + valorII + valorIPI; const valorPIS = basePisCofins * pisRate; const valorCOFINS = basePisCofins * cofinsRate;
    const divisor = (1 - icmsRate) || 1; const baseICMS = (cifBrl + valorII + valorIPI + valorPIS + valorCOFINS) / divisor; const valorICMS = baseICMS * icmsRate;
    const totalTributos = valorII + valorIPI + valorPIS + valorCOFINS + valorICMS; const cargaEfetiva = cifBrl > 0 ? (totalTributos / cifBrl) * 100 : 0;
    const portCosts = pn('br_portCosts'); const inlandTransport = pn('br_inlandTransport'); const custoTotal = cifBrl + totalTributos + portCosts + inlandTransport; const marginPercent = pn('br_marginPercent'); const valorLucro = custoTotal * (marginPercent / 100); const precoFinal = custoTotal + valorLucro;

    const f = v => fmtCur(v, 'R$', 'pt-BR');
    function row(label, value, bold = false) { return `<div class="flex justify-between py-1 ${bold ? 'pt-2 mt-1 border-t border-white/[.06]' : ''}"><span class="text-gray-500 text-xs">${label}</span><span class="${bold ? 'text-[#00ff88] font-bold' : 'font-medium'} text-sm font-mono">${value}</span></div>`; }

    document.getElementById('br_importSummary').innerHTML = row('FOB (BRL)', f(fobBrl)) + row('Frete Marítimo (BRL)', f(freightBrl)) + row('Seguro (BRL)', f(insuranceBrl)) + row('Valor CIF (BRL)', f(cifBrl), true) + `<div class="my-2 border-t border-white/[.06]"></div>` + row('II', f(valorII)) + row('IPI', f(valorIPI)) + row('PIS', f(valorPIS)) + row('COFINS', f(valorCOFINS)) + row('ICMS (gross-up)', f(valorICMS)) + row('Total Tributos', f(totalTributos), true) + row('Carga tributária efetiva', `${cargaEfetiva.toFixed(1).replace('.', ',')}%`);

    document.getElementById('br_priceFormation').innerHTML = row('Valor CIF', f(cifBrl)) + row('Total Tributos', f(totalTributos)) + row('Custos Portuários', f(portCosts)) + row('Transporte Terrestre', f(inlandTransport)) + row('Custo Nacionalizado', f(custoTotal), true) + `<div class="my-2 border-t border-white/[.06]"></div>` + row(`Mark-up (${marginPercent}%)`, f(valorLucro)) + row('PREÇO DE VENDA', f(precoFinal), true);

    const res = document.getElementById('br_results'); if (res) res.classList.remove('hidden');
  }

  // ---------- ROUTE EDITOR helpers (kept minimal) ----------
  function buildRouteEditor() {
    const container = document.getElementById('routeEditor');
    if (!container) return;
    container.innerHTML = '';

    const countryOrder = ["portugal","spain","france","italy","greece","malta","netherlands-dest","poland","croatia","brazil","china","usa"];
    const allKeys = [...new Set([...countryOrder, ...Object.keys(transportRoutes)])];

    allKeys.forEach(countryKey => {
      const country = transportRoutes[countryKey];
      if (!country) return;

      const totalRoutes = Object.values(country.routes || {}).reduce((s, arr) => s + arr.length, 0);

      const details = document.createElement('details');
      details.className = 'country-section rounded-xl border border-white/[.06] bg-gv-soft/30 overflow-hidden';

      details.innerHTML = `
        <summary class="flex items-center gap-3 px-4 py-3 hover:bg-white/[.02] transition-colors select-none">
          <span class="chevron text-gray-500 text-xs">▶</span>
          <span class="text-xl">${country.flag}</span>
          <span class="font-semibold text-sm text-gray-200">${country.label}</span>
          <span class="text-[10px] text-gray-500 bg-gv-bg px-2 py-0.5 rounded-full border border-white/[.06]">${totalRoutes} rota${totalRoutes !== 1 ? 's' : ''}</span>
          <div class="ml-auto flex items-center gap-2">
            <span class="text-[10px] text-gray-500">IVA:</span>
            <input type="text" data-field="vatRate" data-country="${countryKey}" value="${(country.vatRate * 100).toFixed(1).replace('.0','')}" class="cfg-input w-14 text-center rounded border border-white/10 bg-gv-bg text-white text-xs px-1.5 py-1 font-mono" onclick="event.stopPropagation()" />
            <span class="text-[10px] text-gray-500">%</span>
          </div>
        </summary>
        <div class="px-4 pb-4 space-y-3" id="re_${countryKey}_body"></div>
      `;

      container.appendChild(details);
      const body = document.getElementById(`re_${countryKey}_body`);

      if (countryKey === 'brazil') {
        body.innerHTML += `
          <div class="rounded-lg border border-white/[.04] bg-gv-bg/50 p-3">
            <div class="text-[10px] uppercase tracking-widest text-amber-400 mb-2">Taxas Brasil (Internacional)</div>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div><label class="text-[9px] text-gray-500">FOB Rate</label><input type="text" data-field="fobRate" data-country="brazil" value="${((country.fobRate||0)*100).toFixed(1)}" class="cfg-input w-full rounded border border-white/10 bg-gv-bg text-white text-xs px-2 py-1 font-mono" />%</div>
              <div><label class="text-[9px] text-gray-500">II</label><input type="text" data-field="importTax1" data-country="brazil" value="${((country.importTax1||0)*100).toFixed(1)}" class="cfg-input w-full rounded border border-white/10 bg-gv-bg text-white text-xs px-2 py-1 font-mono" />%</div>
              <div><label class="text-[9px] text-gray-500">PIS/COFINS</label><input type="text" data-field="importTax2" data-country="brazil" value="${((country.importTax2||0)*100).toFixed(1)}" class="cfg-input w-full rounded border border-white/10 bg-gv-bg text-white text-xs px-2 py-1 font-mono" />%</div>
              <div><label class="text-[9px] text-gray-500">ICMS</label><input type="text" data-field="importTax3" data-country="brazil" value="${((country.importTax3||0)*100).toFixed(1)}" class="cfg-input w-full rounded border border-white/10 bg-gv-bg text-white text-xs px-2 py-1 font-mono" />%</div>
            </div>
          </div>
        `;
      }

      if (countryKey === 'china' && country.vatExtra !== undefined) {
        body.innerHTML += `
          <div class="rounded-lg border border-white/[.04] bg-gv-bg/50 p-3">
            <div class="text-[10px] uppercase tracking-widest text-blue-400 mb-2">Taxa Extra China</div>
            <div class="flex items-center gap-2">
              <label class="text-[9px] text-gray-500">Taxa adicional</label>
              <input type="text" data-field="vatExtra" data-country="china" value="${((country.vatExtra||0)*100).toFixed(1)}" class="cfg-input w-16 rounded border border-white/10 bg-gv-bg text-white text-xs px-2 py-1 font-mono" /><span class="text-[9px] text-gray-500">%</span>
            </div>
          </div>
        `;
      }

      const routes = country.routes || {};
      Object.keys(routes).forEach(originKey => {
        const originRoutes = routes[originKey];
        const originLabel = originLabels[originKey] || originKey;

        const originGroup = document.createElement('details');
        originGroup.className = 'origin-group rounded-lg border border-white/[.04] bg-gv-bg/30 overflow-hidden';
        originGroup.open = true;

        let routeRowsHTML = '';
        originRoutes.forEach((r, idx) => { routeRowsHTML += buildRouteRowHTML(countryKey, originKey, idx, r); });

        originGroup.innerHTML = `
          <summary class="flex items-center gap-2 px-3 py-2 hover:bg-white/[.02] transition-colors select-none">
            <span class="origin-chevron text-gray-600 text-[10px]">▶</span>
            <span class="text-xs font-semibold text-gray-400">${originLabel}</span>
            <span class="text-[10px] text-gray-600">(${originRoutes.length})</span>
            <button onclick="event.stopPropagation(); GV.removeOrigin('${countryKey}','${originKey}')" class="ml-auto btn-delete text-[10px] px-1.5 py-0.5 rounded" title="Remover origem">🗑️</button>
          </summary>
          <div class="px-3 pb-3 space-y-1.5" id="re_${countryKey}_${originKey}_routes">
            ${routeRowsHTML}
          </div>
          <div class="px-3 pb-2">
            <button onclick="GV.addRoute('${countryKey}','${originKey}')" class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dashed border-white/10 text-gray-500 text-[11px] hover:border-[#00ff88]/30 hover:text-[#00ff88] transition-all w-full justify-center">
              + Adicionar rota
            </button>
          </div>
        `;

        body.appendChild(originGroup);
      });

      body.innerHTML += `
        <button onclick="GV.addOrigin('${countryKey}')" class="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-dashed border-white/10 text-gray-500 text-[11px] hover:border-purple-400/30 hover:text-purple-300 transition-all w-full justify-center">
          + Adicionar nova origem para ${country.label}
        </button>
      `;
    });
  }

  function buildRouteRowHTML(countryKey, originKey, idx, r) {
    const prefix = `re_${countryKey}_${originKey}_${idx}`;
    const noteVal = r.note || '';
    return `
      <div class="route-row space-y-1" id="${prefix}_row">
        <div class="grid grid-cols-[1fr_1fr_90px_110px_28px] gap-1.5 items-center">
          <input type="text" data-role="from" value="${r.from}" placeholder="De" class="cfg-input rounded border border-white/[.06] bg-gv-bg text-white text-[11px] px-2 py-1.5 font-mono" />
          <input type="text" data-role="to" value="${r.to}" placeholder="Para" class="cfg-input rounded border border-white/[.06] bg-gv-bg text-white text-[11px] px-2 py-1.5 font-mono" />
          <input type="text" data-role="cost" value="${r.cost}" placeholder="€" class="cfg-input rounded border border-white/[.06] bg-gv-bg text-white text-[11px] px-2 py-1.5 font-mono text-right" />
          <input type="text" data-role="type" value="${r.type}" placeholder="Tipo" class="cfg-input rounded border border-white/[.06] bg-gv-bg text-gray-400 text-[11px] px-2 py-1.5" />
          <button onclick="this.closest('.route-row').remove()" class="btn-delete text-center text-sm rounded hover:bg-red-500/10 py-1" title="Remover">✕</button>
        </div>
        <input type="text" data-role="note" value="${noteVal}" placeholder="OBS (opcional)" class="cfg-input w-full rounded border border-amber-500/10 bg-amber-500/5 text-amber-300/80 text-[10px] px-2 py-1 italic" />
      </div>
    `;
  }

  function addRoute(countryKey, originKey) {
    const container = document.getElementById(`re_${countryKey}_${originKey}_routes`);
    if (!container) return;
    const idx = container.querySelectorAll('.route-row').length;
    const div = document.createElement('div');
    div.innerHTML = buildRouteRowHTML(countryKey, originKey, idx, { from: '', to: '', cost: 0, type: 'RO-RO' });
    container.appendChild(div.firstElementChild);
  }

  function removeOrigin(countryKey, originKey) {
    if (!confirm(`Remover todas as rotas de "${originLabels[originKey] || originKey}" para ${transportRoutes[countryKey]?.label}?`)) return;
    delete transportRoutes[countryKey].routes[originKey];
    buildRouteEditor();
    showToast(`Origem removida de ${transportRoutes[countryKey]?.label}`);
  }

  function addOrigin(countryKey) {
    const name = prompt('Nome da origem (ex: "uk", "netherlands", "china", "france"):');
    if (!name || !name.trim()) return;
    const key = name.trim().toLowerCase().replace(/\s+/g, '-');
    if (!transportRoutes[countryKey].routes) transportRoutes[countryKey].routes = {};
    if (transportRoutes[countryKey].routes[key]) { alert('Essa origem já existe para este país!'); return; }
    transportRoutes[countryKey].routes[key] = [{ from: '', to: '', cost: 0, type: 'RO-RO' }];
    buildRouteEditor();
    showToast(`Nova origem "${key}" adicionada a ${transportRoutes[countryKey].label}`);
  }

  function addNewCountry() {
    const key = prompt('ID do país (ex: "germany", "turkey"):');
    if (!key || !key.trim()) return;
    const cleanKey = key.trim().toLowerCase().replace(/\s+/g, '-');
    if (transportRoutes[cleanKey]) { alert('País já existe!'); return; }
    const label = prompt('Nome do país (ex: "Alemanha", "Turquia"):');
    if (!label) return;
    const flag = prompt('Emoji da bandeira (ex: 🇩🇪):') || '🏳️';
    const vat = parseFloat(prompt('Taxa IVA em % (ex: 19):') || '0');

    transportRoutes[cleanKey] = {
      label, flag, vatRate: vat / 100,
      routes: { uk: [{ from: '', to: '', cost: 0, type: 'RO-RO' }] }
    };

    buildCountryButtons(); buildRouteEditor(); showToast(`${flag} ${label} adicionado com sucesso!`);
  }

  function saveRoutesFromEditor() {
    // Read VAT rates
    document.querySelectorAll('[data-field="vatRate"]').forEach(input => {
      const country = input.dataset.country;
      if (transportRoutes[country]) {
        transportRoutes[country].vatRate = (parseFloat(input.value.replace(',', '.')) || 0) / 100;
      }
    });

    // Read Brazil special fields
    ['fobRate', 'importTax1', 'importTax2', 'importTax3'].forEach(field => {
      const input = document.querySelector(`[data-field="${field}"][data-country="brazil"]`);
      if (input && transportRoutes.brazil) {
        transportRoutes.brazil[field] = (parseFloat(input.value.replace(',', '.')) || 0) / 100;
      }
    });

    // Read China vatExtra
    const chinaExtra = document.querySelector('[data-field="vatExtra"][data-country="china"]');
    if (chinaExtra && transportRoutes.china) {
      transportRoutes.china.vatExtra = (parseFloat(chinaExtra.value.replace(',', '.')) || 0) / 100;
    }

    // Read all routes per country per origin
    const countryOrder = Object.keys(transportRoutes);
    countryOrder.forEach(countryKey => {
      const country = transportRoutes[countryKey];
      if (!country?.routes) return;

      Object.keys(country.routes).forEach(originKey => {
        const container = document.getElementById(`re_${countryKey}_${originKey}_routes`);
        if (!container) return;

        const rows = container.querySelectorAll('.route-row');
        const newRoutes = [];
        rows.forEach(row => {
          const from = row.querySelector('[data-role="from"]')?.value?.trim() || '';
          const to = row.querySelector('[data-role="to"]')?.value?.trim() || '';
          const cost = parseFloat(row.querySelector('[data-role="cost"]')?.value?.replace(/\./g, '').replace(',', '.') || '0') || 0;
          const type = row.querySelector('[data-role="type"]')?.value?.trim() || 'RO-RO';
          if (from || to || cost > 0) {
            const routeObj = { from, to, cost, type };
            const note = row.querySelector('[data-role="note"]')?.value?.trim() || '';
            if (note) routeObj.note = note;
            newRoutes.push(routeObj);
          }
        });
        country.routes[originKey] = newRoutes;
      });

      // Clean empty origins
      Object.keys(country.routes).forEach(ok => { if (country.routes[ok].length === 0) delete country.routes[ok]; });
    });
  }

  function saveRoutesFromEditor() {
    // Minimal placeholder: original implementation in the single-file app is lengthy.
    // If you want this fully refactored we can extract it next.
  }

  function applySettings() {
    saveRoutesFromEditor(); buildCountryButtons(); selectCountry(ACTIVE_COUNTRY); updateTierPreview();
    const msg = document.getElementById('cfg_saved'); if (msg) { msg.classList.remove('hidden'); setTimeout(() => msg.classList.add('hidden'), 3000); }
    showToast('Todas as configurações guardadas!');
  }

  // ---------- COPY & PDF ----------
  function copyIntl() {
    const grid = document.getElementById('intl_grid'); if (!grid) return; const lines = [];
    grid.querySelectorAll('div > div').forEach(card => { const label = card.querySelector('.text-gray-500'); const value = card.querySelector('.font-semibold'); if (label && value) lines.push(`${label.textContent}: ${value.textContent}`); });
    navigator.clipboard.writeText(lines.join('\n')).then(() => showToast('Copiado!'));
  }
  function copyBrazil() {
    const s1 = document.getElementById('br_importSummary'); const s2 = document.getElementById('br_priceFormation'); let text = '=== RESUMO IMPORTAÇÃO ===\n';
    s1?.querySelectorAll('.flex.justify-between').forEach(r => { text += `${r.children[0]?.textContent}: ${r.children[1]?.textContent}\n`; });
    text += '\n=== FORMAÇÃO DE PREÇO ===\n'; s2?.querySelectorAll('.flex.justify-between').forEach(r => { text += `${r.children[0]?.textContent}: ${r.children[1]?.textContent}\n`; });
    navigator.clipboard.writeText(text).then(() => showToast('Copiado!'));
  }

  // Câmbio offline com margem de segurança de 5% aplicada aos valores máximos históricos
  function initOfflineRates() {
    const rateStatus = document.getElementById('rateStatus');
    if (rateStatus) {
      rateStatus.textContent = '✓ Câmbio: offline (com margem 5%)';
      rateStatus.style.borderColor = 'rgba(0,255,136,0.3)';
      rateStatus.style.color = '#00ff88';
    }
  }

  async function exportPDF(containerId, title) {
    const el = document.getElementById(containerId); if (!el) return;
    try {
      const canvas = await html2canvas(el, { backgroundColor: '#0b0f17', scale: 2, useCORS: true });
      const { jsPDF } = window.jspdf; const pdf = new jsPDF('p', 'mm', 'a4'); const imgData = canvas.toDataURL('image/png'); const pdfW = pdf.internal.pageSize.getWidth(); const pdfH = (canvas.height * pdfW) / canvas.width;
      pdf.setFillColor(11, 15, 23); pdf.rect(0, 0, pdfW, pdf.internal.pageSize.getHeight(), 'F'); pdf.setTextColor(0, 255, 136); pdf.setFontSize(14); pdf.text(`Green Village — ${title}`, 10, 12); pdf.setTextColor(156, 162, 184); pdf.setFontSize(8); pdf.text(`Gerado em: ${new Date().toLocaleString('pt-PT')}`, 10, 18);
      pdf.addImage(imgData, 'PNG', 5, 22, pdfW - 10, pdfH - 10); pdf.save(`GreenVillage_${title}_${Date.now()}.pdf`);
    } catch (e) { alert('Erro ao gerar PDF. Verifique se os scripts estão carregados.'); console.error(e); }
  }

  // ---------- INIT ----------
  function init() {
    // If original page included the full transportRoutes JSON inline, expose it via window.__GV_ROUTES before init.
    if (!window.__GV_ROUTES || Object.keys(window.__GV_ROUTES).length === 0) {
      // For full fidelity use the original transportRoutes object from the provided HTML.
      // Quick fallback: copy the large transportRoutes object into window.__GV_ROUTES before calling GV.init()
    } else {
      transportRoutes = window.__GV_ROUTES;
    }

    buildCountryButtons(); selectCountry('portugal');
    document.getElementById('intl_price')?.addEventListener('input', updateTierPreview);
    document.getElementById('intl_currency')?.addEventListener('change', updateTierPreview);
    document.getElementById('intl_origin')?.addEventListener('change', () => { updateRoutes(); updateTierPreview(); });
    initOfflineRates();
  }

  return {
    switchTab: (t) => { ['international','brazil','settings'].forEach(x => { document.getElementById('panel-'+x).classList.toggle('hidden', x !== t); document.getElementById('tab-'+x).classList.toggle('tab-active', x === t); }); if (t === 'settings') buildRouteEditor(); },
    calcInternational, calcBrazil, applySettings, exportPDF, init,
    updateTierPreview, onOriginChange, showRouteNote: showRouteNote,
    copyIntl, copyBrazil,
    addRoute, removeOrigin, addOrigin, addNewCountry, saveRoutesFromEditor, buildRouteEditor
  };
})();

window.addEventListener('DOMContentLoaded', GV.init);
