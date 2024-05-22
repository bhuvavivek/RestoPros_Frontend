import { useMemo } from 'react';
import useSWR from 'swr';

import { endpoints, fetcher } from 'src/utils/axios';

export function useGetDashboardCount() {
  const URL = endpoints.dashbord.count;

  const { data, error, isLoading, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      dashboardCount: data?.data,
      dashboardCountLoading: isLoading,
      dashboardCountError: error,
      dashboardCountValidating: isValidating,
      dashboardEmpty: !isLoading && data?.data.length === 0,
    }),
    [data?.data, isLoading, error, isValidating]
  );

  return memoizedValue;
}

export function useGetSaleOrderCount() {
  const URL = endpoints.dashbord.salecount;

  const { data, error, isLoading, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      saleOrderCount: data?.data,
      saleOrderCountLoading: isLoading,
      saleOrderCountError: error,
      saleOrderCountValidating: isValidating,
      saleOrderEmpty: !isLoading && data?.data.length === 0,
    }),
    [data?.data, isLoading, error, isValidating]
  );

  return memoizedValue;
}
