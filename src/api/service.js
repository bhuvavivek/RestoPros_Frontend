import { useMemo } from "react";
import useSWR from "swr";

import { endpoints, fetcher } from "src/utils/axios";

export function useGetServices() {
  const URL = endpoints.service.list;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      services: data?.data || [],
      servicesLoading: isLoading,
      servicesError: error,
      servicesValidating: isValidating,
      servicesEmpty: !isLoading && !data?.data.length,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}


