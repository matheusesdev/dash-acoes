document.addEventListener('DOMContentLoaded', () => {
    const tickerInput = document.getElementById('tickerInput');
    const addStockBtn = document.getElementById('addStockBtn');
    const stockDashboard = document.getElementById('stockDashboard');
    const loadingMessage = document.getElementById('loadingMessage');
    const errorMessage = document.getElementById('errorMessage');
    const emptyDashboardMessage = document.getElementById('emptyDashboardMessage');
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const themeIconSun = document.getElementById('themeIconSun');
    const themeIconMoon = document.getElementById('themeIconMoon');
    const totalAssetsEl = document.getElementById('totalAssets');
    const avgChangeEl = document.getElementById('avgChange');
    const bestPerformerEl = document.getElementById('bestPerformer');
    const worstPerformerEl = document.getElementById('worstPerformer');
    const dailyPerformanceChartCanvas = document.getElementById('dailyPerformanceChart');

    const API_TOKEN = 'sLgubZcsdnsHJi7sBfM888';
    const PLACEHOLDER_TOKEN_MESSAGE = 'SEU_TOKEN_DA_BRAPI_VAI_AQUI';
    const API_BASE_URL_QUOTE = 'https://brapi.dev/api/quote/';
    const REFRESH_INTERVAL = 90000;
    const HISTORICAL_DATA_RANGE = '1mo';
    const HISTORICAL_DATA_INTERVAL = '1d';

    let watchedStocks = [];
    let stockDataCache = {};
    let refreshIntervalId = null;
    const stockCharts = {};
    let dailyPerformanceChartInstance = null;

    function applyTheme(theme) {
        document.body.className = theme;
        localStorage.setItem('dashboardTheme', theme);
        themeIconSun.style.display = theme === 'dark-theme' ? 'none' : 'block';
        themeIconMoon.style.display = theme === 'dark-theme' ? 'block' : 'none';
        Object.values(stockCharts).forEach(chart => updateChartTheme(chart, theme));
        if (dailyPerformanceChartInstance) updateChartTheme(dailyPerformanceChartInstance, theme);
    }
    function updateChartTheme(chartInstance, theme) {
        if (!chartInstance || !chartInstance.options || !chartInstance.options.scales) return;
        const isDark = theme === 'dark-theme';
        const fontColor = isDark ? '#e0e0e0' : '#333';
        const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

        if (chartInstance.options.scales.x) {
            chartInstance.options.scales.x.ticks.color = fontColor;
            chartInstance.options.scales.x.grid.color = gridColor;
        }
        if (chartInstance.options.scales.y) {
            chartInstance.options.scales.y.ticks.color = fontColor;
            chartInstance.options.scales.y.grid.color = gridColor;
        }
        if (chartInstance.options.scales.yVolume) {
            chartInstance.options.scales.yVolume.ticks.color = fontColor;
            chartInstance.options.scales.yVolume.grid.display = false;
        }
        chartInstance.update('none');
    }
    themeToggleBtn.addEventListener('click', () => applyTheme(document.body.classList.contains('dark-theme') ? '' : 'dark-theme'));
    applyTheme(localStorage.getItem('dashboardTheme') || '');

    if (API_TOKEN === PLACEHOLDER_TOKEN_MESSAGE || API_TOKEN.trim() === '') {
        showError("Token da API não configurado. Edite script.js.");
        addStockBtn.disabled = true; tickerInput.disabled = true;
        updateDashboardMessages(); return;
    }

    function updateDashboardMessages() {
        emptyDashboardMessage.style.display = (watchedStocks.length === 0 && loadingMessage.style.display !== 'flex') ? 'block' : 'none';
    }
    function showLoading(show) { loadingMessage.style.display = show ? 'flex' : 'none'; updateDashboardMessages(); }
    function showError(message) {
        errorMessage.textContent = message; errorMessage.style.display = message ? 'block' : 'none';
        if (message) setTimeout(() => { if (errorMessage.textContent === message) errorMessage.style.display = 'none'; }, 7000);
        updateDashboardMessages();
    }
    function updatePortfolioSummary() {
        totalAssetsEl.textContent = watchedStocks.length;
        if (watchedStocks.length === 0) {
            avgChangeEl.textContent = '-'; avgChangeEl.className = 'summary-value';
            bestPerformerEl.textContent = '-'; worstPerformerEl.textContent = '-';
            renderDailyPerformanceChart([]); return;
        }
        let totalChange = 0, best = { t: '-', c: -Infinity }, worst = { t: '-', c: Infinity }, count = 0;
        const dailyPerformanceData = [];
        watchedStocks.forEach(ticker => {
            const data = stockDataCache[ticker];
            if (data && typeof data.regularMarketChangePercent === 'number') {
                totalChange += data.regularMarketChangePercent; count++;
                if (data.regularMarketChangePercent > best.c) best = { t: data.symbol, c: data.regularMarketChangePercent };
                if (data.regularMarketChangePercent < worst.c) worst = { t: data.symbol, c: data.regularMarketChangePercent };
                dailyPerformanceData.push({ ticker: data.symbol, change: data.regularMarketChangePercent });
            }
        });
        if (count > 0) {
            const avg = totalChange / count;
            avgChangeEl.textContent = `${avg.toFixed(2)}%`; avgChangeEl.className = 'summary-value';
            if (avg > 0) avgChangeEl.classList.add('positive'); else if (avg < 0) avgChangeEl.classList.add('negative');
        } else { avgChangeEl.textContent = '-'; avgChangeEl.className = 'summary-value'; }
        bestPerformerEl.textContent = best.t !== '-' ? `${best.t} (${best.c.toFixed(2)}%)` : '-';
        worstPerformerEl.textContent = worst.t !== '-' ? `${worst.t} (${worst.c.toFixed(2)}%)` : '-';
        renderDailyPerformanceChart(dailyPerformanceData);
    }
    async function fetchStockData(ticker) {
        showError('');
        try {
            const url = `${API_BASE_URL_QUOTE}${ticker}?token=${API_TOKEN}&range=${HISTORICAL_DATA_RANGE}&interval=${HISTORICAL_DATA_INTERVAL}&fundamental=true÷nds=false`;
            const response = await fetch(url);
            if (!response.ok) {
                const errData = await response.json().catch(() => ({ message: `Erro ${response.status}` }));
                const errMsg = errData.message || (errData.error ? (typeof errData.error === 'string' ? errData.error : errData.error.message) : `Erro ${response.status}`);
                if (errMsg && errMsg.toLowerCase().includes("token é inválido")) { showError(`Token Brapi (${API_TOKEN.substring(0,5)}...) inválido/expirado.`); }
                else { showError(errMsg || `Erro ao buscar ${ticker}.`); }
                return null;
            }
            const data = await response.json();
            if (data.results && data.results.length > 0) { stockDataCache[ticker] = data.results[0]; return data.results[0]; }
            throw new Error(data.message || `Dados não encontrados para ${ticker}.`);
        } catch (error) { showError(typeof error.message === 'string' ? error.message : `Erro ao buscar dados para ${ticker}.`); return null; }
    }
    function createStockCard(stockData) {
        if (!stockData || !stockData.symbol) return;
        const { symbol, regularMarketPrice=0, regularMarketChange=0, regularMarketChangePercent=0, longName, shortName, regularMarketOpen, regularMarketDayHigh, regularMarketDayLow, marketState, regularMarketTime, marketCap } = stockData;
        const card = document.createElement('div'); card.classList.add('stock-card'); card.dataset.ticker = symbol;
        let changeClass = 'change-neutral', arrow = '';
        if (regularMarketChange > 0) { changeClass = 'change-positive'; arrow = '▲'; } else if (regularMarketChange < 0) { changeClass = 'change-negative'; arrow = '▼'; }
        let marketSDisplay = marketState || 'Desconhecido', marketSClass = 'other';
        if (['REGULAR', 'OPEN'].includes(marketState)) { marketSClass = 'open'; marketSDisplay = 'Aberto';}
        else if (['CLOSED', 'PREPRE', 'POSTPOST'].includes(marketState)) { marketSClass = 'closed'; marketSDisplay = 'Fechado';}
        let lastTime = 'N/A'; if (regularMarketTime) try { lastTime = new Intl.DateTimeFormat('pt-BR', { hour:'2-digit', minute:'2-digit', second:'2-digit' }).format(new Date(regularMarketTime*1000)); } catch(e){}
        const capFmt = marketCap ? `R$ ${(marketCap/1e9).toFixed(2)} Bi` : 'N/A';
        card.innerHTML = `
            <div class="card-header"><div class="stock-info"><h2>${symbol}</h2><span class="company-name">${longName||shortName||'Nome Ind.'}</span></div><button class="remove-stock-btn" title="Remover">×</button></div>
            <div class="card-body"><p class="price">R$ ${regularMarketPrice.toFixed(2)}</p><p class="change ${changeClass}">${regularMarketChange.toFixed(2)} (${regularMarketChangePercent.toFixed(2)}%) <span class="change-arrow">${arrow}</span></p></div>
            <div class="stock-details"><p><span>Abertura:</span><strong>R$ ${regularMarketOpen?regularMarketOpen.toFixed(2):'N/A'}</strong></p><p><span>Máx. Dia:</span><strong>R$ ${regularMarketDayHigh?regularMarketDayHigh.toFixed(2):'N/A'}</strong></p><p><span>Mín. Dia:</span><strong>R$ ${regularMarketDayLow?regularMarketDayLow.toFixed(2):'N/A'}</strong></p></div>
            <div class="chart-container"><canvas id="chart-${symbol}"></canvas></div>
            <div class="card-footer-info"><span>Status: <strong class="market-status ${marketSClass}">${marketSDisplay}</strong></span><span>Últ. Cotação: <strong>${lastTime}</strong></span><span>Market Cap: <strong>${capFmt}</strong></span></div>`;
        card.querySelector('.remove-stock-btn').addEventListener('click', () => removeStock(symbol));
        const firstMsg = stockDashboard.querySelector('.status-message:not(#errorMessage):not(#loadingMessage)');
        stockDashboard.insertBefore(card, firstMsg || null);
        setTimeout(() => renderStockChart(stockData), 0);
    }
    function renderStockChart(stockData) {
        const ticker = stockData.symbol, canvasId = `chart-${ticker}`, ctx = document.getElementById(canvasId);
        if (!ctx) return;
        if (!stockData.historicalDataPrice || !Array.isArray(stockData.historicalDataPrice) || stockData.historicalDataPrice.length === 0) {
            if(ctx.parentElement) ctx.parentElement.innerHTML = '<p style="text-align:center; color:var(--text-muted); margin-top:20px;">Dados hist. indisponíveis.</p>'; return;
        }
        if (stockCharts[ticker]) stockCharts[ticker].destroy();
        const labels = stockData.historicalDataPrice.map(d => new Date(d.date * 1000));
        const pricePoints = stockData.historicalDataPrice.map(d => d.close);
        const volumePoints = stockData.historicalDataPrice.map(d => d.volume);
        const isDark = document.body.classList.contains('dark-theme');
        const gridC = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
        const fontC = isDark ? '#e0e0e0' : '#333';
        const priceUp = pricePoints.length > 1 && pricePoints[pricePoints.length - 1] >= pricePoints[0];
        const priceColor = priceUp ? 'rgba(46,204,113,0.7)' : 'rgba(231,76,60,0.7)';
        const priceBorder = priceUp ? '#2ecc71' : '#e74c3c';
        const volColor = isDark ? 'rgba(100,100,150,0.4)' : 'rgba(150,150,200,0.3)';


        stockCharts[ticker] = new Chart(ctx, {
            type: 'bar',
            data: { labels, datasets: [
                { type: 'line', label: `Preço (${ticker})`, data: pricePoints, borderColor: priceBorder, backgroundColor: priceColor, borderWidth: 2, pointRadius: 0, tension: 0.1, yAxisID: 'yPrice' },
                { type: 'bar', label: 'Volume', data: volumePoints, backgroundColor: volColor, borderColor: volColor, yAxisID: 'yVolume', order: 1 }
            ]},
            options: { responsive: true, maintainAspectRatio: false, interaction: { mode: 'index', intersect: false, axis:'x' }, stacked: false,
                scales: {
                    x: { type: 'time', time: { unit: 'day', tooltipFormat: 'dd/MM/yyyy', displayFormats: {day:'dd/MM'}}, grid: {display:false}, ticks: {color:fontC, maxRotation:0, autoSkip:true, maxTicksLimit:7}},
                    yPrice: { type: 'linear', display: true, position: 'left', beginAtZero: false, grid: {color:gridC}, ticks: {color:fontC, callback:v=>`R$ ${v.toFixed(2)}`}},
                    yVolume: { type: 'linear', display: true, position: 'right', beginAtZero: true, grid: {display:false}, ticks: {color:fontC, callback:v => `${(v/1e6).toFixed(1)}M`}}
                },
                plugins: { legend: {display:false}, tooltip: { callbacks: { label: c => {
                    let label = c.dataset.label || ''; if(label) label+=': ';
                    if(c.dataset.yAxisID === 'yVolume') label += `${(c.parsed.y/1e6).toFixed(2)}M`;
                    else label += new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(c.parsed.y);
                    return label;
                }}}}
            }
        });
    }
    function renderDailyPerformanceChart(data) {
        if (dailyPerformanceChartInstance) dailyPerformanceChartInstance.destroy();
        const container = dailyPerformanceChartCanvas.parentElement;
        if (!data || data.length === 0) {
            if(container) container.style.display = 'none';
            return;
        }
        if(container) container.style.display = 'flex'; // 'flex' para centralizar

        const labels = data.map(d => d.ticker);
        const changes = data.map(d => d.change);
        const backgroundColors = changes.map(c => c >= 0 ? 'rgba(46, 204, 113, 0.7)' : 'rgba(231, 76, 60, 0.7)');
        const borderColors = changes.map(c => c >= 0 ? '#2ecc71' : '#e74c3c');
        const isDark = document.body.classList.contains('dark-theme');
        const fontC = isDark ? '#e0e0e0' : '#333';
        const gridC = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';

        dailyPerformanceChartInstance = new Chart(dailyPerformanceChartCanvas, {
            type: 'bar',
            data: { labels, datasets: [{ label: 'Variação %', data: changes, backgroundColor: backgroundColors, borderColor: borderColors, borderWidth: 1 }] },
            options: { responsive: true, maintainAspectRatio: false, indexAxis: 'y',
                scales: {
                    x: { ticks: {color:fontC, callback:v=>`${v.toFixed(1)}%`}, grid: {color:gridC} },
                    y: { ticks: {color:fontC}, grid: {display:false} }
                },
                plugins: { legend: {display:false}, tooltip: { callbacks: {label: c=>`${c.dataset.label||''}: ${c.parsed.x.toFixed(2)}%`}}}
            }
        });
        updateChartTheme(dailyPerformanceChartInstance, document.body.className); // Aplicar tema ao novo gráfico
    }
    async function addStock() {
        const ticker = tickerInput.value.trim().toUpperCase();
        if (!ticker) { showError("Insira um código de ação."); return; }
        if (watchedStocks.includes(ticker)) { showError(`${ticker} já está no dashboard.`); tickerInput.value = ''; return; }
        showLoading(true); const data = await fetchStockData(ticker); showLoading(false);
        if (data) {
            if (!watchedStocks.includes(ticker)) watchedStocks.push(ticker);
            saveWatchedStocks(); createStockCard(data); updatePortfolioSummary(); startAutoRefresh();
        }
        tickerInput.value = ''; updateDashboardMessages();
    }
    function removeStock(ticker) {
        watchedStocks = watchedStocks.filter(t => t !== ticker); delete stockDataCache[ticker]; saveWatchedStocks();
        const card = stockDashboard.querySelector(`.stock-card[data-ticker="${ticker}"]`); if(card)card.remove();
        if (stockCharts[ticker]) { stockCharts[ticker].destroy(); delete stockCharts[ticker]; }
        if (watchedStocks.length === 0) stopAutoRefresh();
        updatePortfolioSummary(); updateDashboardMessages();
    }
    async function fetchAllWatchedStocks(isInitialLoad = false) {
        if (watchedStocks.length === 0) { if (isInitialLoad)showLoading(false); updateDashboardMessages();updatePortfolioSummary();return; }
        if (isInitialLoad)showLoading(true);
        for (const ticker of watchedStocks) {
            const data = await fetchStockData(ticker);
            if (data) {
                const card = stockDashboard.querySelector(`.stock-card[data-ticker="${ticker}"]`); if(card)card.remove();
                if (stockCharts[ticker]){stockCharts[ticker].destroy();delete stockCharts[ticker];}
                createStockCard(data);
            }
        }
        if (isInitialLoad)showLoading(false); updatePortfolioSummary(); updateDashboardMessages();
    }
    function startAutoRefresh() { if(refreshIntervalId)clearInterval(refreshIntervalId); if(watchedStocks.length>0)refreshIntervalId=setInterval(()=>fetchAllWatchedStocks(false),REFRESH_INTERVAL); }
    function stopAutoRefresh() { if(refreshIntervalId){clearInterval(refreshIntervalId);refreshIntervalId=null;} }
    function loadState() { const s=localStorage.getItem('watchedStocks'); if(s)try{watchedStocks=JSON.parse(s);if(!Array.isArray(watchedStocks))watchedStocks=[];}catch(e){watchedStocks=[];} }
    function saveWatchedStocks() { localStorage.setItem('watchedStocks', JSON.stringify(watchedStocks)); }
    addStockBtn.addEventListener('click', addStock);
    tickerInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') addStock(); });
    loadState();
    if (API_TOKEN !== PLACEHOLDER_TOKEN_MESSAGE && API_TOKEN.trim() !== '') {
        if (watchedStocks.length > 0) fetchAllWatchedStocks(true); else updatePortfolioSummary();
        startAutoRefresh();
    }
    updateDashboardMessages();
});