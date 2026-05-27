import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router';
import { paths } from '@/config/paths';
import { Button } from './ui/button';

export default function NewLaunchButton() {
	const navigate = useNavigate();
	return (
		<Button
			className='cursor-pointer bg-[#1f7a6b] hover:bg-[#2fae8f] text-white h-12 px-6 flex items-center'
			onClick={() => {
				navigate(paths.app.newLaunch.getHref());
			}}
		>
			<Plus className='size-5' />
			<span className='leading-none'>Novo Lançamento</span>
		</Button>
	);
}
