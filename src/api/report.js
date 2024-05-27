import { useMemo } from 'react';
import useSWR from 'swr';

import { endpoints, fetcher } from 'src/utils/axios';

export function useGetMostSoldReport(quaryParams) {
  const URL = quaryParams
    ? [
        endpoints.report.mostSold,
        {
          params: quaryParams,
        },
      ]
    : endpoints.report.mostSold;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      soldReport: data?.data || [],
      soldLoading: isLoading,
      soldError: error,
      soldValidating: isValidating,
      soldEmpty: !isLoading && !data?.data?.length,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}
export function useGetOverall(quaryParams) {
  const URL = quaryParams
    ? [
        endpoints.report.overAll,
        {
          params: quaryParams,
        },
      ]
    : endpoints.report.overAll;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      overAllReport: data?.data[0]?.List || [],
      overAllReportLoading: isLoading,
      overAllReportError: error,
      overAllReportValidating: isValidating,
      overAllReportEmpty: !isLoading && !data?.data[0]?.List?.length,
      totalAmount: data?.data[0]?.totalAmount,
      totalDiscount: data?.data[0]?.totalDiscount,
      totalTax: data?.data[0]?.totalTax,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}
