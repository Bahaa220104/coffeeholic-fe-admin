import { Box } from "@chakra-ui/react/box";
import { Navigate, Outlet } from "react-router-dom";
import Navbar from "../components/admin/navbar.component";
import { useAuth } from "../utilities/contexts/auth.context";

export default function AdminLayout() {
  const auth = useAuth();

  if (auth.loading) {
    return "Loading...";
  }

  if (!auth.user) {
    console.log("QUET: ", auth);
    return <Navigate to="/auth/login" />;
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "row" }}>
      <Navbar />
      <Outlet />
    </Box>
  );
}
