import { useMemo } from 'react';
import useSWR from 'swr';

import { endpoints, fetcher } from 'src/utils/axios';

// ----------------------------------------------------------------------

export function useGetFoodItems(queryParams) {
  const URL = queryParams ? [endpoints.foodItem.list, { params: queryParams }] : endpoints.foodItem.list;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      FoodItems: data?.menu || [],
      FoodItemsLoading: isLoading,
      FoodItemsError: error,
      FoodItemsValidating: isValidating,
      FoodItemsEmpty: !isLoading && !data?.menu.length,
    }),
    [data?.menu, error, isLoading, isValidating]
  );

  return memoizedValue;
}


