import {
  Button,
  HStack,
  Input,
  InputGroup,
  InputLeftAddon,
} from "@chakra-ui/react";
import Page from "../../components/admin/page.component";
import useItem from "../../utilities/hooks/useItem";

export default function BusinessInformation() {
  const controller = useItem({
    url: "/business",
    empty: {
      email: "",
      phone: "",
      address: "",
      openingHours: "",
      lat: 0,
      lng: 0,
    },
    name: "Business Information",
    forceId: 1,
  });

  return (
    <Page title="Business Information">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          controller.handleSubmit();
        }}
      >
        <InputGroup>
          <InputLeftAddon>Email</InputLeftAddon>
          <Input
            value={controller.get("email")}
            onChange={(e) => {
              controller.handleChange("email", e.target.value);
            }}
          />
        </InputGroup>
        <InputGroup mt={3}>
          <InputLeftAddon>Phone number</InputLeftAddon>
          <Input
            value={controller.get("phone")}
            onChange={(e) => {
              controller.handleChange("phone", e.target.value);
            }}
          />
        </InputGroup>
        <InputGroup mt={3}>
          <InputLeftAddon>Address</InputLeftAddon>
          <Input
            value={controller.get("address")}
            onChange={(e) => {
              controller.handleChange("address", e.target.value);
            }}
          />
        </InputGroup>
        <InputGroup mt={3}>
          <InputLeftAddon>Opening Hours</InputLeftAddon>
          <Input
            value={controller.get("openingHours")}
            onChange={(e) => {
              controller.handleChange("openingHours", e.target.value);
            }}
          />
        </InputGroup>

        <InputGroup mt={3}>
          <InputLeftAddon>Google Maps Embedded Html</InputLeftAddon>
          <Input
            value={controller.get("googleMapsUrl")}
            onChange={(e) => {
              controller.handleChange("googleMapsUrl", e.target.value);
            }}
          />
        </InputGroup>

        <HStack w="100%" spacing={3} mt={3} justifyContent={"end"}>
          {controller.mode === "edit" && (
            <Button
              variant={"ghost"}
              disabled={!controller.dirty}
              onClick={() => {
                controller.reset();
              }}
            >
              Reset Changes
            </Button>
          )}
          <Button type="submit" disabled={!controller.dirty}>
            Save changes
          </Button>
        </HStack>
      </form>
    </Page>
  );
}
