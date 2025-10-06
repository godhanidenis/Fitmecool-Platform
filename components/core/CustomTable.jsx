"use client";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Skeleton,
} from "@mui/material";

const CustomTable = ({
  columns,
  rows,
  rowsPerPageOptions = [5],
  loading = false,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const displayRows = loading
    ? Array.from({ length: rowsPerPage }) // empty skeleton rows
    : rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Paper className="w-full overflow-hidden rounded-2xl p-2 !bg-transparent !shadow-none">
      <TableContainer>
        <Table sx={{ borderCollapse: "separate", borderSpacing: "0px 12px" }}>
          {/* Table Header */}
          <TableHead>
            <TableRow className="bg-gray-100 shadow-sm transition rounded-2xl">
              {columns.map((col, colIndex) => {
                const isFirst = colIndex === 0;
                const isLast = colIndex === columns.length - 1;
                return (
                  <TableCell
                    key={col.header}
                    align="center"
                    className={`!border-y !border-gray-200 !font-bold ${
                      isFirst ? "rounded-l-2xl border-l" : ""
                    } 
                ${isLast ? "rounded-r-2xl border-r" : ""} 
                ${!isFirst && !isLast ? "!border-l-0 !border-r-0" : ""}`}
                  >
                    {col.header}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>

          {/* Table Body */}
          <TableBody>
            {displayRows.length > 0 || loading ? (
              displayRows.map((row, rowIndex) => {
                const isSkeleton = loading || !row;

                return (
                  <TableRow
                    key={row?.id || rowIndex}
                    className="bg-white shadow-sm transition hover:shadow-md rounded-2xl"
                  >
                    {columns.map((col, colIndex) => {
                      const isFirst = colIndex === 0;
                      const isLast = colIndex === columns.length - 1;
                      const value = row ? row[col.field] : null;

                      return (
                        <TableCell
                          key={col.field}
                          align="center"
                          colSpan={col.colSpan || 1}
                          style={{ width: col.width }}
                          className={`!border-y !border-gray-200  ${
                            isFirst ? "rounded-l-2xl border-l" : ""
                          } 
                ${isLast ? "rounded-r-2xl border-r" : ""} 
                ${!isFirst && !isLast ? "!border-l-0 !border-r-0" : ""}`}
                        >
                          {isSkeleton ? (
                            <Skeleton variant="text" width="80%" height={30} />
                          ) : col.render ? (
                            col.render(value, row, rowIndex)
                          ) : (
                            value
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.reduce(
                    (total, col) => total + (col.colSpan || 1),
                    0
                  )}
                  align="center"
                  className="py-4 text-gray-500"
                >
                  No data found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        component="div"
        count={rows.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={rowsPerPageOptions}
      />
    </Paper>
  );
};

export default CustomTable;
