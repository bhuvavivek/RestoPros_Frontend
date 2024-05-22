import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export function useGetFoodItems(queryParams) {
  const URL = queryParams
    ? [endpoints.foodItem.list, { params: queryParams }]
    : endpoints.foodItem.list;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      FoodItems: data?.menu || [],
      FoodItemsLoading: isLoading,
      FoodItemsError: error,
      FoodItemsValidating: isValidating,
      FoodItemsEmpty: !isLoading && !data?.menu.length,
      totalPages: data?.totalPages,
      totalDocuments: data?.totalDocuments,
    }),
    [data?.menu, data?.totalDocuments, data?.totalPages, error, isLoading, isValidating]
  );

  return memoizedValue;
}
