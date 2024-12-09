import axios from "axios";
import { useEffect, useState } from "react";

export default function useData({
  sources,
  initialValue,
  sortBySequenceNumber,
}) {
  const [options, setOptions] = useState();
  const [open, setOpen] = useState({});
  const [value, setValue] = useState(initialValue);

  function handleChangeValue(...params) {
    if (!value.length) {
      const [field, newValue] = params;
      setValue((curr) => ({ ...curr, [field]: newValue }));
    } else {
      const [index, field, newValue] = params;
      setValue((curr) => {
        const newCurr = [...curr];
        curr[index][field] = newValue;
        return newCurr;
      });
    }
  }

  function handleChangeOpen(field, newValue) {
    setOpen((curr) => ({ ...curr, [field]: newValue }));
  }

  function handleChangeOptions(field, newValue) {
    setOptions((curr) => ({ ...curr, [field]: newValue }));
  }

  async function fetchOptions() {
    const promises = sources?.options?.map(async (source) => {
      try {
        return (
          await axios.request({
            baseUrl: "https://dummyjson.com",
            method: source.method || "GET",
            params: source.params,
            url: source.url,
          })
        ).data;
      } catch (err) {
        return [];
      }
    });

    const values = await Promise.all(promises);

    sources.options.map((source, index) => {
      handleChangeOptions(source.key, values[index]);
    });
  }

  function isArraySorted(arr, sortFunction) {
    for (let i = 0; i < arr.length - 1; i++) {
      if (sortFunction(arr[i], arr[i + 1]) > 0) {
        return false;
      }
    }
    return true;
  }

  useEffect(() => {
    if (sources) fetchOptions();
  }, []);

  useEffect(() => {
    if (sortBySequenceNumber) {
      const isSorted = isArraySorted(
        value,
        (a, b) => a.sequenceNumber - b.sequenceNumber
      );
      if (!isSorted) {
        setValue((curr) => {
          const sorted = [...curr];
          sorted.sort((a, b) => a.sequenceNumber - b.sequenceNumber);
          return sorted;
        });
      }
    }
  }, [value]);

  return {
    options,
    open,
    value,
    handleChangeValue,
    handleChangeOpen,
    handleChangeOptions,
  };
}
