import DatatablePage from "../../../components/admin/datatable-page.component";
import useApi from "../../../utilities/hooks/useApi";
import { Avatar, Box, Button, Card } from "@chakra-ui/react";

function formatTime(date) {
  const options = {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };

  return new Date(date).toLocaleString("en-US", options);
}

export default function Orders() {
  const api = useApi({ method: "put", url: "/orders" });

  return (
    <DatatablePage
      noRowClick
      title="Orders"
      noNew
      columns={[
        {
          key: "id",
          label: "ID",
        },
        {
          key: "user",
          label: "Ordered by",
          render: (row) => {
            console.log(row);
            return (
              row.user?.firstName +
              " " +
              row.user?.lastName +
              ", " +
              row.user?.phone
            );
          },
        },
        {
          key: "content",
          label: "Items",
          render: (row) => {
            return (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {row.content.cart.map((element, index) => {
                  return (
                    <Card
                      key={"ELEEME: " + index + element.product.id}
                      variant="filled"
                      p={2}
                      sx={{ display: "flex", flexDirection: "row", gap: 2 }}
                    >
                      <Avatar src={element.product.image} />
                      <Box>
                        {element.product.name}
                        <br />
                        {element.variants
                          .map((variant) => {
                            return (
                              variant.variantGroup.name + ": " + variant.name
                            );
                          })
                          .join(", ")}
                        <br />
                        Addons:{" "}
                        {element.addons
                          .map((addon) => {
                            return addon.name;
                          })
                          .join(", ")}
                      </Box>
                    </Card>
                  );
                })}
              </Box>
            );
          },
        },
        {
          key: "total",
          label: "Total",
          render: (row) => row.content.total.toLocaleString() + " LBP",
        },
        { key: "type", label: "Type", render: (row) => row.type.toUpperCase() },

        {
          key: "address",
          label: "Address",
          render: (row) =>
            [row.city, row.building, row.address].filter((v) => v).join(", "),
        },
        {
          key: "Date & Time",
          label: "time",
          render: (row) =>
            row.time ? formatTime(row.time) : formatTime(row.createdAt),
        },
        {
          key: "status",
          label: "Status",
          render: (row) => {
            return row.completedAt ? (
              <>
                Completed&nbsp;{" "}
                <Button
                  colorScheme="yellow"
                  onClick={async () => {
                    const response = await api.call({
                      url: "/orders/" + row.id,
                      data: {
                        completedAt: null,
                      },
                    });
                  }}
                  size="xs"
                >
                  Revert
                </Button>
              </>
            ) : (
              <Button
                onClick={async () => {
                  const response = await api.call({
                    url: "/orders/" + row.id,
                    data: {
                      completedAt: new Date(),
                    },
                  });
                }}
                size="xs"
              >
                Mark as Complete
              </Button>
            );
          },
        },
      ]}
      initial={[]}
      refreshSignal={api.data}
      source={{ method: "get", url: "/orders" }}
    />
  );
}
