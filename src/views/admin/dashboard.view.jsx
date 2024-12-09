import {
  Card,
  HStack,
  Stat,
  StatArrow,
  StatHelpText,
  StatLabel,
  StatNumber,
  VStack,
} from "@chakra-ui/react";
import Page from "../../components/admin/page.component";
import useApi from "../../utilities/hooks/useApi";

export default function Dashboard() {
  const api = useApi({ url: "/dashboard", method: "get", callOnMount: true });

  return (
    <Page title="Dashboard">
      {api.data && (
        <VStack spacing={2} w="100%">
          {" "}
          <HStack spacing={2} w="100%">
            <Card variant="outline" p={4} w="100%">
              <Stat>
                <StatLabel>Unfinished orders</StatLabel>
                <StatNumber>{api.data.unfinishedOrders.length}</StatNumber>
              </Stat>
            </Card>
            <Card variant="outline" p={4} w="100%">
              <Stat>
                <StatLabel>Unfinished reservations</StatLabel>
                <StatNumber>
                  {api.data.unfinishedReservations.length}
                </StatNumber>
              </Stat>
            </Card>
          </HStack>
          <HStack spacing={2} w="100%">
            <Card variant="outline" p={4} w="100%">
              <Stat>
                <StatLabel>Gross revenue</StatLabel>
                <StatNumber>
                  {" "}
                  {api.data.grossRevenueLastMonth.toLocaleString()} LBP
                </StatNumber>
                <StatHelpText>From one month</StatHelpText>
              </Stat>
            </Card>
            <Card variant="outline" p={4} w="100%">
              <Stat>
                <StatLabel>Gross revenue</StatLabel>
                <StatNumber>
                  {api.data.grossRevenue.toLocaleString()} LBP
                </StatNumber>
                <StatHelpText>All Time</StatHelpText>
              </Stat>
            </Card>
          </HStack>
          <HStack spacing={2} w="100%">
            <Card variant="outline" p={4} w="100%">
              <Stat>
                <StatLabel>Number of orders</StatLabel>
                <StatNumber>{api.data.allOrdersLastMonth.length}</StatNumber>
                <StatHelpText>From one month</StatHelpText>
              </Stat>
            </Card>
            <Card variant="outline" p={4} w="100%">
              <Stat>
                <StatLabel>Number of orders</StatLabel>
                <StatNumber>{api.data.allOrdersAllTime.length}</StatNumber>
                <StatHelpText>All Time</StatHelpText>
              </Stat>
            </Card>
          </HStack>
          <HStack spacing={2} w="100%">
            <Card variant="outline" p={4} w="100%">
              <Stat>
                <StatLabel>Number of reservations</StatLabel>
                <StatNumber>
                  {api.data.allReservationsLastMonth.length}
                </StatNumber>
                <StatHelpText>From one month</StatHelpText>
              </Stat>
            </Card>
            <Card variant="outline" p={4} w="100%">
              <Stat>
                <StatLabel>Number of reservations</StatLabel>
                <StatNumber>
                  {api.data.allReservationssAllTime.length}
                </StatNumber>
                <StatHelpText>All Time</StatHelpText>
              </Stat>
            </Card>
          </HStack>
        </VStack>
      )}
    </Page>
  );
}
