import { Menu } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { ThemeButton } from '../ui/ThemeButton';
import SideBar from './SideBar';

export default function Header() {
	const [open, setOpen] = useState(window.innerWidth >= 768);

	useEffect(() => {
		const handleResize = () => {
			setOpen(window.innerWidth >= 768);
		};

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	return (
		<div>
			<SideBar
				open={open}
				setOpen={setOpen}
			/>
			<header className='fixed top-0 right-0 left-0 z-40 flex h-14 items-center justify-between border-b bg-background px-4 md:hidden'>
				<div className='flex items-center gap-2'>
					<Button
						className='bg-transparent cursor-pointer p-0'
						onClick={() => setOpen(true)}
					>
						<Menu className='text-foreground size-7' />
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
				</div>
				<ThemeButton />
			</header>
		</div>
	);
}
