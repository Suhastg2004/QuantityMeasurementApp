function populateDropdown(selectEl, units) {

    // ❌ Safety check
    if (!selectEl) {
        console.error("❌ Dropdown element not found!");
        return;
    }

    console.log(`📌 Populating select #${selectEl.id} with ${units.length} units:`, units);

    // 🔹 Clear existing options
    selectEl.innerHTML = "";

    // 🔹 Default option
    const defaultOpt = document.createElement("option");
    defaultOpt.textContent = "-- Select Unit --";
    defaultOpt.disabled = true;
    defaultOpt.selected = true;

    selectEl.appendChild(defaultOpt);

    // 🔹 Add unit options
    units.forEach((u, index) => {
        const opt = document.createElement("option");
        opt.value = u.symbol;
        opt.textContent = `${u.label} (${u.symbol})`;
        selectEl.appendChild(opt);
        console.log(`   ✅ Added option ${index + 1}: ${u.label} (${u.symbol})`);
    });

    console.log(`✅ Dropdown #${selectEl.id} now has ${selectEl.options.length} options total`);
}

function setActive(parentEl, clickedEl, childSelector) {

    // ❌ Safety check
    if (!parentEl) {
        console.warn("Parent element not found");
        return;
    }

    // 🔹 Remove active from all children
    parentEl.querySelectorAll(childSelector).forEach(el => {
        el.classList.remove("active");
    });

    // 🔹 Add active to clicked element
    clickedEl.classList.add("active");
}

function showResult(value, unitSymbol) {

    const valueEl = document.querySelector("#result-value");
    const unitEl = document.querySelector("#result-unit");

    if (!valueEl || !unitEl) return;

    // ❗ If no value → hide panel
    if (value === null || value === undefined) {
        valueEl.textContent = "—";
        unitEl.textContent = "";
        return;
    }

    valueEl.textContent = value;
    unitEl.textContent = unitSymbol || "";
}

function toggleOperators(show) {

    const operatorRow = document.querySelector("#operator-selector");

    if (!operatorRow) {
        console.warn("Operator selector not found");
        return;
    }

    operatorRow.style.display = show ? "flex" : "none";
}

function renderHistory(records) {

    const list = document.querySelector("#history-list");

    // ❌ Safety check
    if (!list) {
        console.warn("History list not found");
        return;
    }

    // 🔹 Treat undefined as []
    records = records || [];

    // 🔹 Clear existing list
    list.innerHTML = "";

    // 🔹 Empty state
    if (!records.length) {
        list.innerHTML = "<li>No history yet.</li>";
        return;
    }

    // 🔹 Render records
    records.forEach(r => {
    if (!r.expression || r.result === undefined) return; // skip bad records
    const li = document.createElement("li");
    li.textContent = `${r.expression} = ${r.result} (${new Date(r.timestamp).toLocaleString()})`;
    list.appendChild(li);
    });
}