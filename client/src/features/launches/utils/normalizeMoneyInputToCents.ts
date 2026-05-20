export function normalizeMoneyInputToCents(value: string) {
	const clean = value
		.replace(/\./g, '')
		.replace(/[^\d,-]/g, '')
		.trim();
	const isNegative = clean.startsWith('-');
	const [integerPart = '0', centsPart = ''] = clean.replace('-', '').split(',');
	const cents = centsPart.padEnd(2, '0').slice(0, 2);

	const valueInCents = Number(integerPart || 0) * 100 + Number(cents || 0);
	return isNegative ? -valueInCents : valueInCents;
}
