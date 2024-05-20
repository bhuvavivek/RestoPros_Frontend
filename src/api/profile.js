
import { useMemo } from 'react';
import useSWR from 'swr';

import { endpoints, fetcher } from 'src/utils/axios';

export function useGetUserProfile() {
  const URL = endpoints.profile.userprofile;
   { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      user: data?.user || [],
      userLoading: isLoading,
      userError: error,
      userValidating: isValidating,
      userEmpty: !isLoading && !data?.user.length,
    }),
    [data?.user, error, isLoading, isValidating]
  );

  return memoizedValue;
}
