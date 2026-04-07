// ========================================
// QUANTITY MEASUREMENT APP - SIMPLIFIED
// ========================================

// 📊 APP STATE
const state = {
    type: 'length',
    action: 'Conversion',
    fromValue: null,
    fromUnit: null,
    toValue: null,
    toUnit: null,
    operator: '+',
    history: []
};

// 📦 CONVERSION DATA
const units = {
    length: [
        { label: 'Millimeter', symbol: 'mm', toBase: 0.001 },
        { label: 'Centimeter', symbol: 'cm', toBase: 0.01 },
        { label: 'Meter', symbol: 'm', toBase: 1 },
        { label: 'Kilometer', symbol: 'km', toBase: 1000 },
        { label: 'Inch', symbol: 'in', toBase: 0.0254 },
        { label: 'Foot', symbol: 'ft', toBase: 0.3048 },
        { label: 'Yard', symbol: 'yd', toBase: 0.9144 },
        { label: 'Mile', symbol: 'mi', toBase: 1609.34 }
    ],
    weight: [
        { label: 'Milligram', symbol: 'mg', toBase: 0.000001 },
        { label: 'Gram', symbol: 'g', toBase: 0.001 },
        { label: 'Kilogram', symbol: 'kg', toBase: 1 },
        { label: 'Ounce', symbol: 'oz', toBase: 0.0283495 },
        { label: 'Pound', symbol: 'lb', toBase: 0.453592 }
    ],
    temperature: [
        { label: 'Celsius', symbol: '°C' },
        { label: 'Fahrenheit', symbol: '°F' },
        { label: 'Kelvin', symbol: 'K' }
    ],
    volume: [
        { label: 'Milliliter', symbol: 'ml', toBase: 0.001 },
        { label: 'Liter', symbol: 'l', toBase: 1 },
        { label: 'Gallon', symbol: 'gal', toBase: 3.78541 },
        { label: 'Cup', symbol: 'cup', toBase: 0.236588 },
        { label: 'Fluid Ounce', symbol: 'fl oz', toBase: 0.0295735 }
    ]
};

// 🎬 INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ App Initializing...');
    populateSelects('length');
    attachEventListeners();
    loadHistory();
    console.log('✅ App Ready!');
});

// 📋 POPULATE DROPDOWNS
function populateSelects(type) {
    const fromSelect = document.getElementById('fromUnit');
    const toSelect = document.getElementById('toUnit');
    
    fromSelect.innerHTML = '';
    toSelect.innerHTML = '';
    
    units[type].forEach(unit => {
        const opt1 = document.createElement('option');
        opt1.value = unit.symbol;
        opt1.textContent = `${unit.label} (${unit.symbol})`;
        fromSelect.appendChild(opt1);
        
        const opt2 = document.createElement('option');
        opt2.value = unit.symbol;
        opt2.textContent = `${unit.label} (${unit.symbol})`;
        toSelect.appendChild(opt2);
    });
}

// 🎯 EVENT LISTENERS
function attachEventListeners() {
    // Type cards
    document.querySelectorAll('.type-card').forEach(card => {
        card.addEventListener('click', () => {
            document.querySelectorAll('.type-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            state.type = card.dataset.type;
            populateSelects(state.type);
            clearInputs();
        });
    });
    
    // Action buttons
    document.querySelectorAll('.row.g-3 .action-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.row.g-3 .action-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.action = btn.textContent.trim();
            
            const operatorRow = document.getElementById('operator-selector');
            operatorRow.style.display = state.action === 'Arithmetic' ? 'flex' : 'none';
            
            const toInput = document.querySelectorAll('.input-number')[1];
            toInput.readOnly = state.action === 'Conversion';
            
            clearResult();
        });
    });
    
    // Operator buttons
    document.querySelectorAll('#operator-selector .action-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            state.operator = btn.textContent.trim();
            calculate();
        });
    });
    
    // FROM input
    document.querySelectorAll('.input-number')[0].addEventListener('input', (e) => {
        state.fromValue = e.target.value ? parseFloat(e.target.value) : null;
        calculate();
    });
    
    // TO input
    document.querySelectorAll('.input-number')[1].addEventListener('input', (e) => {
        state.toValue = e.target.value ? parseFloat(e.target.value) : null;
        if (state.action !== 'Conversion') calculate();
    });
    
    // FROM unit
    document.getElementById('fromUnit').addEventListener('change', (e) => {
        state.fromUnit = e.target.value;
        calculate();
    });
    
    // TO unit
    document.getElementById('toUnit').addEventListener('change', (e) => {
        state.toUnit = e.target.value;
        calculate();
    });
}

