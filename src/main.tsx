import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { rootRoute } from "./features/rickAndMorty/routes/root";
import { charactersRoute } from "./features/rickAndMorty/routes/RickAndMorty.characters";
import { characterRoute } from "./features/rickAndMorty/routes/RickAndMorty.character.$id";
import { CharacterSearch } from "./features/rickAndMorty/state/search";
import { QueryClient } from "@tanstack/react-query";
import { NotFoundError } from "./utils/errors";
import { CACHE_TIME } from "./features/rickAndMorty/api/rickAndMorty.constants";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: CACHE_TIME,
			retry: (failureCount, error) => {
				if (error instanceof NotFoundError) return false;
				return failureCount < 3;
			},
		},
	},
});

const routeTree = rootRoute.addChildren([charactersRoute, characterRoute]);

const router = createRouter({
	routeTree,
});

declare module "@tanstack/react-router" {
	interface HistoryState {
		charactersSearch?: CharacterSearch;
	}
}

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<RouterProvider router={router} />
		</QueryClientProvider>
	</React.StrictMode>
);
