// Bloqueia qualquer caractere que não seja letra, espaço ou acentuação
export function maskName(value: string): string {
	// Permite letras (incluindo acentuadas), espaços e hífens
	return value.replace(/[^a-zA-ZÀ-ÿ\s-]/g, '');
}
