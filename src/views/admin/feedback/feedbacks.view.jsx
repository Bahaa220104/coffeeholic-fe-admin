import DatatablePage from "../../../components/admin/datatable-page.component";

export default function Feedback() {
  return (
    <DatatablePage
      title="Reviews"
      columns={[
        {
          key: "id",
          label: "ID",
        },
        { key: "order", label: "Order", render: (row) => row?.order?.id },
        {
          key: "writtenBy",
          label: "Written by",
          render: (row) => {
            return (
              row?.order?.user?.firstName +
              " " +
              row?.order?.user?.lastName +
              ", " +
              row?.order?.user?.phone
            );
          },
        },
        {
          key: "rating",
          label: "Rating",
        },
        {
          key: "remarks",
          label: "Remarks",
        },
      ]}
      initial={[]}
      source={{ method: "get", url: "/reviews" }}
      noNew
      noRowClick
    />
  );
}
