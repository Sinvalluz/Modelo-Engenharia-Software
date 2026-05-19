import { ArrowUpDown, Pencil, Trash } from 'lucide-react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function LaunchesCard() {
	return (
		<Table className='flex-1 '>
			<TableCaption>Uma lista dos seus lançamentos recentes.</TableCaption>
			<TableHeader className='bg-card'>
				<TableRow className=''>
					<TableHead className='flex items-center gap-0.5'>
						DATA <ArrowUpDown className='size-3.5' />
					</TableHead>
					<TableHead>DESCRIÇÃO</TableHead>
					<TableHead>CATEGORIA</TableHead>
					<TableHead>TIPO</TableHead>
					<TableHead className='flex items-center gap-0.5'>
						VALOR <ArrowUpDown className='size-3.5' />
					</TableHead>
					<TableHead>AÇÕES</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				<TableRow>
					<TableCell className='text-secondary-foreground'>19/05/2026</TableCell>
					<TableCell>Exemplo de lançamento</TableCell>
					<TableCell>Categoria</TableCell>
					<TableCell className='py-3'>
						<span className='inline-flex rounded-full bg-red-300 px-3 py-1 text-red-600'>Despesa</span>
					</TableCell>
					<TableCell className='text-red-700 font-bold'>-R$ 245,00</TableCell>
					<TableCell className='space-x-2'>
						<Pencil className='size-3.5 inline' />
						<Trash className='size-3.5  inline' />
					</TableCell>
				</TableRow>
			</TableBody>
		</Table>
	);
}
