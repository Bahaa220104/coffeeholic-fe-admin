import React, { createContext, useContext, useState } from "react";

const LoadingContext = createContext(null);

export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(0);

  function start() {
    setLoading((curr) => curr + 1);
  }

  function stop() {
    setLoading((curr) => curr - 1);
  }

  return (
    <LoadingContext.Provider value={{ loading: Boolean(loading), start, stop }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within an LoadingProvider");
  }
  return context;
};
