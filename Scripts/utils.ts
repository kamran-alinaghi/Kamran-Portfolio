export function calculateTotal(price: number, quantity: number): number {
    return price * quantity;
}

export function formatCurrency(amount: number): string {
    return `$${amount.toFixed(2)}`;
}