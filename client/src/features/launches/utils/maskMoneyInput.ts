export function maskMoneyInput(value: string, previousValue?: string): string {
	const isDeleting = previousValue !== undefined && value.length < previousValue.length;

	// pega apenas números
	let numbers = value.replace(/\D/g, '');

	// corrige problema ao apagar
	if (isDeleting) {
		const prevNumbers = previousValue?.replace(/\D/g, '') ?? '';

		if (numbers.length === prevNumbers.length) {
			numbers = numbers.slice(0, -1);
		}
	}

	if (!numbers) return '';

	// transforma em centavos
	const amount = Number(numbers) / 100;

	// retorna sem R$
	return amount.toLocaleString('pt-BR', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
}
