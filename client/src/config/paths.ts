export const paths = {
	home: {
		path: '/',
		getHref: () => '/',
	},

	auth: {
		register: {
			path: 'auth/register',
			getHref: (redirectTo?: string | null | undefined) =>
				`/auth/register${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`,
		},
		login: {
			path: 'auth/login',
			getHref: (redirectTo?: string | null | undefined) =>
				`/auth/login${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`,
		},
		forgotPassword: {
			path: 'auth/forgot-password',
			getHref: () => '/auth/forgot-password',
		},
	},
	app: {
		root: {
			path: '/app',
			getHref: () => '/app',
		},
		dashboard: {
			path: '',
			getHref: () => '/app',
		},
		launches: {
			path: 'launches',
			getHref: () => '/app/launches',
		},
		newLaunch: {
			path: 'launches/new',
			getHref: () => '/app/launches/new',
		},
		editLaunch: {
			path: 'launches/:launchId/edit',
			getHref: (launchId: string) => `/app/launches/${launchId}/edit`,
		},
		category: {
			path: 'category',
			getHref: () => '/app/category',
		},
	},
} as const;
