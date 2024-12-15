import axios from "axios";
import { useEffect, useState } from "react";
import API_URL from "../constants/urls";
import { useLoading } from "../contexts/loading.context";

export default function useApi({
  method = "GET",
  url = "",
  params = {},
  callOnMount = false,
}) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const loadingContext = useLoading();

  const call = async (config = {}) => {
    setLoading(true);
    loadingContext.start();
    setError(null);

    try {
      const response = await axios.request({
        method,
        params,
        ...config,
        url: API_URL + (config?.url || url),
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      setData(response.data);
      setLoading(false);
      loadingContext.stop();
      return { ok: true, data: response.data };
    } catch (err) {
      setError(err.response?.data || err.message);
      setLoading(false);
      loadingContext.stop();
      return { ok: false, error: err.response?.data || err.message };
    }
  };

  useEffect(() => {
    if (callOnMount) {
      call();
    }
  }, []);

  return { data, error, loading, call };
}
