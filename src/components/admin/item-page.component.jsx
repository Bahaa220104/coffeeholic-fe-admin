import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function ItemPage() {
  const params = useParams();
  const mode = params.id === "new" ? "create" : "edit";
  const [category, setCategory] = useState({});
  const [updated, setUpdated] = useState({});
  const navigate = useNavigate();

  const api = useApi({
    url: mode === "create" ? "/categories" : "/categories/" + params.id,
    method: "GET",
    callOnMount: mode === "edit",
  });

  useEffect(() => {
    if (api.data && mode === "edit") {
      setCategory(api.data);
      setUpdated({});
    } else if (mode === "create") {
      setCategory({ name: "" });
      setUpdated({});
    }
  }, [api.data]);

  async function handleSubmit() {
    if (mode === "create") {
      const response = await api.call({ method: "post", data: updated });
      if (response.ok) {
        navigate("/categories/" + response.data.id);
      }
    } else {
      const response = await api.call({ method: "put", data: updated });
      if (response.ok) {
        await api.call();
      }
    }
  }

  return (
    <Page
      title={[
        { label: "Categories", to: "/categories" },
        {
          label: mode === "create" ? "New" : category?.name,
          to: "/categories/" + params.id,
        },
      ]}
      includeRemove={
        mode === "create"
          ? null
          : async () => {
              const response = await api.call({ method: "delete" });
              if (response.ok) {
                navigate("/categories");
              }
            }
      }
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <VStack align={"start"}>
          <InputGroup>
            <InputLeftAddon>Name</InputLeftAddon>
            <Input
              type="text"
              value={updated.name || category.name}
              onChange={(e) => {
                setUpdated({ ...updated, name: e.target.value });
              }}
            />
          </InputGroup>
          <HStack w="100%" spacing={3} justifyContent={"end"}>
            <Button
              variant={"ghost"}
              disabled={!updated || JSON.stringify(updated) == "{}"}
              onClick={() => {
                setUpdated({});
              }}
            >
              Reset Changes
            </Button>
            <Button
              type="submit"
              disabled={!updated || JSON.stringify(updated) == "{}"}
            >
              Save changes
            </Button>
          </HStack>

          {mode === "edit" && (
            <>
              <Heading
                sx={{
                  mt: 8,
                  fontWeight: 500,
                  fontSize: "1.2rem",
                  height: "100%",
                }}
              >
                Products in "{category.name}"
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
              />
            </>
          )}
        </VStack>
      </form>
    </Page>
  );
}
