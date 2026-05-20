export function maskCurrency(value: string, previousValue?: string): string {
	const isDeleting = previousValue !== undefined && value.length < previousValue.length;

	// Extrai só dígitos
	let numbers = value.replace(/\D/g, '');

	if (isDeleting) {
		const prevNumbers = previousValue!.replace(/\D/g, '');
		if (numbers.length === prevNumbers.length) {
			numbers = numbers.slice(0, -1);
		}
	}

	if (numbers.length === 0) return '';

	const cents = parseInt(numbers, 10);
	const amount = cents / 100;

	console.log(amount);

	return amount.toLocaleString('pt-BR', {
		style: 'currency',
		currency: 'BRL',
		minimumFractionDigits: 2,
	});
}
