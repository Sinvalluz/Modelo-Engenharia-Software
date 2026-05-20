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
