//import TablePropertyItem from  "@components/ui/TablePropertyItem"

"use client";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  TableHead
} from "@mui/material";
const TablePropertyItem = ({ data, title }) => (
  <Card
    sx={{
      maxWidth: 300,
      borderRadius: "12px",
      boxShadow: 0,
    }}
  >
    <CardContent>
      <Typography
        variant="h6"
        sx={{
          fontSize: "12px",
          mb: 1,
        //  color: "#d32f2f",
        }}
      >
        {title}
      </Typography>

      <TableContainer>
        <Table size="small">
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.field}>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    fontSize: "13px",
                    borderRight: "1px solid #e0e0e0",
                    textAlign: "center",
                    width: "20%",
                    p: 0,
                  }}
                >
                  {item.field}
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "center",
                    width: "30%",
                    p: 0,
                  }}
                >
                  {item.value}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </CardContent>
  </Card>
);
export default TablePropertyItem