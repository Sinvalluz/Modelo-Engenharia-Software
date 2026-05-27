import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import CategoriesCard from '@/features/category/components/cards/CategoriesCard';
import EmptyCategoriesCard from '@/features/category/components/cards/EmptyCategoriesCard';
import ErrorCategoriesCard from '@/features/category/components/cards/ErrorCategoriesCard';
import LoadingCategoriesCard from '@/features/category/components/cards/LoadingCategoriesCard';
import NewCategoryForm from '@/features/category/components/NewCategoryForm';
import findAllCategories from '@/lib/findAllCategories';

export default function CategoryRoute() {
	const [openForm, setOpenForm] = useState<boolean>(false);
	const categoryQuery = useQuery({
		queryKey: ['categories'],
		queryFn: findAllCategories,
	});
	const categories = Array.isArray(categoryQuery.data?.data) ? categoryQuery.data.data : [];

	return (
		<div className='p-4 sm:p-6 flex flex-col flex-1 min-w-0 space-y-4'>
			<div className='flex flex-col items-start md:flex-row md:items-center md:justify-between mb-3'>
				<div>
					<h2 className='text-foreground font-bold text-xl'>Categorias</h2>
					<span className='text-sm text-secondary-foreground'>
						{categories.length === 1 ? '1 Categoria' : `${categories.length} Categorias`}
					</span>
				</div>
				<Button
					className='cursor-pointer bg-[#1f7a6b] hover:bg-[#2fae8f] text-white h-12 px-6 flex items-center '
					onClick={() => setOpenForm(!openForm)}
				>
					{openForm ? (
						<span>Cancelar</span>
					) : (
						<>
							<Plus className='size-5' />
							<span className='leading-none'>nova categoria</span>
						</>
					)}
				</Button>
			</div>
			{openForm && <NewCategoryForm />}
			{categoryQuery.isLoading && <LoadingCategoriesCard />}
			{categoryQuery.isError && <ErrorCategoriesCard onRetry={() => categoryQuery.refetch()} />}
			{categoryQuery.isSuccess &&
				(categories.length === 0 ? <EmptyCategoriesCard /> : <CategoriesCard data={categories} />)}
		</div>
	);
}
