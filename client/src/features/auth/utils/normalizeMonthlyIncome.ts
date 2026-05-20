export function normalizeMonthlyIncome(value?: string): number | undefined {
	if (!value || value.trim() === '') return undefined;

	const clean = value.replace('R$', '').replace(/\./g, '').replace(',', '.').trim();

	const parsed = Number(clean);
	return Number.isNaN(parsed) ? undefined : parsed;
}
