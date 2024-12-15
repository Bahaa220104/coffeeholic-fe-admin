import DatatablePage from "../../../components/admin/datatable-page.component";

export default function Categories() {
  return (
    <DatatablePage
      title="Categories"
      columns={[
        {
          key: "id",
          label: "ID",
        },
        {
          key: "name",
          label: "Name",
        },
        {
          key: "type",
          label: "Type",
        },
      ]}
      initial={[]}
      source={{ url: "/categories", method: "get" }}
    />
  );
}
