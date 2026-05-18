import { Plus } from 'lucide-react';
import { Button } from './ui/button';

export default function NewLaunchButton() {
	return (
		<Button className='cursor-pointer bg-[#1f7a6b] hover:bg-[#2fae8f] text-white h-12 px-6 flex items-center mt-3'>
			<Plus className='size-5' />
			<span className='leading-none'>Novo Lançamento</span>
		</Button>
	);
}
