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
  setAddEditSubBranchShow,
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
                {[
                  "Branch Name",
                  "Manager Name",
                  "Phone Number",
                  "Branch Address",
                  "City",
                  "Action",
                ].map((itm, index) => (
                  <TableCell align="left" key={index}>
                    <b>{itm}</b>
                  </TableCell>
                ))}
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
                      <span className="flex justify-center items-center bg-[#151827]  text-white rounded-full lg:p-2 px-2 py-1">
                        <EditOutlinedIcon
                          sx={{
                            fontSize: 18,
                            "@media (max-width: 768px)": {
                              fontSize: 16,
                            },
                          }}
                          className="cursor-pointer"
                          onClick={() => {
                            setAddEditSubBranchShow(true);
                            setEditSubBranchId(item?.id);
                          }}
                        />
                      </span>
                      <span className="flex justify-center items-center  bg-[#D63848]  text-white rounded-full lg:p-2 px-2 py-1">
                        <DeleteOutlineOutlinedIcon
                          sx={{
                            fontSize: 18,
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
