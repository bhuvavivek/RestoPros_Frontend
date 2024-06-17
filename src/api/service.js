import { useMemo } from "react";
import useSWR from "swr";

import { endpoints, fetcher } from "src/utils/axios";

export function useGetServices() {
  const URL = endpoints.service.list;

  const { data, isLoading, error, isValidating  , mutate} = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      services: data?.data || [],
      servicesLoading: isLoading,
      servicesError: error,
      servicesValidating: isValidating,
      servicesEmpty: !isLoading && !data?.data.length,
      refetch : ()=>mutate()
    }),
    [data?.data, error, isLoading, isValidating,mutate]
  );

  return memoizedValue;
}


