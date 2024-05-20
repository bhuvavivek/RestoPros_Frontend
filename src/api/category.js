import { useMemo } from 'react';
import useSWR from 'swr';

import { endpoints, fetcher } from 'src/utils/axios';

export function useGetCategories(quaryParams) {
  const URL = quaryParams
    ? [
        endpoints.category.list,
        {
          params: quaryParams,
        },
      ]
    : endpoints.category.list;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      categories: data?.categories || [],
      categoriesLoading: isLoading,
      categoriesError: error,
      categoriesValidating: isValidating,
      categoriesEmpty: !isLoading && !data?.categories.length,
    }),
    [data?.categories, error, isLoading, isValidating]
  );

  return memoizedValue;
}
