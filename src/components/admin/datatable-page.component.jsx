import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useApi from "../../utilities/hooks/useApi";
import DataTable from "./datatable.component";
import Page from "./page.component";

export default function DatatablePage({
  title,
  columns,
  initial = [],
  source,
  noPage,
  noNew,
  noRowClick,
  refreshSignal,
}) {
  // const data = useData({ initialValue: initial || [] });
  const api = useApi({ ...source, callOnMount: Boolean(source) });
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (refreshSignal) {
      api.call();
    }
  }, [refreshSignal]);

  if (noPage)
    return (
      <DataTable
        columns={columns}
        rows={api.data || initial}
        onRowClick={(row) => {
          navigate(`${location.pathname}/${row.id}`);
        }}
      />
    );

  return (
    <Page title={title} includeNew={!noNew}>
      <DataTable
        columns={columns}
        rows={api.data || initial}
        onRowClick={
          noRowClick
            ? null
            : (row) => {
                navigate(`${location.pathname}/${row.id}`);
              }
        }
      />
    </Page>
  );
}
