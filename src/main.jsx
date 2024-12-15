import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import ErrorLayout from "./layouts/error.layout.jsx";
import navbarRoutesAdmin from "./utilities/constants/navbar-routes-admin.constant.jsx";
import Login from "./views/auth/login.jsx";
import AdminLayout from "./layouts/admin.layout.jsx";
import {
  ChakraProvider,
  extendTheme,
  theme as baseTheme,
} from "@chakra-ui/react";
import { AuthProvider } from "./utilities/contexts/auth.context.jsx";
import { LoadingProvider } from "./utilities/contexts/loading.context.jsx";

const adminRoutes = [];
navbarRoutesAdmin.forEach((route) => {
  if (route.type === "single") {
    adminRoutes.push({
      path: "/" + route.to,
      element: route.element,
    });
    if (route.children) {
      route.children.forEach((route) => {
        adminRoutes.push({
          path: "/" + route.to,
          element: route.element,
        });
      });
    }
  } else if (route.type === "group") {
    route.routes.forEach((route) => {
      adminRoutes.push({
        path: "/" + route.to,
        element: route.element,
      });
      if (route.children) {
        route.children.forEach((route) => {
          adminRoutes.push({
            path: "/" + route.to,
            element: route.element,
          });
        });
      }
    });
  }
});

const allRoutes = [
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorLayout />,
    children: [
      {
        path: "/",
        element: <AdminLayout />,
        errorElement: <ErrorLayout />,
        children: adminRoutes,
      },
      {
        path: "/auth",
        errorElement: <ErrorLayout />,
        children: [
          {
            path: "/auth/login",
            element: <Login />,
          },
        ],
      },
    ],
  },
];

const router = createBrowserRouter(allRoutes);

const theme = extendTheme({
  colors: {
    brand: {
      50: baseTheme.colors.green[50],
      100: baseTheme.colors.green[100],
      200: baseTheme.colors.green[200],
      300: baseTheme.colors.green[300],
      400: baseTheme.colors.green[400],
      500: baseTheme.colors.green[500],
      600: baseTheme.colors.green[600],
      700: baseTheme.colors.green[700],
      800: baseTheme.colors.green[800],
      900: baseTheme.colors.green[900],
    },
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: "brand.500",
      },
    },
    Input: {
      defaultProps: {
        focusBorderColor: "brand.500",
        size: "sm",
      },
    },
    InputGroup: {
      defaultProps: {
        focusBorderColor: "brand.500",
        size: "sm",
      },
    },
    Textarea: {
      defaultProps: {
        focusBorderColor: "brand.500",
        size: "sm",
      },
    },
    Select: {
      defaultProps: {
        colorScheme: "brand.500",
        focusBorderColor: "brand.500",
        size: "sm",
      },
    },
    Checkbox: {
      defaultProps: {
        colorScheme: "brand.500",
        size: "sm",
      },
    },
    Tabs: {
      defaultProps: {
        colorScheme: "brand",
        size: "sm",
      },
    },
    Button: {
      defaultProps: {
        colorScheme: "brand",
        size: "sm",
      },
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ChakraProvider theme={theme}>
      <LoadingProvider>
        <RouterProvider router={router} />
      </LoadingProvider>
    </ChakraProvider>
  </StrictMode>
);
