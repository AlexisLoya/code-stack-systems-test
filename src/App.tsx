import { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { getUsers } from "./services/users";
import {
  Box,
  Grid,
  MenuItem,
  Modal,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  Container,
  Paper,
  TableCell,
  TableRow,
} from "@mui/material";
import UserTable from "./componets/UserTable";
import NavBar from "./componets/NavBar";
import { User } from "./services/users";
import UserDetails from "./componets/UserDetails";

ChartJS.register(ArcElement, Tooltip, Legend);

function App() {
  // table props
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const headers = ["name", "email", "gender", "status", "action"];
  // filters
  const [nameFilter, setNameFilter] = useState<string>("");
  const [emailFilter, setEmailFilter] = useState<string>("");
  const [genderFilter, setGenderFilter] = useState("");
  const [chartData, setChartData] = useState<any>({
    labels: ["Male", "Female"],
    datasets: [{ label: "", data: [] }],
  });

  //modal
  const [open, setOpen] = useState(false);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const handleOpen = (user: User) => {
    setViewingUser(user);
    setOpen(true);
  };

  const handleClose = () => {
    setViewingUser(null);
    setOpen(false);
  };
  const fillChartData = () => {
    let males = 0;
    let females = 0;
    users.forEach((user) => {
      if (user.gender === "female") {
        females += 1;
      } else {
        males += 1;
      }
    });
    setChartData({
      labels: ["Male", "Female"],
      datasets: [
        {
          label: "# number",
          data: [males, females],
          backgroundColor: ["#3e95cd", "#8e5ea2"],
        },
      ],
    });
  };
  const fetchUsers = async () => {
    const reponse = await getUsers<User[]>({
      page: page,
      per_page: perPage,
      name: nameFilter,
      email: emailFilter,
      gender: genderFilter,
    });
    const totalPagesResponse = parseInt(reponse.headers["x-pagination-total"]);
    setTotalRows(totalPagesResponse);
    setTotalPages(Math.ceil(totalPagesResponse / perPage));
    setUsers(reponse.data);
  };

  const handleChangePerPage = (event: SelectChangeEvent<number>) => {
    setPerPage(parseInt(event.target.value.toString()));
  };
  const handleChangePage = (event: SelectChangeEvent<number>) => {
    setPage(parseInt(event.target.value.toString()));
  };

  useEffect(() => {
    fetchUsers();
  }, [perPage, page, nameFilter, emailFilter, genderFilter]);

  useEffect(() => {
    fillChartData();
  }, [users]);

  return (
    <div>
      <NavBar />
      <Container maxWidth="lg" sx={{ marginTop: 5 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              {/* Filtros de búsqueda */}
              <Typography variant="h6">Search Filters</Typography>
              <TextField
                label="Search by name"
                name="name"
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value.trim())}
                variant="outlined"
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="Search by email"
                variant="outlined"
                value={emailFilter}
                onChange={(e) => setEmailFilter(e.target.value.trim())}
                name="email"
                fullWidth
                sx={{ mb: 2 }}
              />
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="gender-label">Search by gender</InputLabel>
                <Select
                  labelId="gender-label"
                  label="Search by gender"
                  value={genderFilter}
                  onChange={(e) => setGenderFilter(e.target.value)}
                  fullWidth
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                </Select>
              </FormControl>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              {/* Gráfica */}
              <Typography variant="h6">Chart</Typography>
              <div style={{ height: "218px", width: "500px" }}>
                <Pie data={chartData} height={20} width={20} />
              </div>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              {/* Tabla */}
              <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
              >
                <Box sx={style}>
                  <UserDetails user={viewingUser} />
                </Box>
              </Modal>
              <Typography variant="h6">User list</Typography>
              <UserTable
                users={users}
                headers={headers}
                handleOpen={handleOpen}
              />
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableBody>
                  <TableRow>
                    <TableCell align="right">Total rows: {totalRows}</TableCell>
                    <TableCell align="right">
                      Per page:
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={perPage}
                        label="Perpage"
                        onChange={handleChangePerPage}
                      >
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={20}>20</MenuItem>
                        <MenuItem value={30}>30</MenuItem>
                        <MenuItem value={40}>40</MenuItem>
                        <MenuItem value={70}>70</MenuItem>
                        <MenuItem value={100}>100</MenuItem>
                      </Select>
                    </TableCell>
                    <TableCell align="right">
                      Page:
                      <Select
                        value={page}
                        label="Page"
                        onChange={handleChangePage}
                      >
                        {Array.from(Array(totalPages).keys()).map((item) => (
                          <MenuItem value={item + 1} key={item}>
                            {item + 1}
                          </MenuItem>
                        ))}
                      </Select>{" "}
                      / {totalPages}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}

export default App;
