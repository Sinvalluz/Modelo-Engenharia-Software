import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { CircleCheck } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FieldGroup } from '@/components/ui/field';
import { Spinner } from '@/components/ui/spinner';
import { paths } from '@/config/paths';
import type { CategoryType } from '@/types/category';
import { type LaunchFormData, launchFormSchema } from '../../schemas/launch.schema';
import updateLaunches from '../../services/updateLaunches';
import type { Launch } from '../../types/launches.type';
import CategoryField from '../fields/CategoryField';
import DateField from '../fields/DateField';
import DescriptionField from '../fields/DescriptionField';
import LaunchTypeField from '../fields/LaunchTypeField';
import MoneyValueField from '../fields/MoneyValueField';

type EditLaunchFormProps = {
	launch: Launch;
};

function formatMoneyValue(value: string) {
	const numberValue = Number(value);

	if (!Number.isFinite(numberValue)) return '';

	return new Intl.NumberFormat('pt-BR', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}).format(numberValue);
}

function formatDateValue(value: string) {
	if (!value) return '';

	return value.slice(0, 10);
}

function parseMoneyValue(value: string) {
	return Number(
		value
			.replace(/\./g, '')
			.replace(',', '.')
			.replace(/[^\d.-]/g, ''),
	);
}

export default function EditLaunchForm({ launch }: EditLaunchFormProps) {
	const [successDialogOpen, setSuccessDialogOpen] = useState(false);
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { control, handleSubmit, reset } = useForm<LaunchFormData>({
		resolver: zodResolver(launchFormSchema),
		defaultValues: {
			type: launch.type,
			value: formatMoneyValue(launch.value),
			date: formatDateValue(launch.date),
			categoryId: launch.category.id,
			description: launch.description,
		},
	});

	const updateLaunchMutation = useMutation({
		mutationFn: updateLaunches,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['launches'] });
			setSuccessDialogOpen(true);
		},
		onError: (error: AxiosError) => {
			console.error(error.response?.data);
		},
	});

	function onSubmit(data: LaunchFormData) {
		updateLaunchMutation.mutate({
			id: launch.id,
			data: {
				categoryId: data.categoryId,
				type: data.type as CategoryType,
				value: parseMoneyValue(data.value),
				date: data.date,
				description: data.description,
			},
		});
	}

	return (
		<Card className='flex-1 bg-transparent overflow-auto'>
			<CardContent>
				{updateLaunchMutation.isError && (
					<div className='text-red-500 text-sm mb-3'>Erro ao atualizar lançamento, tente novamente</div>
				)}
				<form onSubmit={handleSubmit(onSubmit)}>
					<FieldGroup>
						<LaunchTypeField control={control} />
						<MoneyValueField control={control} />
						<div className='flex flex-col gap-5 lg:flex-row'>
							<DateField control={control} />
							<CategoryField control={control} />
						</div>

						<DescriptionField control={control} />

						<div className='flex gap-2 items-center mt-2'>
							<span className='text-red-500'>*</span>
							<span className='text-secondary-foreground'>Campos obrigatórios</span>
						</div>
						<div className='flex justify-end gap-2 '>
							<Button
								type='button'
								className='h-10 cursor-pointer bg-transparent hover:bg-zinc-200 text-secondary-foreground border border-secondary-foreground dark:bg-white dark:hover:bg-zinc-300'
								disabled={updateLaunchMutation.isPending}
								onClick={() => {
									reset();
									navigate(paths.app.launches.getHref());
								}}
							>
								Cancelar
							</Button>
							<Button
								type='submit'
								disabled={updateLaunchMutation.isPending}
								className='cursor-pointer bg-[#1f7a6b] hover:bg-[#2fae8f] h-10 text-white'
							>
								{updateLaunchMutation.isPending ? <Spinner /> : 'Salvar alterações'}
							</Button>
						</div>
					</FieldGroup>
				</form>
			</CardContent>
			<Dialog
				open={successDialogOpen}
				onOpenChange={(open) => {
					setSuccessDialogOpen(open);

					if (!open) {
						navigate(paths.app.launches.getHref());
					}
				}}
			>
				<DialogContent className='text-center sm:max-w-md'>
					<DialogHeader className='items-center'>
						<div className='flex size-14 items-center justify-center rounded-full bg-green-100 text-green-700'>
							<CircleCheck className='size-8' />
						</div>
						<DialogTitle>Lançamento atualizado com sucesso!</DialogTitle>
						<DialogDescription>As alterações foram salvas e a lista será atualizada.</DialogDescription>
					</DialogHeader>
				</DialogContent>
			</Dialog>
		</Card>
	);
}
