import { Link, Outlet, createRootRoute } from "@tanstack/react-router";

export const rootRoute = createRootRoute({
	component: () => (
		<div
			style={{
				fontFamily:
					"system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
			}}
		>
			<nav
				style={{
					display: "flex",
					gap: 12,
					padding: 12,
					borderBottom: "1px solid #e5e7eb",
				}}
			>
				<Link to="/">Characters</Link>
			</nav>
			<div style={{ padding: 16 }}>
				<Outlet />
			</div>
		</div>
	),
});
