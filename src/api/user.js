import { useMemo } from "react";
import useSWR from "swr";

import { endpoints, fetcher } from "src/utils/axios";

export function useGetUsers() {
  const URL = [endpoints.user.list, {
    params: {
      expand: "true"
    }
  }];

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      users: data?.user || [],
      usersLoading: isLoading,
      usersError: error,
      usersValidating: isValidating,
      usersEmpty: !isLoading && !data?.user.length,
    }),
    [data?.user, error, isLoading, isValidating]
  );

  return memoizedValue;
}
