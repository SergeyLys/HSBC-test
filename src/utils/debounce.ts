export function debounce<Args extends unknown[]>(
  func: (...args: Args) => void,
  wait: number
): {
  (...args: Args): void;
  cancel: () => void;
} {
  let timeout: ReturnType<typeof setTimeout> | null = null; 

  const debounced = (...args: Args) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };

  debounced.cancel = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
  };

  return debounced;
}