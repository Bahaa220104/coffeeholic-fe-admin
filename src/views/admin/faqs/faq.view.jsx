import {
  Button,
  HStack,
  Input,
  InputGroup,
  InputLeftAddon,
  Text,
  VStack,
} from "@chakra-ui/react";
import Page from "../../../components/admin/page.component";
import useItem from "../../../utilities/hooks/useItem";

export default function FAQ() {
  const controller = useItem({
    url: "/faqs",
    empty: { name: "" },
    name: "FAQs",
  });

  return (
    <Page
      title={controller.pageTitle}
      includeRemove={
        controller.mode === "create" ? null : controller.handleRemove
      }
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          controller.handleSubmit();
        }}
      >
        <VStack align={"start"}>
          <InputGroup>
            <InputLeftAddon>Question</InputLeftAddon>
            <Input
              type="text"
              value={controller.get("question")}
              onChange={(e) => {
                controller.handleChange("question", e.target.value);
              }}
            />
          </InputGroup>
          <InputGroup>
            <InputLeftAddon>Answer</InputLeftAddon>
            <Input
              type="text"
              value={controller.get("answer")}
              onChange={(e) => {
                controller.handleChange("answer", e.target.value);
              }}
            />
          </InputGroup>

          {controller.get("approvedAt") ? (
            <Button
              colorScheme="yellow"
              onClick={() => {
                controller.handleChange("approvedAt", null);
              }}
            >
              Make Invisible to Public
            </Button>
          ) : (
            <Button
              onClick={() => {
                controller.handleChange("approvedAt", new Date());
              }}
            >
              Make Visible to Public
            </Button>
          )}
          {controller.get("askedBy") && (
            <Text>
              Asked By: {controller.get("askedBy").firstName}{" "}
              {controller.get("askedBy").lastName}, phone:{" "}
              {controller.get("askedBy").phone}, email:{" "}
              {controller.get("askedBy").email}{" "}
            </Text>
          )}
          <HStack w="100%" spacing={3} justifyContent={"end"}>
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
        </VStack>
      </form>
    </Page>
  );
}
