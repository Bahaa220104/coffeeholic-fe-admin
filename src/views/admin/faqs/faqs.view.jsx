import DatatablePage from "../../../components/admin/datatable-page.component";

export default function FAQs() {
  return (
    <DatatablePage
      title="FAQs"
      columns={[
        {
          key: "id",
          label: "ID",
        },
        {
          key: "question",
          label: "Questions",
        },
        {
          key: "answer",
          label: "Answer",
          render: (row) => row.answer || "",
        },
        {
          key: "approvedAt",
          label: "Visible",
          render: (row) => (row.approvedAt ? "Visible" : "Not visible"),
        },
      ]}
      initial={[]}
      source={{ method: "get", url: "/faqs" }}
    />
  );
}
