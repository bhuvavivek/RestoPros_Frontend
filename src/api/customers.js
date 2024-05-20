import { useMemo } from 'react';
import useSWR from 'swr';

import { endpoints, fetcher } from 'src/utils/axios';

export function useGetCustomers(queryParams) {
  const URL = queryParams
    ? [endpoints.customer.list, { params: queryParams }]
    : endpoints.customer.list;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      customers: data?.customer || [],
      customersLoading: isLoading,
      customersError: error,
      customersValidating: isValidating,
      customersEmpty: !isLoading && !data?.customer.length,
      totalDocuments: data?.totalDocuments,
    }),
    [data?.customer, data?.totalDocuments, error, isLoading, isValidating]
  );

  return memoizedValue;
}
