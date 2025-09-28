import React from "react";

interface PaginationProps {
	page: number;
	totalPages: number;
	onChangePage: (page: number) => void;
}

export function Pagination(props: PaginationProps): React.ReactElement {
	const { page, totalPages, onChangePage } = props;

	return (
		<div style={{ display: "flex", gap: 8, alignItems: "center" }}>
			<button
				type="button"
				onClick={() => onChangePage(page - 1)}
				disabled={page <= 1}
				style={{ padding: "8px 12px" }}
			>
				Prev
			</button>
			<span>
				Page {page} / {Math.max(totalPages, 1)}
			</span>
			<button
				type="button"
				onClick={() => onChangePage(page + 1)}
				disabled={totalPages === 0 || page >= totalPages}
				style={{ padding: "8px 12px" }}
			>
				Next
			</button>
		</div>
	);
}
