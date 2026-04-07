console.log("App.js loaded");

// ✅ Global State
const state = {
    type: "length",
    action: "Conversion",
    fromVal: null,
    fromUnit: "",
    toVal: null,
    toUnit: "",
    operator: "+"
};

// ✅ INIT
document.addEventListener("DOMContentLoaded", async () => {
    try {
        console.log("🚀 App initializing...");
        
        // Verify select elements exist
        const fromSelect = document.getElementById("fromUnit");
        const toSelect = document.getElementById("toUnit");
        console.log("📍 fromUnit found:", !!fromSelect);
        console.log("📍 toUnit found:", !!toSelect);
        
        attachEventListeners();
        console.log("✅ Event listeners attached");
        
        await loadUnits("length");
        console.log("✅ Units loaded for 'length'");
        
        setDefaultActive();
        console.log("✅ Default active states set");
        
        toggleOperators(false);
        console.log("✅ Operators toggled");
        
        await loadHistory();
        console.log("✅ History loaded");
        
        console.log("🎉 App initialization complete!");
    } catch (error) {
        console.error("❌ Initialization Error:", error);
        showError(error.message);
    }
});

// ✅ EVENT LISTENERS
function attachEventListeners() {

    const typeContainer = document.querySelector(".row.g-4");
    const typeCards = document.querySelectorAll(".type-card");

    const fromInput = document.querySelectorAll(".input-number")[0];
    const toInput = document.querySelectorAll(".input-number")[1];

    const fromSelect = document.getElementById("fromUnit");
    const toSelect = document.getElementById("toUnit");

    const operatorButtons = document.querySelectorAll("#operator-selector .action-btn");

    // 🔹 Operator buttons
    operatorButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            state.operator = btn.innerText.trim();
            calculateDebounced();
        });
    });

    // 🔹 FROM input
    fromInput.addEventListener("input", () => {
        state.fromVal = fromInput.value ? parseFloat(fromInput.value) : null;
        calculateDebounced();
    });

    // 🔹 TO input (only for comparison/arithmetic)
    toInput.addEventListener("input", () => {
        state.toVal = toInput.value ? parseFloat(toInput.value) : null;

        if (state.action !== "Conversion") {
            calculateDebounced();
        }
    });

    // 🔹 Dropdowns
    fromSelect.addEventListener("change", () => {
        console.log("🔄 FROM unit changed:", fromSelect.value);
        state.fromUnit = fromSelect.value;
        console.log("📊 State updated - fromUnit:", state.fromUnit);
        calculateDebounced();
    });

    toSelect.addEventListener("change", () => {
        console.log("🔄 TO unit changed:", toSelect.value);
        state.toUnit = toSelect.value;
        console.log("📊 State updated - toUnit:", state.toUnit);
        calculateDebounced();
    });

    // 🔹 Type cards
    typeCards.forEach(card => {
        card.addEventListener("click", async () => {
            try {
                state.type = card.dataset.type;

                setActive(typeContainer, card, ".type-card");

                // Reset inputs
                // fromInput.value = "";
                // toInput.value = "";

                // state.fromVal = null;
                // state.toVal = null;

                showResult(null);

                const units = await getUnits(state.type);

                populateDropdown(fromSelect, units);
                populateDropdown(toSelect, units);

                state.fromUnit = "";
                state.toUnit = "";

            } catch (error) {
                console.error(error);
                showError("Failed to load units");
            }
        });
    });

    // 🔹 Action buttons
    const actionButtons = document.querySelectorAll(".row.g-3 .action-btn");
    const actionContainer = actionButtons[0] ? actionButtons[0].parentElement.parentElement : null;

    actionButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault(); // Prevent potential reload
            
            state.action = btn.innerText.trim();
            
            // Set active state
            actionButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            
            toggleOperators(state.action === "Arithmetic");
            toInput.readOnly = state.action === "Conversion";

            // Only call calculate if there is already a value to process
            if (state.fromVal !== null) {
                calculateDebounced();
            }
        });
    });    
}

