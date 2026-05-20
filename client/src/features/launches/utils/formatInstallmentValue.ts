import { normalizeMoneyInputToCents } from './normalizeMoneyInputToCents';

export function formatInstallmentValue(value: string, quantity?: string) {
	if (!value) return;
	const installmentsQuantity = Number(quantity);

	if (!Number.isFinite(installmentsQuantity) || installmentsQuantity <= 0) {
		return 'R$ 0,00';
	}

	const valueInCents = normalizeMoneyInputToCents(value);
	const installmentValueInCents = Math.trunc(valueInCents / installmentsQuantity);
	const reais = Math.trunc(installmentValueInCents / 100);
	const cents = Math.abs(installmentValueInCents % 100);

	return `R$ ${reais.toLocaleString('pt-BR')},${String(cents).padStart(2, '0')}`;
}
