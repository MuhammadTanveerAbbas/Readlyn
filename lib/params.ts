export function parseRouteId(param: string | undefined): { id: string; error?: string } {
  if (!param) {
    return { id: "", error: "Missing route parameter" };
  }

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(param)) {
    return { id: "", error: "Invalid route parameter format" };
  }

  return { id: param };
}

export function parseEnumParam<T extends string>(
  param: string | undefined,
  validValues: readonly T[],
  defaultValue: T,
): T {
  if (!param) return defaultValue;
  if (validValues.includes(param as T)) return param as T;
  return defaultValue;
}
