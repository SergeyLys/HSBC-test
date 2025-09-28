import { NotFoundError } from "./errors";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface FetchHandlerOptions<TBody> {
  method?: HttpMethod;
  body?: TBody;
  headers?: Record<string, string>;
  searchParams?: Record<string, string | number | boolean | undefined | null>;
  signal?: AbortSignal;
}

export async function fetchHandler<TResponse, TRequest>(
  url: string,
  options: FetchHandlerOptions<TRequest> = {}
): Promise<TResponse> {
  const {
    method = "GET",
    body,
    headers = {},
    searchParams = {},
    signal,
  } = options;

  const controller = new AbortController();
  const combinedSignal = signal
    ? mergeAbortSignals(signal, controller.signal)
    : controller.signal;

  const urlObj = new URL(url, window.location.origin);
  Object.entries(searchParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      urlObj.searchParams.append(key, String(value));
    }
  });

  try {
    const response = await fetch(urlObj.toString(), {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: combinedSignal,
    });

    if (!response.ok) {
      try {
        const errorData = await response.json().catch(() => null);

        if (response.status === 404) {
          throw new NotFoundError(errorData?.error || errorData?.message || "Resource not found");
        }

        throw new Error(
          `HTTP ${response.status}: ${response.statusText} | ${errorData?.error || errorData}`
        );
      } catch (err) {
        throw err;
      }
    }

    return await response.json();
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      console.warn("Fetch aborted:", urlObj.toString());
    }
    throw err;
  }
}

function mergeAbortSignals(signalA: AbortSignal, signalB: AbortSignal): AbortSignal {
  const ctrl = new AbortController();
  const forward = (signal: AbortSignal) =>
    signal.addEventListener("abort", () => ctrl.abort(), { once: true });
  forward(signalA);
  forward(signalB);
  return ctrl.signal;
}
