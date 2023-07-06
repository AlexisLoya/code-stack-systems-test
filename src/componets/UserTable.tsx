import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import { User } from "../services/users";
import { IconButton, Typography } from "@mui/material";
interface UserTableProps {
  users: User[];
  headers: string[];
  handleOpen: (user: User) => void;
}

const UserTable: React.FC<UserTableProps> = ({
  users,
  headers,
  handleOpen,
}) => {
  if (users.length === 0) {
    return (
      <Typography
        variant="h6"
        component="div"
        sx={{ flexGrow: 1, textAlign: "center", padding: "1em" }}
      >
        No hay resultados para mostrar.
      </Typography>
    );
  }
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table" size="small">
        <TableHead>
          <TableRow>
            {headers.map((property) => (
              <TableCell align="right" key={property}>
                {property.toLocaleUpperCase()}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((row) => (
            <TableRow
              key={row.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell align="right">{row.name}</TableCell>
              <TableCell align="right">{row.email}</TableCell>
              <TableCell align="right">{row.gender}</TableCell>
              <TableCell align="right">{row.status}</TableCell>
              <TableCell align="center">
                <IconButton onClick={() => handleOpen(row)}>{">"}</IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UserTable;
