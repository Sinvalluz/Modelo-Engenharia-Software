import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { ArrowDown, ArrowUp, ArrowUpDown, Pencil, Tag, Trash } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { CategoryResponse, CategoryType } from '@/types/category';
import deleteCategory from '../../services/deleteCategory';
import updateCategory from '../../services/updateCategory';

type CategoriesCardProps = {
	data: CategoryResponse[];
};

type SortField = 'name';
type SortDirection = 'asc' | 'desc';

function getCategoryTypeLabel(type: CategoryType) {
	return type === 'EXPENSES' ? 'Despesa' : 'Receita';
}

function getApiErrorMessage(error: unknown, fallback: string) {
	const axiosError = error as AxiosError<{ message?: string | string[] }>;
	const message = axiosError.response?.data?.message;

	if (Array.isArray(message)) return message.join(', ');

	return message ?? fallback;
}

export default function CategoriesCard({ data }: CategoriesCardProps) {
	const categories = Array.isArray(data) ? data : [];
	const [sort, setSort] = useState<{ field: SortField; direction: SortDirection } | null>(null);
	const [categoryToEdit, setCategoryToEdit] = useState<CategoryResponse | null>(null);
	const [categoryToDelete, setCategoryToDelete] = useState<CategoryResponse | null>(null);
	const [editName, setEditName] = useState('');
	const [editColor, setEditColor] = useState('#000000');
	const [editType, setEditType] = useState<CategoryType>('EXPENSES');
	const queryClient = useQueryClient();
	const deleteCategoryMutation = useMutation({
		mutationFn: deleteCategory,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['categories'] });
			setCategoryToDelete(null);
		},
	});
	const updateCategoryMutation = useMutation({
		mutationFn: updateCategory,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['categories'] });
			setCategoryToEdit(null);
		},
	});

	const sortedCategories = useMemo(() => {
		if (!sort) return categories;

		return [...categories].sort((firstCategory, secondCategory) => {
			const result = firstCategory.name.localeCompare(secondCategory.name, 'pt-BR');

			return sort.direction === 'asc' ? result : -result;
		});
	}, [categories, sort]);

	function toggleSort(field: SortField) {
		setSort((currentSort) => {
			if (currentSort?.field !== field) {
				return { field, direction: 'asc' };
			}

			return {
				field,
				direction: currentSort.direction === 'asc' ? 'desc' : 'asc',
			};
		});
	}

	function renderSortIcon(field: SortField) {
		if (sort?.field !== field) return <ArrowUpDown className='size-3.5' />;

		return sort.direction === 'asc' ? <ArrowUp className='size-3.5' /> : <ArrowDown className='size-3.5' />;
	}

	function getSortLabel(field: SortField) {
		if (sort?.field !== field) return 'none';

		return sort.direction === 'asc' ? 'ascending' : 'descending';
	}

	function openEditDialog(category: CategoryResponse) {
		setCategoryToEdit(category);
		setEditName(category.name);
		setEditColor(category.color);
		setEditType(category.categoryType);
		updateCategoryMutation.reset();
	}

	function closeEditDialog() {
		if (!updateCategoryMutation.isPending) {
			setCategoryToEdit(null);
		}
	}

	function submitCategoryEdit() {
		if (!categoryToEdit || !editName.trim()) return;

		updateCategoryMutation.mutate({
			id: categoryToEdit.id,
			data: {
				name: editName.trim(),
				color: editColor,
				categoryType: editType,
			},
		});
	}

	return (
		<>
			<Table className='flex-1'>
				<TableCaption>Uma lista das suas categorias cadastradas.</TableCaption>
				<TableHeader className='bg-card'>
					<TableRow>
						<TableHead
							className='min-w-40'
							aria-sort={getSortLabel('name')}
						>
							<button
								type='button'
								className='inline-flex h-full items-center gap-1 p-0 text-left font-medium text-inherit whitespace-nowrap bg-transparent cursor-pointer'
								onClick={() => toggleSort('name')}
							>
								NOME {renderSortIcon('name')}
							</button>
						</TableHead>
						<TableHead>COR</TableHead>
						<TableHead>TIPO</TableHead>
						<TableHead>AÇÕES</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{sortedCategories.map((category) => {
						const isExpense = category.categoryType === 'EXPENSES';

						return (
							<TableRow key={category.id}>
								<TableCell className='font-medium text-foreground'>{category.name}</TableCell>
								<TableCell>
									<div className='flex items-center gap-2'>
										<span
											className='size-4 rounded-full border border-slate-200'
											style={{ backgroundColor: category.color }}
											aria-hidden='true'
										/>
										<span className='text-secondary-foreground'>{category.color}</span>
									</div>
								</TableCell>
								<TableCell className='py-3'>
									<span
										className={`inline-flex rounded-full w-24 py-1 justify-center ${
											isExpense ? 'bg-red-300 text-red-600' : 'bg-green-100 text-green-700'
										}`}
									>
										{getCategoryTypeLabel(category.categoryType)}
									</span>
								</TableCell>
								<TableCell>
									<div className='flex items-center gap-1'>
										<Button
											type='button'
											variant='ghost'
											size='icon-xs'
											className='cursor-pointer'
											aria-label={`Editar ${category.name}`}
											onClick={() => openEditDialog(category)}
										>
											<Pencil className='size-3.5' />
										</Button>
										<Button
											type='button'
											variant='ghost'
											size='icon-xs'
											className='cursor-pointer text-red-600 hover:bg-red-50 hover:text-red-700'
											aria-label={`Excluir ${category.name}`}
											onClick={() => {
												setCategoryToDelete(category);
												deleteCategoryMutation.reset();
											}}
										>
											<Trash className='size-3.5' />
										</Button>
									</div>
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>

			<Dialog
				open={Boolean(categoryToEdit)}
				onOpenChange={(open) => {
					if (!open) closeEditDialog();
				}}
			>
				<DialogContent className='gap-5 rounded-2xl p-6 sm:max-w-md'>
					<DialogHeader className='flex-row items-start gap-3 space-y-0'>
						<div className='flex size-10 shrink-0 items-center justify-center rounded-full bg-[#1f7a6b] text-white'>
							<Tag className='size-5' />
						</div>
						<div className='space-y-1 text-left'>
							<DialogTitle className='text-lg font-bold text-foreground'>Editar categoria</DialogTitle>
							<DialogDescription className='text-sm text-slate-500'>
								Atualize os dados da categoria selecionada.
							</DialogDescription>
						</div>
					</DialogHeader>

					<div className='space-y-4'>
						<div className='space-y-2'>
							<label
								htmlFor='category-name'
								className='text-sm font-medium text-foreground'
							>
								Nome
							</label>
							<Input
								id='category-name'
								value={editName}
								onChange={(event) => setEditName(event.target.value)}
								className='h-10 focus-visible:ring-[#1f7a6b]'
							/>
						</div>

						<div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
							<div className='space-y-2'>
								<label
									htmlFor='category-type'
									className='text-sm font-medium text-foreground'
								>
									Tipo
								</label>
								<Select
									value={editType}
									onValueChange={(value) => setEditType(value as CategoryType)}
								>
									<SelectTrigger
										id='category-type'
										className='h-10 w-full'
									>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectGroup>
											<SelectItem value='EXPENSES'>Despesa</SelectItem>
											<SelectItem value='INCOME'>Receita</SelectItem>
										</SelectGroup>
									</SelectContent>
								</Select>
							</div>

							<div className='space-y-2'>
								<label
									htmlFor='category-color'
									className='text-sm font-medium text-foreground'
								>
									Cor
								</label>
								<Input
									id='category-color'
									type='color'
									value={editColor || '#000000'}
									onChange={(event) => setEditColor(event.target.value.toUpperCase())}
									className='h-10 p-2 focus-visible:ring-[#1f7a6b]'
								/>
							</div>
						</div>
					</div>

					{updateCategoryMutation.isError && (
						<p className='text-sm text-red-600'>Erro ao editar categoria, tente novamente.</p>
					)}

					<div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
						<Button
							type='button'
							variant='outline'
							className='h-10 cursor-pointer border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
							disabled={updateCategoryMutation.isPending}
							onClick={closeEditDialog}
						>
							Cancelar
						</Button>
						<Button
							type='button'
							className='h-10 cursor-pointer bg-[#1f7a6b] text-white hover:bg-[#2fae8f]'
							disabled={!categoryToEdit || !editName.trim() || updateCategoryMutation.isPending}
							onClick={submitCategoryEdit}
						>
							{updateCategoryMutation.isPending ? <Spinner /> : 'Salvar alterações'}
						</Button>
					</div>
				</DialogContent>
			</Dialog>

			<Dialog
				open={Boolean(categoryToDelete)}
				onOpenChange={(open) => {
					if (!open && !deleteCategoryMutation.isPending) {
						setCategoryToDelete(null);
					}
				}}
			>
				<DialogContent
					showCloseButton={false}
					className='gap-5 rounded-2xl p-6 sm:max-w-96.25'
				>
					<DialogHeader className='flex-row items-start gap-3 space-y-0'>
						<div className='flex size-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600'>
							<Trash className='size-5' />
						</div>
						<div className='space-y-1 text-left'>
							<DialogTitle className='text-lg font-bold text-foreground'>Excluir categoria?</DialogTitle>
							<DialogDescription className='text-sm text-slate-500'>
								Esta ação não pode ser desfeita.
							</DialogDescription>
						</div>
					</DialogHeader>

					{categoryToDelete && (
						<div className='rounded-lg border border-secondary bg-secondary px-3 py-3 text-left'>
							<p className='font-semibold text-secondary-foreground'>{categoryToDelete.name}</p>
							<p className='mt-1 text-sm text-foreground'>
								{getCategoryTypeLabel(categoryToDelete.categoryType)}
							</p>
						</div>
					)}

					{deleteCategoryMutation.isError && (
						<p className='text-sm text-red-600'>
							{getApiErrorMessage(
								deleteCategoryMutation.error,
								'Erro ao excluir categoria, tente novamente.',
							)}
						</p>
					)}

					<div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
						<Button
							type='button'
							variant='outline'
							className='h-10 cursor-pointer border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
							disabled={deleteCategoryMutation.isPending}
							onClick={() => setCategoryToDelete(null)}
						>
							Cancelar
						</Button>
						<Button
							type='button'
							className='h-10 cursor-pointer bg-red-600 text-white hover:bg-red-700'
							disabled={!categoryToDelete || deleteCategoryMutation.isPending}
							onClick={() => {
								if (categoryToDelete) {
									deleteCategoryMutation.mutate(categoryToDelete.id);
								}
							}}
						>
							{deleteCategoryMutation.isPending ? <Spinner /> : 'Confirmar exclusão'}
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}
