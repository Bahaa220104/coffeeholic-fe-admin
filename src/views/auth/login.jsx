import {
  Box,
  Button,
  Card,
  Checkbox,
  Heading,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../utilities/contexts/auth.context";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const auth = useAuth();

  const onSubmit = handleSubmit((data) => {
    auth.signIn(data);
  });

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <form onSubmit={onSubmit}>
        <Card sx={{ p: 4, minWidth: "500px" }}>
          <Heading size="lg" sx={{ mb: 4 }}>
            Login
          </Heading>
          <VStack gap={4} alignItems={"start"}>
            <Text fontWeight={500} fontSize={"0.9rem"} sx={{ mb: -3 }}>
              Phone number
            </Text>
            <Input
              label="Phone"
              placeholder="Enter your phone number"
              {...register("phone", { required: "Phone is required" })}
            />
            <Text fontWeight={500} fontSize={"0.9rem"} sx={{ mb: -3 }}>
              Password
            </Text>
            <Input
              placeholder="Enter your password"
              type="password"
              {...register("password", { required: "Password is required" })}
            />
            <Button type="submit" sx={{ width: "100%" }}>
              Login
            </Button>
          </VStack>
        </Card>
      </form>
    </Box>
  );
}
