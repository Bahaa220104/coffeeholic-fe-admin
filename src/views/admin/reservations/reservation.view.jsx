import { useParams } from "react-router-dom";
import Page from "../../../components/admin/page.component";

export default function Reservation() {
  const params = useParams();
  const reservation = { id: 1, number: "569659" };

  return (
    <Page
      title={[
        { label: "Reservations", to: "/reservations" },
        { label: reservation?.number, to: "/reservations/" + params.id },
      ]}
    ></Page>
  );
}
