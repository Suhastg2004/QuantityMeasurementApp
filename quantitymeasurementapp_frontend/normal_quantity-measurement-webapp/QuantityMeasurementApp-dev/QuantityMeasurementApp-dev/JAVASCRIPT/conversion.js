function applyConversion(value, convObj) {

    // ❌ Invalid number check
    if (isNaN(value)) {
        throw new Error("Invalid number");
    }

    // 🔹 Same unit case (handled optionally by caller, but safe here)
    if (!convObj) {
        throw new Error("Conversion object missing");
    }

    // 🔹 Factor-based conversion
    if (convObj.factor !== null) {
        return parseFloat((value * convObj.factor).toFixed(6));
    }

    // 🔹 Formula-based conversion
    else {
        try {
            const expr = convObj.formula.replace("x", value);
            const result = eval(expr); // safe because from db.json
            return parseFloat(result.toFixed(6));
        } catch (err) {
            throw new Error("Bad formula");
        }
    }
}

function compareValues(v1, u1, v2, u2, base1, base2) {

    // ❌ Invalid values
    if (isNaN(v1) || isNaN(v2)) {
        return "Invalid values — cannot compare";
    }

    // 🔹 Compare normalized values
    if (base1 > base2) {
        return `${v1} ${u1} is GREATER than ${v2} ${u2}`;
    }

    if (base1 < base2) {
        return `${v1} ${u1} is LESS than ${v2} ${u2}`;
    }

    return `${v1} ${u1} is EQUAL to ${v2} ${u2}`;
}

function performArithmetic(v1, v2normalised, op) {

    // ❌ Invalid inputs
    if (isNaN(v1) || isNaN(v2normalised)) {
        throw new Error("Invalid numbers");
    }

    switch (op) {

        case "+":
            return parseFloat((v1 + v2normalised).toFixed(6));

        case "-":
            return parseFloat((v1 - v2normalised).toFixed(6));

        case "*":
            return parseFloat((v1 * v2normalised).toFixed(6));

        case "/":
            if (v2normalised === 0) {
                throw new Error("Divide by zero");
            }
            return parseFloat((v1 / v2normalised).toFixed(6));

        default:
            throw new Error("Unknown operator");
    }
}