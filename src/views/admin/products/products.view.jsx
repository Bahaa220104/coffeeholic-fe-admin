import DatatablePage from "../../../components/admin/datatable-page.component";

export default function Products() {
  return (
    <DatatablePage
      title="Products"
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
      initial={[]}
      source={{ url: "/products", method: "GET" }}
    />
  );
}
