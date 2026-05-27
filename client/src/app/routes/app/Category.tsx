import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import NewCategoryForm from '@/features/category/components/NewCategoryForm';

export default function CategoryRoute() {
	const [openForm, setOpenForm] = useState<boolean>(false);
	return (
		<div className='p-4 sm:p-6 flex flex-col flex-1 min-w-0 space-y-4'>
			<div className='flex flex-col items-start md:flex-row md:items-center md:justify-between mb-3'>
				<div>
					<h2 className='text-foreground font-bold text-xl'>Categorias</h2>
					<span className='text-sm text-secondary-foreground'>8 Categorias</span>
				</div>
				<Button
					className='cursor-pointer bg-[#1f7a6b] hover:bg-[#2fae8f] text-white h-12 px-6 flex items-center mt-3'
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
		</div>
	);
}
