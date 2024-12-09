import { Button } from "@chakra-ui/react";
import DatatablePage from "../../../components/admin/datatable-page.component";
import useApi from "../../../utilities/hooks/useApi";

function formatTimeOnly(date) {
  const options = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };

  return new Date(date).toLocaleTimeString("en-US", options);
}

function formatDateOnly(date) {
  const options = {
    year: "numeric",
    month: "short",
    day: "2-digit",
  };

  return new Date(date).toLocaleDateString("en-US", options);
}

export default function Reservations() {
  const api = useApi({ method: "put", url: "/reservations" });

  return (
    <DatatablePage
      noRowClick
      noNew
      title="Reservations"
      columns={[
        {
          key: "id",
          label: "ID",
        },
        {
          key: "user",
          label: "Reserved by",
          render: (row) => {
            return (
              row.user?.firstName +
              " " +
              row.user?.lastName +
              ", " +
              row.user.phone
            );
          },
        },
        {
          key: "table",
          label: "Table",
          render: (row) => {
            return row.content.number;
          },
        },
        {
          key: "time",
          label: "Time",
          render: (row) => {
            return formatTimeOnly(row.time);
          },
        },
        {
          key: "date",
          label: "Date",
          render: (row) => {
            return formatDateOnly(row.date);
          },
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
                      url: "/reservations/" + row.id,
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
                    url: "/reservations/" + row.id,
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
      source={{ method: "get", url: "/reservations" }}
    />
  );
}
