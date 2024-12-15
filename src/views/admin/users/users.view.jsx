import { Button, HStack } from "@chakra-ui/react";
import DatatablePage from "../../../components/admin/datatable-page.component";
import { useAuth } from "../../../utilities/contexts/auth.context";
import useApi from "../../../utilities/hooks/useApi";

export default function Users() {
  const auth = useAuth();

  const api = useApi({ method: "delete", url: "users" });

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
          key: "email",
          label: "Email",
        },
        {
          key: "isAdmin",
          label: "ADMIN",
          render: (row) =>
            row.id != auth.user.id ? (
              Boolean(row.isAdmin) ? (
                <Button
                  size="xs"
                  colorScheme="red"
                  onClick={() => {
                    api.call({
                      method: "put",
                      url: "/users/" + row.id,
                      data: { isAdmin: false },
                    });
                  }}
                >
                  Remove Admin Permissions
                </Button>
              ) : (
                <Button
                  size="xs"
                  colorScheme="yellow"
                  onClick={() => {
                    api.call({
                      method: "put",
                      url: "/users/" + row.id,
                      data: { isAdmin: true },
                    });
                  }}
                >
                  Make Admin
                </Button>
              )
            ) : (
              "Yes"
            ),
        },
        {
          key: "actions",
          label: "",
          showForGroups: true,
          render: (row) => {
            return (
              <HStack justifyContent={"end"}>
                <Button
                  size="xs"
                  onClick={() => {
                    api.call({
                      method: "post",
                      url: "/auth/forgotpassword",
                      data: {
                        email: row.email,
                      },
                    });
                  }}
                >
                  Send Reset Password Email
                </Button>
                {!row.isAdmin && row.id != auth.user.id && (
                  <Button
                    colorScheme="red"
                    size="xs"
                    onClick={() => {
                      api.call({
                        method: "delete",
                        url: "/users/" + row.id,
                      });
                    }}
                  >
                    Delete
                  </Button>
                )}
              </HStack>
            );
          },
        },
      ]}
      refreshSignal={api.data}
      initial={[]}
      noNew
      source={{ method: "get", url: "/users" }}
      noRowClick
    />
  );
}
