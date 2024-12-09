import DatatablePage from "../../../components/admin/datatable-page.component";

export default function Users() {
  return (
    <DatatablePage
      title="Users"
      columns={[
        {
          key: "id",
          label: "ID",
        },
        {
          key: "firstName",
          label: "First name",
        },
        {
          key: "lastName",
          label: "Last name",
        },
        {
          key: "phone",
          label: "Phone number",
        },
        {
          key: "isAdmin",
          label: "ADMIN",
        },
      ]}
      initial={[]}
      noNew
      source={{ method: "get", url: "/users" }}
      noRowClick
    />
  );
}
