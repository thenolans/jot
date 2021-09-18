import { parse, ParsedQuery, stringify } from "query-string";
import { useCallback, useMemo } from "react";
import { useHistory, useLocation } from "react-router-dom";

type ParsedQueryValue = ParsedQuery[keyof ParsedQuery];

export default function useSearchParams(): [
  ParsedQuery,
  (newSearchParams: { [key: string]: any }) => void
] {
  const history = useHistory();
  const location = useLocation();

  const searchParams = useMemo(() => parse(location.search), [location.search]);

  const setSearchParams = useCallback(
    (newSearchParams) =>
      history.push({
        ...location,
        search: stringify({
          ...parse(location.search),
          ...newSearchParams,
        }),
      }),
    [history, location]
  );

  return [searchParams, setSearchParams];
}

export function asStringParam(value: ParsedQueryValue) {
  return (Array.isArray(value) ? value[0] : value) ?? undefined;
}

export function asBooleanParam(value: ParsedQueryValue) {
  const string = asStringParam(value) || "";
  if (string.toLowerCase() === "true") return true;
  if (string.toLowerCase() === "false") return false;
  return undefined;
}

// Return `number | undefined` to support nullish coalescing for invalid numbers.
export function asNumberParam(value: ParsedQueryValue) {
  const string = asStringParam(value) || "";
  const number = string.trim() ? Number(string) : NaN;
  return Number.isNaN(number) ? undefined : number;
}

export function asStringArrayParam(value: ParsedQueryValue) {
  return (Array.isArray(value) ? value : [value]).filter(
    (item) => item != null
  ) as string[];
}

export function asNumberArrayParam(value: ParsedQueryValue) {
  return asStringArrayParam(value)
    .filter((string) => string.trim())
    .map(Number)
    .filter((number) => !Number.isNaN(number));
}

export function asEnumParam<T extends Record<string, string>>(
  value: ParsedQueryValue,
  enumObject: T
) {
  const firstValue = Array.isArray(value) ? value[0] : value;
  return (Object.values(enumObject) as T[keyof T][]).find(
    (enumValue) => enumValue === firstValue
  );
}

export function asEnumArrayParam<T extends Record<string, string>>(
  value: ParsedQueryValue,
  enumObject: T
) {
  const enumValues = Object.values(enumObject);
  return (Array.isArray(value) ? value : [value]).filter(
    (element) => typeof element === "string" && enumValues.includes(element)
  ) as T[keyof T][];
}
