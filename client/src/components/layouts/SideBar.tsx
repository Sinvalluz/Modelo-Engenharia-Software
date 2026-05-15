import { useQueryClient } from '@tanstack/react-query';
import { ChevronRight, LayoutDashboard, LogOut, PanelRightOpen, Plus, TableOfContents, Tag, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { paths } from '@/config/paths';
import { logout } from '@/lib/api-client';
import { useAuth } from '@/providers/AuthProvider';
import { Button } from '../ui/button';

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
			className={`fixed top-0 left-0 h-screen w-64 bg-white z-50 flex flex-col shadow-xl transition-transform duration-300 ease-in-out ${
				open ? 'translate-x-0' : '-translate-x-full'
			}`}
		>
			{/* Sidebar Header */}
			<div className='h-14 flex items-center justify-between px-4 border-b border-gray-100 shrink-0'>
				<div className='flex items-center gap-2'>
					<img
						src='/icone-marca.svg'
						alt='Ícone do site'
						width={26}
						className='rounded-md'
					/>
					<span className='text-sm font-semibold text-gray-900 tracking-tight'>Siscodep</span>
				</div>
				<Button
					onClick={() => setOpen(false)}
					className='flex items-center justify-center w-8 h-8 rounded-lg text-black/40 hover:bg-gray-100 hover:text-black/90 transition-colors cursor-pointer bg-transparent border-none'
					aria-label='Fechar menu'
				>
					<PanelRightOpen size={18} />
				</Button>
			</div>

			{/* Nav */}
			<nav className='flex-1 overflow-y-auto p-3 flex flex-col gap-0.5'>
				<h2>Menu</h2>
				{navItems.map(({ icon: Icon, label, href }) => (
					<Link
						key={label}
						to={href}
						onClick={() => setOpen(false)}
						className='group flex items-center gap-3 px-3 py-2.5 rounded-lg text-black/60 hover:bg-gray-100 hover:text-black/90 text-sm font-medium transition-colors no-underline'
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
							className='text-gray-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-150'
						/>
					</Link>
				))}
				<Button className='py-6 cursor-pointer bg-[#1f7a6b] hover:bg-[#2fae8f]'>
					<Plus /> Novo Lançamento
				</Button>
			</nav>

			{/* Footer */}
			<div className='p-3 border-t border-gray-100 shrink-0'>
				<div className='flex items-center gap-3 px-3 py-2.5 rounded-lg bg-gray-50'>
					<div className='w-8 h-8 rounded-full bg-linear-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-xs font-semibold shrink-0'>
						<User />
					</div>
					<div className='flex-1 min-w-0'>
						<p className='text-sm font-semibold text-gray-900 truncate'>{user?.name}</p>
						<p className='text-xs text-gray-400 mt-0.5'>
							{user?.role === 'USER' ? 'Usuário' : 'Administrador'}
						</p>
					</div>
					<LogOut
						className='cursor-pointer'
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