// ✅ DEFAULT UI
function setDefaultActive() {
    document.querySelector(".type-card").classList.add("active");
    document.querySelector(".action-btn").classList.add("active");
}

// ✅ LOAD UNITS
async function loadUnits(type) {
    const units = await getUnits(type);

    const fromSelect = document.getElementById("fromUnit");
    const toSelect = document.getElementById("toUnit");

    populateDropdown(fromSelect, units);
    populateDropdown(toSelect, units);
}

// ✅ LOAD HISTORY
async function loadHistory() {
    const history = await getHistory();
    console.log("History received from server:", history);
    renderHistory(history);
}

// ✅ ERROR HANDLER
function showError(message) {
    alert(message);
}

// ✅ CORE ENGINE
async function calculate() {
    try {
        console.log("🧮 Calculate called with state:", state);
        
        // 🔹 Guard
        if (
            state.fromVal === null ||
            isNaN(state.fromVal) ||
            !state.fromUnit ||
            !state.toUnit
        ) {
            console.log("⚠️ Guard failed - missing required values:");
            console.log(`   fromVal: ${state.fromVal} (valid: ${state.fromVal !== null && !isNaN(state.fromVal)})`);
            console.log(`   fromUnit: ${state.fromUnit} (valid: ${!!state.fromUnit})`);
            console.log(`   toUnit: ${state.toUnit} (valid: ${!!state.toUnit})`);
            // 🔥 Clear TO field ONLY when invalid
            const toInput = document.querySelectorAll(".input-number")[1];
            return;
        }

        // 🔹 Extra guard
        if (state.action !== "Conversion") {
            if (state.toVal === null || isNaN(state.toVal)) {
                console.log("⚠️ Extra guard failed - missing TO value for non-conversion action");
                return;
            }
        }

        const toInput = document.querySelectorAll(".input-number")[1];

        let result;
        let expression = "";

        // ✅ CONVERSION
        if (state.action === "Conversion") {
            console.log(`📐 Performing CONVERSION: ${state.fromVal} ${state.fromUnit} → ${state.toUnit}`);

            const conv = await getConversion(state.fromUnit, state.toUnit);

            result = applyConversion(state.fromVal, conv);

            // ✅ Write to TO input
            if (!isNaN(result)) {
                toInput.value = result;
                console.log(`✅ Conversion result: ${result}`);
            }

            // ❌ Don't show in result panel for conversion
            showResult(null);

            expression = `${state.fromVal} ${state.fromUnit} → ${result} ${state.toUnit}`;
        }

        // ✅ COMPARISON
        else if (state.action === "Comparison") {

            const conv = await getConversion(state.fromUnit, state.toUnit);
            const base1 = applyConversion(state.fromVal, conv);

            const base2 = state.toVal;

            const sentence = compareValues(
                state.fromVal,
                state.fromUnit,
                state.toVal,
                state.toUnit,
                base1,
                base2
            );

            showResult(sentence, "");

            result = sentence;
            expression = `${state.fromVal} ${state.fromUnit} vs ${state.toVal} ${state.toUnit}`;
        }

        // ✅ ARITHMETIC
        else {

            let v2normalised;

            if (state.fromUnit === state.toUnit) {
                v2normalised = state.toVal;
            } else {
                const conv = await getConversion(state.toUnit, state.fromUnit);
                v2normalised = applyConversion(state.toVal, conv);
            }

            result = performArithmetic(state.fromVal, v2normalised, state.operator);

            showResult(result, state.fromUnit);

            expression = `${state.fromVal} ${state.fromUnit} ${state.operator} ${state.toVal} ${state.toUnit}`;
        }

        // ✅ SAVE HISTORY
        const record = {
            type: state.type,
            action: state.action,
            expression: expression,
            result: result,
            timestamp: new Date().toISOString()
        };

        await saveHistory(record);
        const updatedHistory = await getHistory();
        renderHistory(updatedHistory);

    } catch (e) {
        showResult("Error: " + e.message, "");
    }
}

let timer;
function calculateDebounced() {
    clearTimeout(timer);
    timer = setTimeout(calculate, 100);
}