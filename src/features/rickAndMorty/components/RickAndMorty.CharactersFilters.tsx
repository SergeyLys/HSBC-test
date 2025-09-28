import React, { ChangeEvent, useEffect } from "react";
import {
	CHARACTER_STATUSES,
	DEBOUNCE_DELAY,
} from "../api/rickAndMorty.constants";
import { CharacterFilters } from "../api/rickAndMorty.types";
import { Select } from "../../../ui/Select";
import { debounce } from "../../../utils/debounce";

export interface CharactersFiltersProps extends CharacterFilters {
	onChange: (next: CharacterFilters) => void;
	onRefresh: () => void;
}

const statusOptions = [
	{ label: "Any status", value: "" },
	...CHARACTER_STATUSES.map((status) => ({ label: status, value: status })),
];

export function CharactersFilters(
	props: CharactersFiltersProps
): React.ReactElement {
	const { onChange, onRefresh } = props;

	const debouncedRefresh = debounce(onRefresh, DEBOUNCE_DELAY);

	useEffect(() => {
		return () => {
			debouncedRefresh.cancel?.();
		};
	}, [debouncedRefresh]);

	const onFieldChange = (
		e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const field = e.target.name;
		const value = e.target.value;
		onChange({
			[field]: value,
		});
	};

	const onFilterClear = () => {
		const cleared = { name: undefined, status: undefined };
		onChange(cleared);
	};

	return (
		<div
			style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}
		>
			<input
				name="name"
				placeholder="Filter by name"
				value={props.name || ""}
				onChange={onFieldChange}
				style={{ padding: 8, border: "1px solid #ddd", borderRadius: 4 }}
			/>
			<Select
				name="status"
				onChange={onFieldChange}
				value={props.status || ""}
				options={statusOptions}
			/>
			<button
				type="button"
				onClick={onFilterClear}
				style={{ padding: "8px 12px" }}
			>
				Clear
			</button>
			<button
				type="button"
				onClick={debouncedRefresh}
				style={{ padding: "8px 12px" }}
			>
				Refresh
			</button>
		</div>
	);
}
