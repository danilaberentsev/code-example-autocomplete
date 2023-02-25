import { useCallback, useRef, useState } from 'react';
import type { ParsedQs } from 'qs';
import { stringifyQry, fetchWrap, ABORT_ERROR_NAME } from '@/utils';

interface UseDebouncedProps {
  urn?: string
  delay?: number
  dataKey?: string
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'UPDATE'
}

export function useDebouncedRequest<Data>({ urn = '', dataKey, delay = 500, method = 'GET' }: UseDebouncedProps = {}) {
  const [data, setData] = useState<Data>(null);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);
  const controllerRef = useRef(null);
  const timerRef = useRef(null);

  const abort = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (controllerRef.current && !controllerRef.current.signal.aborted) {
      controllerRef.current.abort('Request aborted by user');
    }
  }, []);

  const debounced = useCallback((payload?: ParsedQs): Promise<Data> => {
    abort();

    return new Promise((resolve) => {
      timerRef.current = setTimeout(() => {
        setLoading(true);
        setError(null);
        controllerRef.current = new AbortController();
        const requestInit: RequestInit = { signal: controllerRef.current.signal, method };
        let resultUrn = urn;

        if (method !== 'GET' && payload) requestInit.body = JSON.stringify(payload);
        if (method === 'GET' && payload) resultUrn += stringifyQry(payload);

        fetchWrap(resultUrn, requestInit)
          .then((json) => {
            const result: Data = dataKey ? json[dataKey] : json;
            setData(result);
            resolve(result);
          })
          .catch((err) => { if (err.name !== ABORT_ERROR_NAME) setError(err); })
          .finally(() => { setLoading(false); });
      }, delay);
    });
  }, [abort, dataKey, delay, method, urn]);

  return { debounced, abort, loading, error, data, timerRef, controllerRef };
}
