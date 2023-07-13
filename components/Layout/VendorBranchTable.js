import React from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

const VendorBranchTable = ({
  subBranchList,
  setSubBranchModalOpen,
  setEditSubBranchId,
  setBranchDeleteModalOpen,
  setDeleteBranchId,
}) => {
  return (
    <>
      <div>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="left">
                  <b>Branch Name</b>
                </TableCell>
                <TableCell align="left">
                  <b>Manager Name</b>
                </TableCell>
                <TableCell align="left">
                  <b>Phone Number</b>
                </TableCell>
                <TableCell align="left">
                  <b>Branch Address</b>
                </TableCell>
                <TableCell align="left">
                  <b>City</b>
                </TableCell>
                <TableCell align="left">
                  <b>Action</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {subBranchList?.map((item, index) => (
                <TableRow
                  key={index}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                  }}
                >
                  <TableCell align="left">Branch {index + 1}</TableCell>
                  <TableCell align="left">{item.manager_name}</TableCell>
                  <TableCell align="left">{item?.manager_contact}</TableCell>
                  <TableCell align="left">{item?.branch_address}</TableCell>
                  <TableCell align="left">{item?.branch_city}</TableCell>
                  <TableCell align="left">
                    <div className="flex gap-2">
                      <span className="bg-[#151827]  text-white rounded-full lg:p-2 px-2 py-1">
                        <EditOutlinedIcon
                          sx={{
                            "@media (max-width: 768px)": {
                              fontSize: 16,
                            },
                          }}
                          className="cursor-pointer"
                          onClick={() => {
                            setSubBranchModalOpen(true);
                            setEditSubBranchId(item?.id);
                          }}
                        />
                      </span>
                      <span className="bg-[#D63848]  text-white rounded-full lg:p-2 px-2 py-1">
                        <DeleteOutlineOutlinedIcon
                          sx={{
                            "@media (max-width: 768px)": {
                              fontSize: 16,
                            },
                          }}
                          className="cursor-pointer"
                          onClick={() => {
                            setBranchDeleteModalOpen(true);
                            setDeleteBranchId(item?.id);
                          }}
                        />
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  );
};

export default VendorBranchTable;