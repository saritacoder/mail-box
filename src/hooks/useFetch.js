import { useState, useEffect } from 'react';

export function useFetch(url, init) {
  const [data, setData] = useState(init);

  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((data) => setData(data));
  }, [url]);

  return [data];
}
