import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher, endpoints } from 'src/utils/axios';

export function useGetUsers(queryParams) {
  const URL = queryParams
    ? [
        endpoints.user.list,
        {
          params: queryParams,
        },
      ]
    : endpoints.user.list;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      users: data?.user || [],
      usersLoading: isLoading,
      usersError: error,
      usersValidating: isValidating,
      usersEmpty: !isLoading && !data?.user.length,
      totalDocuments: data?.totalDocuments,
    }),
    [data?.user, data?.totalDocuments, error, isLoading, isValidating]
  );

  return memoizedValue;
}
