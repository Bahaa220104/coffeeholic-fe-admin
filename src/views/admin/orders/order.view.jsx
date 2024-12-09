import { useParams } from "react-router-dom";
import Page from "../../../components/admin/page.component";

export default function Order() {
  const params = useParams();
  const order = { id: 1, number: "569659" };

  return (
    <Page
      title={[
        { label: "Orders", to: "/orders" },
        { label: order?.number, to: "/orders/" + params.id },
      ]}
    ></Page>
  );
}
