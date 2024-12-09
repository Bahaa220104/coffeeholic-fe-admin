import axios from "axios";
import { useEffect, useState, useCallback } from "react";

export default function useApi({
  method = "GET",
  url = "",
  params = {},
  callOnMount = false,
}) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const call = async (config = {}) => {
    setLoading(true);
    setError(null);

    try {
      console.log("REQUESTING");
      const response = await axios.request({
        method,
        params,
        ...config,
        url: "http://localhost:3000" + (config?.url || url),
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      setData(response.data);
      setLoading(false);
      return { ok: true, data: response.data };
    } catch (err) {
      console.log("REQUEST SENT: ", err);
      setError(err.response?.data || err.message);
      setLoading(false);
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
