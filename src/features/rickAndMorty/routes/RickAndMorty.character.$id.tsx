import React from "react";
import {
	createRoute,
	Link,
	useLocation,
	useParams,
	ErrorComponent,
} from "@tanstack/react-router";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";

import { rootRoute } from "./root";
import { getCharacter } from "../api/rickAndMorty.service";
import { ConditionalRenderer } from "../../../ui/ConditionalRenderer";

export const characterIdParams = z.object({ id: z.number().int().min(1) });

export const characterRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/character/$id",
	params: {
		parse: (raw) => ({ id: Number(raw.id) }),
		stringify: ({ id }) => ({ id: String(id) }),
	},
	component: CharacterPage,
	errorComponent: ErrorComponent,
});

function CharacterPage(): React.ReactElement {
	const charactersSearch = useLocation({
		select: (location) => location.state.charactersSearch,
	});
	const { id } = useParams({
		from: "/character/$id",
		select: (p) => characterIdParams.parse({ id: Number(p.id) }),
	});

	const { data, isLoading, isError, error } = useQuery({
		queryKey: ["character", id],
		queryFn: ({ signal }) => getCharacter(id, signal),
	});

	return (
		<>
			<Link to="/" search={charactersSearch}>
				← Back
			</Link>
			<ConditionalRenderer
				isLoading={isLoading}
				isError={isError}
				error={error}
				data={data}
			>
				{(data) => (
					<div style={{ display: "flex", gap: 16, marginTop: 12 }}>
						<img
							src={data.image}
							alt={data.name}
							width={300}
							height={300}
							style={{ borderRadius: 8 }}
						/>
						<div>
							<h2 style={{ marginTop: 0 }}>{data.name}</h2>
							<div>Status: {data.status}</div>
							<div>Species: {data.species}</div>
							<div>Gender: {data.gender}</div>
							<div>Origin: {data.origin.name}</div>
							<div>Location: {data.location.name}</div>
						</div>
					</div>
				)}
			</ConditionalRenderer>
		</>
	);
}
