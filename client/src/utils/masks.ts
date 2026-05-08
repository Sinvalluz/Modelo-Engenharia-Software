// utils/masks.ts

export function maskPhone(value: string, previousValue?: string): string {
	const isDeleting = previousValue !== undefined && value.length < previousValue.length;

	let numbers = value.replace(/\D/g, '');

	if (isDeleting) {
		const prevNumbers = previousValue!.replace(/\D/g, '');
		if (numbers.length === prevNumbers.length) {
			numbers = numbers.slice(0, -1);
		}
	}

	numbers = numbers.slice(0, 11);

	if (numbers.length === 0) return '';
	if (numbers.length <= 2) return `(${numbers}`;
	if (numbers.length <= 6) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
	if (numbers.length <= 10) {
		return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
	}
	return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
}

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

	// Converte centavos: "12345" → 123.45
	const cents = parseInt(numbers, 10);
	const amount = cents / 100;

	return amount.toLocaleString('pt-BR', {
		style: 'currency',
		currency: 'BRL',
		minimumFractionDigits: 2,
	});
}

// Bloqueia qualquer caractere que não seja letra, espaço ou acentuação
export function maskName(value: string): string {
	// Permite letras (incluindo acentuadas), espaços e hífens
	return value.replace(/[^a-zA-ZÀ-ÿ\s-]/g, '');
}