// 🧮 CONVERSION FUNCTION
function convert(value, fromSym, toSym, type) {
    const from = units[type].find(u => u.symbol === fromSym);
    const to = units[type].find(u => u.symbol === toSym);
    
    if (!from || !to) return null;
    
    if (type === 'temperature') {
        return convertTemp(value, fromSym, toSym);
    }
    
    const factor = from.toBase / to.toBase;
    return parseFloat((value * factor).toFixed(6));
}

// 🌡️ TEMPERATURE CONVERSION
function convertTemp(val, from, to) {
    let celsius;
    
    if (from === '°C') celsius = val;
    else if (from === '°F') celsius = (val - 32) * 5 / 9;
    else if (from === 'K') celsius = val - 273.15;
    
    if (to === '°C') return parseFloat(celsius.toFixed(2));
    if (to === '°F') return parseFloat((celsius * 9 / 5 + 32).toFixed(2));
    if (to === 'K') return parseFloat((celsius + 273.15).toFixed(2));
}

// 🔄 MAIN CALCULATE FUNCTION
function calculate() {
    if (!state.fromValue || !state.fromUnit || !state.toUnit) {
        clearResult();
        return;
    }
    
    try {
        const toInput = document.querySelectorAll('.input-number')[1];
        let result, expression;
        
        if (state.action === 'Conversion') {
            result = convert(state.fromValue, state.fromUnit, state.toUnit, state.type);
            toInput.value = result;
            showResult(null);
            expression = `${state.fromValue} ${state.fromUnit} = ${result} ${state.toUnit}`;
            
        } else if (state.action === 'Comparison') {
            if (!state.toValue) return;
            
            const base1 = convert(state.fromValue, state.fromUnit, state.fromUnit, state.type);
            const base2 = convert(state.toValue, state.toUnit, state.fromUnit, state.type);
            
            let msg;
            if (base1 > base2) msg = `${state.fromValue} ${state.fromUnit} > ${state.toValue} ${state.toUnit}`;
            else if (base1 < base2) msg = `${state.fromValue} ${state.fromUnit} < ${state.toValue} ${state.toUnit}`;
            else msg = `${state.fromValue} ${state.fromUnit} = ${state.toValue} ${state.toUnit}`;
            
            showResult(msg);
            expression = msg;
            
        } else if (state.action === 'Arithmetic') {
            if (!state.toValue) return;
            
            const normalized = convert(state.toValue, state.toUnit, state.fromUnit, state.type);
            let res;
            
            if (state.operator === '+') res = state.fromValue + normalized;
            else if (state.operator === '-') res = state.fromValue - normalized;
            else if (state.operator === '*') res = state.fromValue * normalized;
            else if (state.operator === '/') res = normalized !== 0 ? state.fromValue / normalized : null;
            
            showResult(`${res.toFixed(4)} ${state.fromUnit}`);
            expression = `${state.fromValue} ${state.fromUnit} ${state.operator} ${state.toValue} ${state.toUnit} = ${res.toFixed(4)} ${state.fromUnit}`;
        }
        
        saveHistory(expression, result);
        
    } catch (e) {
        console.error(e);
    }
}

// 📊 DISPLAY RESULT
function showResult(value) {
    const valEl = document.getElementById('result-value');
    const unitEl = document.getElementById('result-unit');
    
    if (!value) {
        valEl.textContent = '—';
        unitEl.textContent = '';
        return;
    }
    
    valEl.textContent = value;
    unitEl.textContent = '';
}

// 🗑️ CLEAR FUNCTIONS
function clearResult() {
    showResult(null);
}

function clearInputs() {
    document.querySelectorAll('.input-number').forEach(inp => inp.value = '');
    state.fromValue = null;
    state.toValue = null;
    clearResult();
}

// 💾 HISTORY
function saveHistory(expr, res) {
    const record = { type: state.type, action: state.action, expr, res, time: new Date().toLocaleTimeString() };
    state.history.unshift(record);
    if (state.history.length > 10) state.history.pop();
    renderHistory();
    localStorage.setItem('qmHistory', JSON.stringify(state.history));
}

function loadHistory() {
    const saved = localStorage.getItem('qmHistory');
    if (saved) {
        state.history = JSON.parse(saved);
        renderHistory();
    }
}

function renderHistory() {
    const list = document.getElementById('history-list');
    list.innerHTML = '';
    
    if (state.history.length === 0) {
        list.classList.add('empty');
        list.innerHTML = '<li>No history</li>';
        return;
    }
    
    list.classList.remove('empty');
    state.history.forEach(r => {
        const li = document.createElement('li');
        li.textContent = `${r.expr} (${r.time})`;
        list.appendChild(li);
    });
}
