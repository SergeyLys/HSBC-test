import {
	useReactTable,
	ColumnDef,
	getCoreRowModel,
	flexRender,
} from "@tanstack/react-table";
import { Link, useSearch } from "@tanstack/react-router";
import { Character } from "../api/rickAndMorty.model";
import { useMemo } from "react";

interface CharactersGridProps {
	characters: Character[];
}

export const CharactersGrid = function ({ characters }: CharactersGridProps) {
	const search = useSearch({ from: "/" });
	const columns: ColumnDef<Character>[] = [
		{
			id: "image",
			header: "Avatar",
			cell: ({ row }) => (
				<img
					src={row.original.image}
					alt={row.original.name}
					style={{ width: 60, height: 60, borderRadius: "50%" }}
				/>
			),
		},
		{
			accessorKey: "name",
			header: "Name",
			cell: ({ row }) => (
				<Link
					to="/character/$id"
					params={{ id: row.original.id }}
					state={{ charactersSearch: search }}
					style={{
						textDecoration: "none",
						color: "inherit",
						fontWeight: 600,
					}}
				>
					{row.original.name}
				</Link>
			),
		},
		{
			id: "statusSpecies",
			header: "Status | Species",
			cell: ({ row }) => (
				<span style={{ fontSize: 12, color: "#6b7280" }}>
					{row.original.status} | {row.original.species}
				</span>
			),
		},
	];

	const table = useReactTable({
		data: characters,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	const charactersIds = characters.map((c) => c.id).join(",");
	const rows = useMemo(() => table.getRowModel().rows, [charactersIds]);

	return (
		<table
			style={{
				width: "100%",
				borderCollapse: "collapse",
				border: "1px solid #e5e7eb",
				borderRadius: 8,
			}}
		>
			<thead>
				{table.getHeaderGroups().map((headerGroup) => (
					<tr key={headerGroup.id} style={{ background: "#f9fafb" }}>
						{headerGroup.headers.map((header) => (
							<th
								key={header.id}
								style={{
									textAlign: "left",
									padding: "8px 12px",
									borderBottom: "1px solid #e5e7eb",
								}}
							>
								{header.isPlaceholder
									? null
									: flexRender(
											header.column.columnDef.header,
											header.getContext()
									  )}
							</th>
						))}
					</tr>
				))}
			</thead>
			<tbody>
				{rows.map((row) => (
					<tr key={row.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
						{row.getVisibleCells().map((cell) => (
							<td
								key={cell.id}
								style={{ padding: "8px 12px", verticalAlign: "middle" }}
							>
								{flexRender(cell.column.columnDef.cell, cell.getContext())}
							</td>
						))}
					</tr>
				))}
			</tbody>
		</table>
	);
};
