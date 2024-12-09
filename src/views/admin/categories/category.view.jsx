import {
  Button,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputLeftAddon,
  VStack,
} from "@chakra-ui/react";
import DataTable from "../../../components/admin/datatable.component";
import Page from "../../../components/admin/page.component";
import useItem from "../../../utilities/hooks/useItem";

export default function Category() {
  const controller = useItem({
    url: "/categories",
    empty: { name: "" },
    name: "Categories",
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
            <InputLeftAddon>Name</InputLeftAddon>
            <Input
              type="text"
              value={controller.updated.name || controller.item.name}
              onChange={(e) => {
                controller.handleChange("name", e.target.value);
              }}
            />
          </InputGroup>
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

          {controller.mode === "edit" && (
            <>
              <Heading
                sx={{
                  mt: 8,
                  fontWeight: 500,
                  fontSize: "1.2rem",
                  height: "100%",
                }}
              >
                Products in "{controller.item.name}"
              </Heading>
              <DataTable
                columns={[
                  {
                    key: "id",
                    label: "ID",
                  },
                  {
                    key: "name",
                    label: "Name",
                    sx: { width: "100%" },
                  },
                ]}
                rows={controller.item?.products || []}
              />
            </>
          )}
        </VStack>
      </form>
    </Page>
  );
}
