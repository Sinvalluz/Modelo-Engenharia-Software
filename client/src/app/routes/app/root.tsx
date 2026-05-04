import { Outlet } from 'react-router';

export function ErrorBoundary() {
	return <div>Something went wrong!</div>;
}

export default function AppRoot() {
	return (
		<div>
			<Outlet />
		</div>
	);
}
