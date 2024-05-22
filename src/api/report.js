import { useMemo } from 'react';
import useSWR from 'swr';

import { endpoints, fetcher } from 'src/utils/axios';

export function useGetMostSoldReport(quaryParams) {
  const URL = quaryParams
    ? [
      endpoints.report.mostSold,
      {
        params: quaryParams,
      },
    ]
    : endpoints.report.mostSold;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      soldReport: data?.data || [],
      soldLoading: isLoading,
      soldError: error,
      soldValidating: isValidating,
      soldEmpty: !isLoading && !data?.data?.length,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}
export function useGetOverall(quaryParams) {
  const URL = quaryParams
    ? [
      endpoints.report.overAll,
      {
        params: quaryParams,
      },
    ]
    : endpoints.report.overAll;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      overAll: data?.data || [],
      overAllLoading: isLoading,
      overAllError: error,
      overAllValidating: isValidating,
      overAllEmpty: !isLoading && !data?.data?.length,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

