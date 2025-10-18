import { Box } from "@mui/material";
import { MaterialReactTable } from "material-react-table";

const ResponsiveTableContainer = ({ table }) => {
  return (
    <Box
      sx={{
        p: { xs: 0.5, sm: 1, md: 2 },
        m: { xs: 0.5, sm: 1 },
        maxWidth: { xs: "100%", md: "900px" },
        maxHeight: { xs: 400, sm: 500, md: 600 },
        overflow: "auto",
        width: "100%",
        "& .MuiTable-root": {
          minWidth: "800px",
        },
        "& .MuiTableCell-root": {
          padding: { xs: "4px 2px", sm: "6px 4px", md: "8px 6px" },
          fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.9rem" },
        },
      }}
    >
    <Box>
      <MaterialReactTable table={table} />
    </Box>
    </Box>
  );
};

export default ResponsiveTableContainer;