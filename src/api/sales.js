import { useMemo } from 'react';
import useSWR from 'swr';

import { endpoints, fetcher } from 'src/utils/axios';

export function useGetSales(quaryParams) {
  const URL = quaryParams
    ? [
      endpoints.sales.list,
      {
        params: quaryParams,
      },
    ]
    : endpoints.sales.list;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      sales: data?.data.orders || [],
      salesLoading: isLoading,
      salesError: error,
      salesValidating: isValidating,
      salesEmpty: !isLoading && !data?.data.orders?.length,
      totaldocuments: data?.data?.total,
    }),
    [data?.data.orders, data?.data?.total, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetSingleSale(id, quaryParams) {
  const URL = useMemo(
    () =>
      quaryParams
        ? [
          endpoints.sales.detail(id),
          {
            params: quaryParams,
          },
        ]
        : endpoints.sales.detail(id),
    [id, quaryParams]
  );

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      sale: (data?.data && data?.data[0]) || [],
      saleLoading: isLoading,
      saleError: error,
      saleValidating: isValidating,
      saleEmpty: !isLoading && !data?.data?.length,
      refetch: () => mutate(URL),
    }),
    [data?.data, error, isLoading, isValidating, mutate, URL]
  );

  return memoizedValue;
}
