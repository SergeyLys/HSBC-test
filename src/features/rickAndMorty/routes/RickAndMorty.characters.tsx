import React, { useEffect, useRef } from "react";
import {
	createRoute,
	ErrorComponent,
	useNavigate,
	useSearch,
} from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { rootRoute } from "./root";
import { CharactersFilters } from "../components/RickAndMorty.CharactersFilters";
import { CharactersGrid } from "../components/RickAndMorty.CharactersGrid";
import { Pagination } from "../../../ui/Pagination";
import { getCharacters } from "../api/rickAndMorty.service";
import {
	DEBOUNCE_DELAY,
	PAGE_SIZE_OPTIONS,
} from "../api/rickAndMorty.constants";
import { ConditionalRenderer } from "../../../ui/ConditionalRenderer";
import { Select } from "../../../ui/Select";
import { searchSchema, CharacterSearch } from "../state/search";
import { useDebouncedValue } from "../../../hooks/useDebouncedValue";
import { isOneOf } from "../../../utils/typesUtils";
import { withErrorHandler } from "../../../utils/withErrorHandler";

export const charactersRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/",
	validateSearch: (search) =>
		withErrorHandler(
			() => searchSchema.parse(search),
			"Search params validation failed"
		),
	component: CharactersPage,
	errorComponent: ErrorComponent,
});

const pageSizeOptionObjects = PAGE_SIZE_OPTIONS.map((size) => ({
	label: String(size),
	value: size,
}));

function CharactersPage(): React.ReactElement {
	// totalPagesRef - to prevent pagination flickering
	const totalPagesRef = useRef(0);
	const isRefetching = useRef(false);
	const navigate = useNavigate({ from: "/" });
	const { page, pageSize, name, status } = useSearch({ from: "/" });

	const debouncedPage = useDebouncedValue(page, DEBOUNCE_DELAY);
	const debouncedPageSize = useDebouncedValue(pageSize, DEBOUNCE_DELAY);
	const debouncedName = useDebouncedValue(name, DEBOUNCE_DELAY);
	const debouncedStatus = useDebouncedValue(status, DEBOUNCE_DELAY);

	const { data, isLoading, isError, error, refetch } = useQuery({
		queryKey: [
			"characters",
			{
				page: debouncedPage,
				pageSize: debouncedPageSize,
				name: debouncedName,
				status: debouncedStatus,
			},
		],
		queryFn: ({ signal }) =>
			getCharacters(
				{
					page: debouncedPage,
					pageSize: debouncedPageSize,
					name: debouncedName,
					status: debouncedStatus,
				},
				signal,
				isRefetching.current
			),
	});

	useEffect(() => {
		if (data) {
			totalPagesRef.current = data.info.pages;
		}
	}, [data?.info?.pages]);

	const setSearch = (next: Partial<CharacterSearch>) => {
		navigate({
			search: (old: Partial<CharacterSearch>) => ({ ...old, ...next }),
			replace: true,
			state: {},
		});
	};

	const applyFilters = (next: Partial<CharacterSearch>) => {
		setSearch({ ...next, page: 1 });
	};

	const changePage = (nextPage: number) => {
		setSearch({ page: Math.max(1, nextPage) });
	};

	const changePageSize = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const size = Number(e.target.value);
		if (isOneOf(size, PAGE_SIZE_OPTIONS)) {
			setSearch({ pageSize: size, page: 1 });
		}
	};

	const onRefetch = async () => {
		isRefetching.current = true;
		try {
			return await refetch();
		} finally {
			isRefetching.current = false;
		}
	};

	const isPageDebouncing = page !== debouncedPage;
	const isPageSizeDebouncing = pageSize !== debouncedPageSize;
	const isNameDebouncing = name !== debouncedName;
	const isStatusDebouncing = status !== debouncedStatus;
	const isDebouncing =
		isPageSizeDebouncing ||
		isPageDebouncing ||
		isNameDebouncing ||
		isStatusDebouncing;

	return (
		<div>
			<h1 style={{ margin: "0 0 12px" }}>Characters</h1>
			<CharactersFilters
				name={name}
				status={status}
				onChange={applyFilters}
				onRefresh={onRefetch}
			/>

			<div
				style={{
					display: "flex",
					gap: "8px",
					marginBottom: 12,
					flexWrap: "wrap",
				}}
			>
				<Select
					value={pageSize}
					onChange={changePageSize}
					options={pageSizeOptionObjects}
					label="Page size:"
				/>
				<Pagination
					page={page}
					totalPages={data?.info?.pages || totalPagesRef.current || 0}
					onChangePage={changePage}
				/>
			</div>

			<ConditionalRenderer
				isLoading={isLoading}
				isError={isError}
				error={error}
				data={data?.results || []}
			>
				{(data) => (
					<div
						style={{
							opacity: isDebouncing ? 0.5 : 1,
							pointerEvents: isDebouncing ? "none" : "auto",
						}}
					>
						<CharactersGrid characters={data} />
					</div>
				)}
			</ConditionalRenderer>
		</div>
	);
}
