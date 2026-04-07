const BASE_URL = "http://localhost:3000";

// 📋 Fallback Mock Data
const MOCK_UNITS = {
    length: [
        { label: "Millimeter", symbol: "mm" },
        { label: "Centimeter", symbol: "cm" },
        { label: "Meter", symbol: "m" },
        { label: "Kilometer", symbol: "km" },
        { label: "Inch", symbol: "in" },
        { label: "Foot", symbol: "ft" },
        { label: "Yard", symbol: "yd" },
        { label: "Mile", symbol: "mi" }
    ],
    weight: [
        { label: "Milligram", symbol: "mg" },
        { label: "Gram", symbol: "g" },
        { label: "Kilogram", symbol: "kg" },
        { label: "Ounce", symbol: "oz" },
        { label: "Pound", symbol: "lb" }
    ],
    temperature: [
        { label: "Celsius", symbol: "°C" },
        { label: "Fahrenheit", symbol: "°F" },
        { label: "Kelvin", symbol: "K" }
    ],
    volume: [
        { label: "Milliliter", symbol: "ml" },
        { label: "Liter", symbol: "l" },
        { label: "Gallon", symbol: "gal" },
        { label: "Cup", symbol: "cup" },
        { label: "Fluid Ounce", symbol: "fl oz" }
    ]
};

async function getUnits(type) {
    try {
        console.log(`🔄 Fetching units for type: ${type}`);
        const res = await fetch(`${BASE_URL}/units?type=${type.toLowerCase()}`);

        if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();
        console.log(`✅ API returned ${data.length} units for ${type}:`, data);
        return data;

    } catch (error) {
        console.warn(`⚠️ API failed for ${type}, using mock data:`, error.message);
        const mockData = MOCK_UNITS[type.toLowerCase()] || [];
        console.log(`📋 Using mock data with ${mockData.length} units`);
        return mockData;
    }
}


async function getConversion(from, to) {
    try {
        console.log(`🔄 Fetching conversion: ${from} → ${to}`);
        const res = await fetch(
            `${BASE_URL}/conversions?from=${from}&to=${to}`
        );

        if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json(); // always array

        if (!data.length) {
            throw new Error("No conversion found");
        }

        console.log(`✅ Conversion retrieved:`, data[0]);
        return data[0]; // return first match

    } catch (error) {
        console.warn(`⚠️ API conversion failed (${from}→${to}), using default factor: 1`, error.message);
        // Return default 1:1 conversion as fallback
        return { from, to, factor: 1, formula: null };
    }
}


async function saveHistory(record) {
    try {
        const res = await fetch(`${BASE_URL}/history`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(record)
        });

        if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();
        return data;

    } catch (error) {
        console.error("Error saving history:", error);
        // ❗ DO NOT throw — history is non-critical
    }
}

// In api.js
async function getHistory() {
    try {
        // Try the simplest URL first to see if ANY data comes back
        const res = await fetch(`${BASE_URL}/history`);
        
        if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();
        
        // Manual sort if the server query fails to do it
        return data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    } catch (error) {
        console.error("Error fetching history:", error);
        return [];
    }
}
