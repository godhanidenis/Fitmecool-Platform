"use client";
import {
  Divider,
  Pagination,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

const ProductTable = ({
  columns,
  rows,
  loading = false,
  productsCount = 0,
  productPageSkip = 0,
  onPageChange,
  rowsPerPage = 6,
  disableRow,
}) => {
  const currentPage =
    productPageSkip === 0 ? 1 : productPageSkip / rowsPerPage + 1;

  return (
    <Paper className="w-full overflow-hidden rounded-2xl p-2 !bg-transparent !shadow-none">
      {/* ✅ Responsive horizontal scroll wrapper */}
      <div className="w-full overflow-x-auto">
        <TableContainer
          sx={{
            maxHeight: 600, // Only vertical scroll
          }}
          className="light-scroll !pr-2"
        >
          <Table
            sx={{
              minWidth: 700, // Prevent shrinkage on small screens
              borderCollapse: "separate",
              borderSpacing: "0px 10px",
              tableLayout: "auto",
            }}
          >
            {/* ----- Sticky Header ----- */}
            <TableHead className="sticky top-0 z-20 bg-gray-100">
              <TableRow>
                {columns.map((col, colIndex) => {
                  const isFirst = colIndex === 0;
                  const isLast = colIndex === columns.length - 1;
                  return (
                    <TableCell
                      key={col.header}
                      align="center"
                      className={`!border-y !border-gray-200 text-sm sm:text-base !font-bold ${
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

            {/* ----- Scrollable Table Body (no display:block) ----- */}
            <TableBody>
              {loading ? (
                Array.from({ length: rowsPerPage }).map((_, i) => (
                  <TableRow key={i} className="bg-white shadow-sm rounded-2xl">
                    {columns.map((col, ci) => (
                      <TableCell key={ci} align="center">
                        <Skeleton variant="text" width="80%" height={30} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : rows?.length > 0 ? (
                rows.map((row, rowIndex) => (
                  <TableRow
                    key={row?.id || rowIndex}
                    className={`${
                      disableRow(row?.id)?.bg
                    } bg-white shadow-sm transition hover:shadow-md rounded-2xl`}
                  >
                    {columns.map((col, colIndex) => {
                      const isFirst = colIndex === 0;
                      const isLast = colIndex === columns.length - 1;
                      const value = row[col.field];
                      return (
                        <TableCell
                          key={col.field}
                          align="center"
                          className={`${
                            disableRow(row?.id)?.border
                          } !border-y !border-gray-200 !p-2 text-xs sm:text-sm md:text-base ${
                            isFirst ? "rounded-l-2xl border-l" : ""
                          } 
                          ${isLast ? "rounded-r-2xl border-r" : ""} 
                          ${
                            !isFirst && !isLast ? "!border-l-0 !border-r-0" : ""
                          }`}
                        >
                          {col.render
                            ? col.render(value, row, rowIndex)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    align="center"
                    className="py-4 text-gray-500 !border-none"
                  >
                    No data found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      {/* ----- Sticky Pagination (Bottom) ----- */}
      {productsCount > rowsPerPage && (
        <div className="sticky bottom-0 z-20">
          <Divider sx={{ my: 2 }} />
          <div className="flex items-center justify-center pb-2">
            <Pagination
              count={Math.ceil(productsCount / rowsPerPage)}
              color="primary"
              variant="outlined"
              shape="rounded"
              page={currentPage}
              onChange={(e, page) => {
                if (onPageChange) onPageChange(page);
              }}
            />
          </div>
        </div>
      )}
    </Paper>
  );
};

export default ProductTable;
