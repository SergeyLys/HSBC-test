import { ErrorComponent } from "@tanstack/react-router";
import React from "react";

interface ConditionalRendererProps<T> {
	isLoading: boolean;
	isError: boolean;
	error?: Error | null | unknown;
	data?: T | null;
	children: (data: T) => React.ReactNode;
}

export function ConditionalRenderer<T>({
	isLoading,
	isError,
	error,
	data,
	children,
}: ConditionalRendererProps<T>) {
	if (isLoading) {
		return <div>Loading…</div>;
	}

	if (isError) {
		return <ErrorComponent error={error} />;
	}

	if (!data) {
		return <div>Not found</div>;
	}

	return <>{children(data)}</>;
}
