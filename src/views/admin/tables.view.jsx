import GridLayout from "react-grid-layout";
import Page from "../../components/admin/page.component";
import "../../../node_modules/react-grid-layout/css/styles.css";
import "../../../node_modules/react-resizable/css/styles.css";
import {
  Box,
  Button,
  HStack,
  Input,
  InputGroup,
  InputLeftAddon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  useDisclosure,
  useStatStyles,
} from "@chakra-ui/react";
import useWidthObserver from "../../utilities/hooks/useWidthObserver";
import { useState } from "react";
import useApi from "../../utilities/hooks/useApi";
import { useEffect } from "react";
import { useMemo } from "react";

function calculateTotalGridSize(items) {
  let maxWidth = 0;
  let maxHeight = 0;

  for (const item of items) {
    const itemRight = item.x + item.w; // far right edge of the item
    const itemBottom = item.y + item.h; // bottom edge of the item

    if (itemRight > maxWidth) {
      maxWidth = itemRight;
    }
    if (itemBottom > maxHeight) {
      maxHeight = itemBottom;
    }
  }

  return { width: maxWidth, height: maxHeight };
}

export default function Tables() {
  const [ref, totalWidth] = useWidthObserver();
  const api = useApi({ url: "/tables", method: "get", callOnMount: true });
  const [tables, setTables] = useState([]);
  const [initialTables, setInitialTables] = useState([]);

  const [width, setWidth] = useState(12);

  const gridSize = {
    width,
    height: calculateTotalGridSize(tables).height,
  };
  const margin = [10, 10];

  useEffect(() => {
    if (api.data?.length) {
      const newTables = api.data.map((t) => {
        return { ...t, i: "" + t.id };
      });
      setTables(newTables);
      setInitialTables(newTables);
    }
  }, [api.data, setTables, setInitialTables]);

  async function handleRemove(table) {
    const response = await api.call({
      url: "/tables/" + table.id,
      method: "delete",
    });
    if (response.ok) {
      api.call();
    }
  }

  return (
    <Page title={"Tables Layout"}>
      <HStack justifyContent={"space-between"} mb={4}>
        <HStack>
          <TableDialog mode="create" refresh={api.call} />
          <Button
            onClick={() => {
              setWidth(width + 1);
            }}
            size="xs"
          >
            Increase width
          </Button>
          <Button
            onClick={() => {
              if (width >= 1) setWidth(width - 1);
            }}
            size="xs"
          >
            Decrease width
          </Button>
        </HStack>
        <HStack>
          {" "}
          <Button
            disabled={
              JSON.stringify(
                initialTables.map((t) => ({ w: t.w, h: t.h, x: t.x, y: t.y }))
              ) ===
              JSON.stringify(
                tables.map((t) => ({ w: t.w, h: t.h, x: t.x, y: t.y }))
              )
            }
            onClick={async () => {
              const promises = tables.map((table) => {
                return api.call({
                  method: "put",
                  url: "/tables/" + table.i,
                  data: { w: table.w, h: table.h, x: table.x, y: table.y },
                });
              });

              await Promise.all(promises);
              api.call();
            }}
            size="xs"
          >
            Save Changes
          </Button>
        </HStack>
      </HStack>
      <Box sx={{ width: "100%" }} ref={ref}>
        <GridLayout
          compactType={null}
          className="layout"
          layout={tables}
          cols={gridSize.width}
          rowHeight={
            (totalWidth - (gridSize.width - 1) * margin[0]) / gridSize.width
          }
          onLayoutChange={(newLayout) => {
            setTables(newLayout);
          }}
          width={totalWidth}
          margin={margin}
          style={{
            border: "1px solid",
            borderColor: "rgba( 0, 0, 0, 0.12)",
            borderRadius: "18px",
            width: totalWidth,
            margin: "0 auto",
          }}
        >
          {tables.map((table) => {
            const fullTable = initialTables.find((t) => t.i === table.i);
            return (
              <Box
                key={table.i}
                sx={{
                  backgroundColor: "rgba(0, 0, 0, 0.12)",
                  position: "relative",
                }}
              >
                <HStack
                  sx={{
                    alignItems: "end",
                    width: "100%",
                    justifyContent: "end",
                    position: "absolute",
                    top: 1,
                    right: 1,
                  }}
                >
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(table);
                    }}
                    colorScheme="red"
                    size="xs"
                  >
                    Delete
                  </Button>
                  <TableDialog
                    mode={"edit"}
                    initial={fullTable}
                    refresh={api.call}
                  />
                </HStack>
                <Text
                  sx={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  Table {fullTable.number}
                </Text>
              </Box>
            );
          })}
        </GridLayout>
      </Box>
    </Page>
  );
}

function TableDialog({ mode, initial, refresh }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const api = useApi({ method: "post", url: "/tables" });

  const [item, setItem] = useState({
    number: "",
    description: "",
    seats: 1,
  });

  const [updated, setUpdated] = useState({});

  useEffect(() => {
    if (mode === "create" && isOpen) {
      setUpdated({});
      setItem({
        name: "",
      });
    } else {
      if (initial) {
        setItem({
          ...initial,
        });
        setUpdated({});
      }
    }
  }, [initial, mode, isOpen]);

  async function handleSubmit() {
    if (mode === "create") {
      const response = await api.call({
        method: "post",
        data: { ...item, ...updated, w: 1, h: 1, x: 0, y: 0 },
      });
      if (response.ok) {
        await refresh();
        onClose();
      }
    } else {
      const response = await api.call({
        method: "put",
        url: "/tables/" + item.id,
        data: updated,
      });
      if (response.ok) {
        await refresh();
        onClose();
      }
    }
  }

  return (
    <>
      <Button
        size="xs"
        onClick={onOpen}
        colorScheme={mode === "edit" ? "yellow" : "brand"}
      >
        {mode === "edit" ? "Edit" : "Add New Table"}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <ModalHeader>
              {mode === "edit" ? "Edit Table" : "Add New Table"}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <InputGroup>
                <InputLeftAddon>Name</InputLeftAddon>
                <Input
                  required
                  type="text"
                  value={updated.number ?? item.number}
                  onChange={(e) =>
                    setUpdated((curr) => ({ ...curr, number: e.target.value }))
                  }
                />
              </InputGroup>
              <InputGroup mt={3}>
                <InputLeftAddon>Description</InputLeftAddon>
                <Textarea
                  required
                  type="text"
                  value={updated.description ?? item.description}
                  onChange={(e) =>
                    setUpdated((curr) => ({
                      ...curr,
                      description: e.target.value,
                    }))
                  }
                />
              </InputGroup>
              <InputGroup mt={3}>
                <InputLeftAddon>Seats</InputLeftAddon>
                <Input
                  required
                  type="number"
                  value={updated.seats ?? item.seats}
                  onChange={(e) =>
                    setUpdated((curr) => ({
                      ...curr,
                      seats: Number(e.target.value),
                    }))
                  }
                />
              </InputGroup>
            </ModalBody>

            <ModalFooter>
              <Button mr={3} variant="ghost" onClick={onClose}>
                Close
              </Button>
              <Button type="submit">Submit</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}
