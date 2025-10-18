"use client";
import {
  Card,
  CardContent,
  Grid,
  Box,
} from "@mui/material";

const TablePropertyItem = ({ data, title }) => (
  <Card
    sx={{
      width: "100%",
      borderRadius: "12px",
      boxShadow: 0,
    }}
  >
    <CardContent sx={{ p: 1 }}>
      {data.map((item, index) => (
        <Grid 
          container 
          key={item.field}
          sx={{ 
            borderBottom: index !== data.length - 1 ? "1px solid #e0e0e0" : 'none',
            py: 0.5
          }}
        >
          <Grid item xs={6} sx={{ 
            fontWeight: "bold", 
            fontSize: "12px", 
            textAlign: "center",
            borderRight: "1px solid #e0e0e0",
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {item.field}
          </Grid>
          <Grid item xs={6} sx={{ 
            fontSize: "12px", 
            textAlign: "center",
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {item.value}
          </Grid>
        </Grid>
      ))}
    </CardContent>
  </Card>
);

export default TablePropertyItem;