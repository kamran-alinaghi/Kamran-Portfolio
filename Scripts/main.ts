import { calculateTotal, formatCurrency } from './utils';

class OrderProcessor {
    private orderItems: { price: number; quantity: number }[] = [];

    public addItem(price: number, quantity: number): void {
        this.orderItems.push({ price, quantity });
        this.updateOrderSummary();
    }

    private updateOrderSummary(): void {
        const total = this.orderItems.reduce((sum, item) =>
            sum + calculateTotal(item.price, item.quantity), 0);

        const summaryElement = document.getElementById('orderSummary');
        if (summaryElement) {
            summaryElement.innerHTML = `Total Order: ${formatCurrency(total)}`;
        }
    }
}

// Initialize the order processor when the page loads
window.onload = () => {
    const processor = new OrderProcessor();

    // Add click event to the Add Item button
    const addButton = document.getElementById('addItem');
    if (addButton) {
        addButton.addEventListener('click', () => {
            const priceInput = document.getElementById('price') as HTMLInputElement;
            const quantityInput = document.getElementById('quantity') as HTMLInputElement;

            const price = parseFloat(priceInput.value);
            const quantity = parseInt(quantityInput.value);

            if (!isNaN(price) && !isNaN(quantity)) {
                processor.addItem(price, quantity);
                priceInput.value = '';
                quantityInput.value = '';
            }
        });
    }
};