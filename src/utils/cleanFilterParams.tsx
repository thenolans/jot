export default function cleanFilterParams(
  searchParams: string,
  supportedFilters: string[]
): string {
  const urlParams = new URLSearchParams(searchParams);
  const params = Array.from(urlParams.keys());

  params.forEach((param) => {
    if (!supportedFilters.includes(param)) {
      urlParams.delete(param);
    }
  });

  return urlParams.toString();
}
