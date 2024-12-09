import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
} from "@chakra-ui/react";
import { Box } from "@chakra-ui/react/box";
import { Heading } from "@chakra-ui/react/typography";
import { ChevronRightIcon } from "lucide-react";
import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Page({ title, includeNew, includeRemove, children }) {
  const navigate = useNavigate();

  const label = useMemo(() => {
    if (typeof title == "string") return title;

    return (
      <Breadcrumb
        spacing={1}
        separator={
          <Box sx={{ color: "gray.400" }}>
            <ChevronRightIcon size={16} strokeWidth={3} />
          </Box>
        }
        sx={{ display: "flex", flexDirection: "row", alignItems: "start" }}
      >
        {title.map((element, index) => (
          <BreadcrumbItem sx={{ height: "100%" }} key={index}>
            <BreadcrumbLink
              sx={{
                color: index === title.length - 1 ? null : "gray.400",
                fontWeight: index === title.length - 1 ? null : "400",
                fontSize: index === title.length - 1 ? null : "16px",
                height: "100%",
              }}
            >
              <Link to={element.to}>{element.label}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        ))}
      </Breadcrumb>
    );
  }, [title]);
  return (
    <Box ml={280} w="calc(100% - 280px)" h="100%" px={4} py={3}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Heading fontSize="22px" fontWeight="500" mb={6}>
          {label}
        </Heading>
        {includeNew && <Button onClick={() => navigate("new")}>Add New</Button>}
        {includeRemove && (
          <Button onClick={() => includeRemove()} colorScheme="red">
            Remove
          </Button>
        )}
      </Box>
      {children}
    </Box>
  );
}
