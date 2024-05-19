import { useMemo } from "react";
import useSWR from "swr";

import { endpoints, fetcher } from "src/utils/axios";

export function useGetRoles() {
  const URL = endpoints.role.list;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      roles: data?.roles || [],
      rolesLoading: isLoading,
      rolesError: error,
      rolesValidating: isValidating,
      rolesEmpty: !isLoading && !data?.roles.length,
    }),
    [data?.roles, error, isLoading, isValidating]
  );

  return memoizedValue;
}


