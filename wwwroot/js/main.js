"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
var OrderProcessor = /** @class */ (function () {
    function OrderProcessor() {
        this.orderItems = [];
    }
    OrderProcessor.prototype.addItem = function (price, quantity) {
        this.orderItems.push({ price: price, quantity: quantity });
        this.updateOrderSummary();
    };
    OrderProcessor.prototype.updateOrderSummary = function () {
        var total = this.orderItems.reduce(function (sum, item) {
            return sum + (0, utils_1.calculateTotal)(item.price, item.quantity);
        }, 0);
        var summaryElement = document.getElementById('orderSummary');
        if (summaryElement) {
            summaryElement.innerHTML = "Total Order: ".concat((0, utils_1.formatCurrency)(total));
        }
    };
    return OrderProcessor;
}());
// Initialize the order processor when the page loads
window.onload = function () {
    var processor = new OrderProcessor();
    // Add click event to the Add Item button
    var addButton = document.getElementById('addItem');
    if (addButton) {
        addButton.addEventListener('click', function () {
            var priceInput = document.getElementById('price');
            var quantityInput = document.getElementById('quantity');
            var price = parseFloat(priceInput.value);
            var quantity = parseInt(quantityInput.value);
            if (!isNaN(price) && !isNaN(quantity)) {
                processor.addItem(price, quantity);
                priceInput.value = '';
                quantityInput.value = '';
            }
        });
    }
};
//# sourceMappingURL=main.js.map