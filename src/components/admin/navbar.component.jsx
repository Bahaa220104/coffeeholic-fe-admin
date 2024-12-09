import { Box, Button, Card, Heading, Text, VStack } from "@chakra-ui/react";
import { Avatar } from "@chakra-ui/react/avatar";
import { IconButton } from "@chakra-ui/react/button";
import {
  SquareMenu,
  House,
  ShoppingBasket,
  Coffee,
  LogOut,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import navbarRoutes from "../../utilities/constants/navbar-routes-admin.constant";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../utilities/contexts/auth.context";

export default function Navbar() {
  const location = useLocation();
  const [routes, setRoutes] = useState(navbarRoutes);
  const [selected, setSelected] = useState({ route: navbarRoutes[0] });
  const auth = useAuth();

  async function getCounts() {
    return {
      products: 0,
      orders: 0,
      reservations: 0,
      payments: 0,
      feedback: 0,
      faq: 0,
    };
  }

  async function setCounts() {
    const counts = await getCounts();
    setRoutes((curr) => {
      curr.forEach((route, index1) => {
        if (route.type === "single") {
          curr[index1].count = counts[route.to];
        } else if (route.type === "group") {
          route.routes.forEach((_, index2) => {
            curr[index1].routes[index2].count =
              counts[curr[index1].routes[index2].to];
          });
        }
      });

      return [...curr];
    });
  }

  useEffect(() => {
    const baseLink = location.pathname.split("/")[1].trim();
    let newSelected;
    routes.forEach((route) => {
      if (route.type === "single" && route.to === baseLink) {
        newSelected = route;
      } else if (route.type === "group") {
        route.routes.forEach((route) => {
          if (route.to === baseLink) {
            newSelected = route;
          }
        });
      }
    });

    if (newSelected) setSelected((curr) => ({ ...curr, route: newSelected }));
  }, [location.pathname, routes]);

  useEffect(() => {
    setCounts();
  }, []);

  return (
    <Card
      w="280px"
      h="100vh"
      p={2}
      variant="outline"
      borderRadius={"0px"}
      borderLeft={"0px"}
      borderTop={"0px"}
      borderBottom={"0px"}
      bg={"white"}
      minWidth="280px"
      position={"fixed"}
      zIndex={50}
    >
      <VStack
        h="100%"
        spacing={8}
        alignItems={"center"}
        justifyContent="space-between"
      >
        <VStack spacing={0} w="100%">
          {routes.map((route, index) => {
            const isSelected = selected.route.id === route.id;
            if (route.type === "single") {
              return (
                <React.Fragment key={route.id}>
                  <NavbarElement
                    route={route}
                    isSelected={isSelected}
                    setSelected={setSelected}
                  />
                </React.Fragment>
              );
            } else if (route.type === "group") {
              return (
                <Box w="100%" mt={4} key={"Group " + index}>
                  <Text px={3.5} py={2} fontWeight={"500"} color={"black"}>
                    {route.label}
                  </Text>
                  {route.routes.map((route) => {
                    const isSelected = selected.route.id === route.id;
                    return (
                      <React.Fragment key={route.id}>
                        <NavbarElement
                          route={route}
                          isSelected={isSelected}
                          setSelected={setSelected}
                        />
                      </React.Fragment>
                    );
                  })}
                </Box>
              );
            }
          })}
        </VStack>
        <Box
          w="100%"
          p={3.5}
          display="flex"
          flexDirection="row"
          gap={3}
          alignItems="center"
          justifyContent="space-between"
        >
          <Box display="flex" flexDirection="row" gap={3} alignItems="center">
            <Avatar w="32px" h="32px" src="" />
            <Box>
              <Text fontWeight="500">
                {auth.user.firstName} {auth.user.lastName}
              </Text>
            </Box>
          </Box>
          <IconButton
            icon={<LogOut size="18px" />}
            onClick={() => {
              auth.signOut();
            }}
          />
        </Box>
      </VStack>
    </Card>
  );
}

function NavbarElement({ route, isSelected, setSelected }) {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        width: "100%",
        borderRadius: "10px",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: isSelected ? "green.50" : "white",

        border: "1px solid",
        borderColor: isSelected ? "green.600" : "transparent",
        color: isSelected ? "green.600" : null,
        cursor: "pointer",
        transition: "all 0.05s ease-in",
      }}
      onClick={() => {
        //setSelected((curr) => ({ ...curr, route }));
        navigate(route.to || "");
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Box px={3} py={2}>
          {route.icon}
        </Box>
        <Text sx={{ fontWeight: isSelected ? "500" : "400" }}>
          {route.label}
        </Text>
      </Box>
    </Box>
  );
}
