import { Menu } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import SideBar from './SideBar';

export default function Header() {
	const [open, setOpen] = useState(false);
	return (
		<>
			<header className='h-12 border-b flex items-center'>
				<Button
					className='bg-transparent cursor-pointer '
					onClick={() => setOpen(true)}
				>
					<Menu className='text-black  size-7' />
				</Button>
				<div className='flex gap-2'>
					<img
						src='/icone-marca.svg'
						alt='Icone do site'
						width={24}
						className='rounded'
					/>
					<h1 className='font-semibold'>Siscodep</h1>
				</div>
			</header>
			<SideBar
				open={open}
				setOpen={setOpen}
			/>
		</>
	);
}
