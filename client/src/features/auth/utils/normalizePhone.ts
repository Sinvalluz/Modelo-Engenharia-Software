export function normalizePhone(value?: string): string | undefined {
	if (!value) return undefined;
	return value.replace(/^\((\d{2})\)\s/, '+55 $1 ');
}
