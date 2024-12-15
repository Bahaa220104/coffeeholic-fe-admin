import { Outlet, useSearchParams } from "react-router-dom";
import { AuthProvider } from "./utilities/contexts/auth.context";
import { useEffect, useState } from "react";
import {
  LoadingProvider,
  useLoading,
} from "./utilities/contexts/loading.context";
import { Box, CircularProgress } from "@chakra-ui/react";

export default function App() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [ranOnce, setRanOnce] = useState(false);

  useEffect(() => {
    if (searchParams.get("token")) {
      localStorage.setItem("token", searchParams.get("token"));
      setSearchParams((prev) => {
        prev.delete("token");
        return prev;
      });
    }
    setRanOnce(true);
  }, []);

  if (!ranOnce) return;

  return (
    <AuthProvider>
      <Outlet />
      <Loader />
    </AuthProvider>
  );
}

function Loader() {
  const { loading } = useLoading();

  if (loading) {
    return (
      <Box
        sx={{
          top: 0,
          left: 0,
          position: "absolute",
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0, 0, 0, 0.1)",
          backdropFilter: "blur(5px)",
          zIndex: 30000,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress isIndeterminate />
      </Box>
    );
  }
}
