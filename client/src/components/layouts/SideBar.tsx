import { useQueryClient } from '@tanstack/react-query';
import { ChevronRight, LayoutDashboard, LogOut, PanelRightOpen, Plus, TableOfContents, Tag, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { paths } from '@/config/paths';
import { logout } from '@/lib/api-client';
import { useAuth } from '@/providers/AuthProvider';
import { Button } from '../ui/button';
import { ThemeButton } from '../ui/ThemeButton';

interface SideBarProps {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const navItems = [
	{ icon: LayoutDashboard, label: 'Dashboard', href: paths.app.dashboard.getHref() },
	{ icon: TableOfContents, label: 'Lançamentos', href: paths.app.launches.getHref() },
	{ icon: Tag, label: 'Categorias', href: '#' },
];

export default function SideBar({ open, setOpen }: SideBarProps) {
	const { user, setUser } = useAuth();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	return (
		<aside
			className={`fixed top-0 left-0 h-screen w-64 bg-sidebar z-50 flex flex-col shadow-xl transition-transform md:static duration-300 ease-in-out ${
				open ? 'translate-x-0' : '-translate-x-full'
			}`}
		>
			{/* Sidebar Header */}
			<div className='h-14 flex items-center justify-between px-4 border-b shrink-0'>
				<div className='flex items-center gap-2'>
					<img
						src='/icone-marca.svg'
						alt='Ícone do site'
						width={26}
						className='rounded-md'
					/>
					<span className='text-sm font-semibold text-sidebar-foreground tracking-tight'>Siscodep</span>
				</div>
				<Button
					onClick={() => setOpen(false)}
					className='flex items-center justify-center w-8 h-8 rounded-lg text-sidebar-foreground hover:text-secondary-text transition-colors cursor-pointer bg-transparent border-none md:hidden'
					aria-label='Fechar menu'
				>
					<PanelRightOpen size={18} />
				</Button>
				<ThemeButton
					className='md:flex hidden rounded-full cursor-pointer border-0
				'
				/>
			</div>

			{/* Nav */}
			<nav className='flex-1 overflow-y-auto p-3 flex flex-col gap-1'>
				<h2>Menu</h2>
				{navItems.map(({ icon: Icon, label, href }) => (
					<Link
						key={label}
						to={href}
						onClick={() => {
							if (window.innerWidth < 768) {
								setOpen(false);
							}
						}}
						className='group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-primary-foreground hover:text-[#2fae8f]  text-sm font-medium transition-colors no-underline'
					>
						<Icon
							size={18}
							strokeWidth={1.8}
							className='shrink-0'
						/>
						<span className='flex-1'>{label}</span>
						<ChevronRight
							size={14}
							strokeWidth={2}
							className='text-[#2fae8f] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-150'
						/>
					</Link>
				))}
				<Button className='cursor-pointer bg-[#1f7a6b] hover:bg-[#2fae8f] text-white h-12 flex items-center mt-3'>
					<Plus className='size-5' />
					<span className='leading-none'>Novo Lançamento</span>
				</Button>
			</nav>

			{/* Footer */}
			<div className='p-3 border-t border-gray-100 shrink-0'>
				<div className='flex items-center gap-3 px-3 py-2.5 rounded-lg bg-nav-background'>
					<div className='w-8 h-8 rounded-full bg-linear-to-br from-indigo-500 to-[#2fae8f] flex items-center justify-center text-white text-xs font-semibold shrink-0'>
						<User />
					</div>
					<div className='flex-1 min-w-0'>
						<p className='text-sm font-semibold text-sidebar-foreground truncate'>{user?.name}</p>
						<p className='text-xs text-gray-400 mt-0.5'>
							{user?.role === 'USER' ? 'Usuário' : 'Administrador'}
						</p>
					</div>
					<LogOut
						className='cursor-pointer text-sidebar-foreground hover:text-secondary-text transition-colors'
						onClick={async () => {
							try {
								await logout();
								queryClient.clear();
								navigate(paths.auth.login.getHref());
								setUser(null);
							} catch (e) {
								console.error('Erro ao deslogar', e);
							}
						}}
					/>
				</div>
			</div>
		</aside>
	);
}
