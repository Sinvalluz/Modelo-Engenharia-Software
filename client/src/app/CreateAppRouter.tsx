import type { QueryClient } from '@tanstack/react-query';
import { createBrowserRouter, Outlet } from 'react-router';
import { paths } from '@/config/paths';
import LayoutRoute from './routes/app/Layout';
import PublicRoute from './routes/auth/public';

const convert = (queryClient: QueryClient) => (m: any) => {
	const { clientLoader, clientAction, default: Component, ...rest } = m;

	return {
		...rest,
		loader: clientLoader?.(queryClient),
		action: clientAction?.(queryClient),
		Component,
	};
};

export const createAppRouter = (queryClient: QueryClient) =>
	createBrowserRouter([
		{
			path: '/',
			HydrateFallback: () => null,
			children: [
				{
					path: paths.home.path,
					lazy: () => import('./routes/landing').then(convert(queryClient)),
				},
				{
					path: paths.auth.register.path,
					element: (
						<PublicRoute>
							<Outlet />
						</PublicRoute>
					),
					children: [
						{
							index: true,
							lazy: () => import('./routes/auth/register').then(convert(queryClient)),
						},
					],
				},
				{
					path: paths.auth.login.path,
					element: (
						<PublicRoute>
							<Outlet />
						</PublicRoute>
					),
					children: [
						{
							index: true,
							lazy: () => import('./routes/auth/login').then(convert(queryClient)),
						},
					],
				},
				{
					path: paths.app.root.path,
					element: (
						<LayoutRoute>
							<Outlet />
						</LayoutRoute>
					),
					children: [
						{
							path: paths.app.dashboard.path,
							lazy: () => import('./routes/app/dashboard').then(convert(queryClient)),
						},
						{
							path: paths.app.launches.path,
							lazy: () => import('./routes/app/Launches').then(convert(queryClient)),
						},
						{
							path: paths.app.newLaunch.path,
							lazy: () => import('./routes/app/NewLaunch').then(convert(queryClient)),
						},
						{
							path: paths.app.editLaunch.path,
							lazy: () => import('./routes/app/EditLaunch').then(convert(queryClient)),
						},
						{
							path: paths.app.category.path,
							lazy: () => import('./routes/app/Category').then(convert(queryClient)),
						},
					],
				},
				{
					path: '*',
					lazy: () => import('./routes/not-found').then(convert(queryClient)),
				},
			],
		},
	]);
