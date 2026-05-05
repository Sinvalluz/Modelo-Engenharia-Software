import z from 'zod';

export const FormRegisterDataSchema = z.object({
	name: z.string().min(1, 'Digite um nome válido'),
	email: z.email('Digite um email válido'),
	password: z
		.string()
		.min(8, 'A senha deve ter no mínimo 8 caracteres')
		.refine((val) => /[A-Z]/.test(val), {
			message: 'A senha deve conter pelo menos uma letra maiúscula',
		})
		.refine((val) => /[a-z]/.test(val), {
			message: 'A senha deve conter pelo menos uma letra minúscula',
		})
		.refine((val) => /[0-9]/.test(val), {
			message: 'A senha deve conter pelo menos um número',
		})
		.refine((val) => /[^A-Za-z0-9]/.test(val), {
			message: 'A senha deve conter pelo menos um símbolo (ex: !@#$%)',
		}),
	phoneNumber: z
		.string()
		.min(10, 'Digite um telefone válido')
		.refine(
			(val) => {
				const numbers = val.replace(/\D/g, '');
				return numbers.length === 10 || numbers.length === 11;
			},
			{ message: 'Digite um telefone brasileiro válido' },
		),
	monthlyIncome: z
		.string()
		.min(1, 'Digite um valor')
		.refine((val) => !Number.isNaN(Number(val)) && val.trim() !== '', {
			message: 'Digite um número válido, se estiver utilizando vírgula, use o ponto',
		})
		.refine((val) => Number(val) >= 0, {
			message: 'O rendimento deve ser maior ou igual a zero',
		}),
});

export type FormRegisterData = z.infer<typeof FormRegisterDataSchema>;

export const FormLoginDataSchema = z.object({
	email: z.email('Digite um email válido'),
	password: z.string(),
});

export type FormLoginData = z.infer<typeof FormLoginDataSchema>;

export type AuthRegisterResponse = {
	name: string;
	id: string;
	email: string;
	createdAt: Date;
	hashedPassword: string;
	role: Role;
	monthlyIncome: number;
	phoneNumber: string;
	updatedAt: Date;
};

export type AuthLoginResponse = {
	token: string;
	user: User;
};

type Role = 'USER' | 'ADMIN';

export type User = {
	name: string;
	id: string;
	email: string;
	createdAt: Date;
	hashedPassword: string;
	role: Role;
	monthlyIncome: number;
	phoneNumber: string;
	updatedAt: Date;
};
