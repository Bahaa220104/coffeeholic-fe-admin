import { Box } from "@chakra-ui/react/box";
import { Heading, Text } from "@chakra-ui/react/typography";
import { useRouteError } from "react-router-dom";

export default function ErrorLayout() {
  const error = useRouteError();
  console.error(error);

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Heading>Oops!</Heading>
      <Text>Sorry, an unexpected error has occurred.</Text>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </Box>
  );
}
