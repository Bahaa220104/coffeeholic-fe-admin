import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useApi from "./useApi";

export default function useItem({ url, empty, name, forceId }) {
  const params = useParams();
  const mode = !forceId && params.id === "new" ? "create" : "edit";
  const [item, setItem] = useState({});
  const [updated, setUpdated] = useState({});
  const navigate = useNavigate();

  const api = useApi({
    url: mode === "create" ? url : url + "/" + (forceId || params.id),
    method: "GET",
    callOnMount: mode === "edit",
  });

  useEffect(() => {
    if (api.data && mode === "edit") {
      setItem(api.data);
      setUpdated({});
    } else if (mode === "create") {
      setItem(empty);
      setUpdated({});
    }
  }, [api.data]);

  function get(field) {
    return Object.keys(updated || {}).includes(field)
      ? updated[field]
      : item[field];
  }

  async function handleSubmit() {
    if (mode === "create") {
      const response = await api.call({ method: "post", data: updated });
      if (response.ok) {
        navigate(url + "/" + response.data.id);
      }
    } else {
      const response = await api.call({ method: "put", data: updated });
      if (response.ok) {
        await api.call();
      }
    }
  }

  async function handleRemove() {
    const response = await api.call({ method: "delete" });
    if (response.ok) {
      navigate(url);
    }
  }

  function handleChange(field, value) {
    setUpdated((curr) => ({ ...curr, [field]: value }));
  }

  function reset() {
    setUpdated({});
  }

  const pageTitle = [
    { label: name, to: url },
    {
      label: mode === "create" ? "New" : item?.name || item?.question,
      to: url + "/" + (forceId || params.id),
    },
  ];

  const dirty = !(!updated || JSON.stringify(updated) == "{}");

  return {
    handleSubmit,
    handleRemove,
    handleChange,
    reset,
    get,
    item,
    updated,
    mode,
    pageTitle,
    dirty,
  };
}
