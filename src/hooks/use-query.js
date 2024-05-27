import { useEffect, useState } from 'react';

// ----------------------------------------------------------------------
export function useGetQueryParamsData(value) {
  const [queryParam, setQueryParam] = useState({ expand: 'true' });

  useEffect(() => {
    if (value) {
      setQueryParam((prevQueryParam) => ({
        ...prevQueryParam,
        ...value,
      }));
    }
  }, [value]);

  return queryParam;
}
