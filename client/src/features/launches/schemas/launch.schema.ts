import z from 'zod';

export const launchFormSchema = z.object({
	type: z.string('Selecione o tipo'),
	value: z.string().min(0.01, 'Informe um valor válido'),
	date: z.string().min(1, 'Informe a data'),
	categoryId: z.string().min(1, 'Selecione uma categoria'),
	description: z.string().min(3, 'Insira uma descrição valida'),
	paymentMethod: z.string().min(1, 'Selecione a forma de pagamento'),
	AccountType: z.string().min(1, 'Selecione a conta'),
	installments_quantity: z.string().optional(),
});

export type LaunchFormData = z.infer<typeof launchFormSchema>;
