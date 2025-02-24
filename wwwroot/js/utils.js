"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateTotal = calculateTotal;
exports.formatCurrency = formatCurrency;
function calculateTotal(price, quantity) {
    return price * quantity;
}
function formatCurrency(amount) {
    return "$".concat(amount.toFixed(2));
}
//# sourceMappingURL=utils.js.map