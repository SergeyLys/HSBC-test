import React from "react";

interface SelectProps<T extends string | number> {
	value?: T;
	defaultValue?: T;
	options: { label: string; value: T }[];
	onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
	label?: string;
	name?: string;
	ref?: React.Ref<HTMLSelectElement>;
}

export function Select<T extends string | number>({
	ref,
	defaultValue,
	value,
	options,
	onChange,
	label,
	name,
}: SelectProps<T>) {
	return (
		<div
			style={{
				display: "flex",
				gap: 8,
				alignItems: "center",
			}}
		>
			{label && <span>{label}</span>}
			<select
				ref={ref}
				name={name}
				value={value}
				defaultValue={defaultValue}
				onChange={onChange}
				style={{
					padding: 8,
					border: "1px solid #ddd",
					borderRadius: 4,
					textTransform: "capitalize",
				}}
			>
				{options.map(({ label, value }, i) => (
					<option key={`${label}-${value}-${i}`} value={value}>
						{label}
					</option>
				))}
			</select>
		</div>
	);
}
