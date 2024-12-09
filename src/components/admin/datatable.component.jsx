import {
  Box,
  Button,
  HStack,
  Input,
  InputGroup,
  InputLeftAddon,
} from "@chakra-ui/react";
import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react/table";
import { useEffect, useMemo, useState } from "react";

function getFromKey(element, key) {
  const keys = key.split(".");
  let value = element;
  keys.forEach((key) => {
    value = value[key];
  });

  return value;
}

export default function DataTable({
  onRowClick,
  columns,
  rows,
  groupBy,
  buttons,
}) {
  const [filters, setFilters] = useState({ q: "" });

  const tableRows = useMemo(() => {
    if (!rows || !rows.filter) return [];

    let filteredRows = rows.filter((row) => {
      if (!filters.q) return true;

      let includeRow = false;

      columns.forEach((column) => {
        if (
          !filters.q ||
          String(row[column.key])
            .toLowerCase()
            .includes(filters.q.toLowerCase())
        ) {
          includeRow = true;
        }
      });
      return includeRow;
    });

    if (!groupBy) {
      return filteredRows;
    }

    const groups = groupBy.groups;

    if (!groups || !groups.forEach) return rows;

    let newRows = [];

    groups.forEach((group) => {
      newRows.push({
        group: true,
        label: group[groupBy.label],
        ...group,
      });
      newRows = newRows.concat(
        filteredRows.filter((e) => e[groupBy.key] === group.id)
      );
    });

    return newRows;
  }, [rows, groupBy, filters]);

  function handleChangeFilters(field, value) {
    setFilters((curr) => ({ ...curr, [field]: value }));
  }

  return (
    <Box w="100%">
      <HStack spacing={1}>
        <Input
          value={filters.q}
          onChange={(e) => {
            handleChangeFilters("q", e.target.value);
          }}
          type="text"
          placeholder="Search"
          mb={4}
        />
        {buttons?.map((button) => {
          return <Button {...button.props}>{button.label}</Button>;
        })}
      </HStack>
      <TableContainer>
        <Table size="sm">
          <Thead>
            <Tr>
              {columns.map((column) => {
                return <Th key={column.key}>{column.label}</Th>;
              })}
            </Tr>
          </Thead>
          <Tbody>
            {tableRows.map((row) => {
              if (row.group) {
                return (
                  <Tr
                    sx={{ backgroundColor: "gray.100" }}
                    key={"Group tr: " + row.id}
                  >
                    <Td
                      colSpan={
                        columns.length -
                        columns.filter((c) => c.showForGroups).length
                      }
                    >
                      {row.label}
                    </Td>
                    {columns
                      .filter((c) => c.showForGroups)
                      .map((column) => {
                        return (
                          <Td key={"Group td: " + column.key}>
                            {column.render ? column.render(row) : null}
                          </Td>
                        );
                      })}
                  </Tr>
                );
              }
              return (
                <Tr
                  key={"Normal Tr: " + row.id}
                  sx={{
                    _hover: {
                      backgroundColor: "green.50",
                      cursor: onRowClick ? "pointer" : null,
                      fontWeight: "500",
                    },
                  }}
                  onClick={() => {
                    onRowClick && onRowClick(row);
                  }}
                >
                  {columns.map((column) => {
                    return (
                      <Td
                        key={"Normal Td: " + column.key + "" + row.id}
                        sx={column.sx}
                      >
                        {column.render ? (
                          column.render(row)
                        ) : (
                          <HighlightedText
                            search={filters.q}
                            text={String(row[column.key])}
                          />
                        )}
                      </Td>
                    );
                  })}
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
}

function HighlightedText({ search, text }) {
  const content = useMemo(() => {
    if (!search || !text.toLowerCase().includes(search.toLowerCase())) {
      return text;
    }

    const regex = new RegExp(`(${search})`, "gi");
    const parts = text.split(regex);

    return (
      <p>
        {parts.map((part, index) =>
          part.toLowerCase() === search.toLowerCase() ? (
            <mark
              style={{
                backgroundColor: "#C6F6D5",
                color: "#000",
              }}
              key={index}
            >
              {part}
            </mark>
          ) : (
            <span key={index}>{part}</span>
          )
        )}
      </p>
    );
  }, [text, search]);

  return content;
}
