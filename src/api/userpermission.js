import { useMemo } from 'react';
import useSWR from 'swr';

import { endpoints, fetcher } from 'src/utils/axios';

export function useGetPermissions() {
  const URL = endpoints.permissions.list;
  const { data, error, isLoading, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      permissions: data?.permissions || [],
      permissionsLoading: isLoading,
      permissionsError: error,
      permissionsValidating: isValidating,
      permissionEmpty: !isLoading && !data?.permissions.length,
    }),
    [data?.permissions, error, isLoading, isValidating]
  );

  return memoizedValue;
}
