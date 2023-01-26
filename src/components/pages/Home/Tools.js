import { Box, Button, Divider, Grid, Typography } from "@mui/material";
import React from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import FailedToFetch from "../../shared/FailedToFetch";
import LoadingSpinner from "../../shared/LoadingSpinner";
import ProductCard from "../../shared/ProductCard";

const Tools = () => {
  const {
    isLoading,
    error,
    data: tools,
  } = useQuery("tools", () =>
    fetch(
      "https://manufacturing-company-website-server.vercel.app/api/v1/tools"
    ).then((res) => res.json())
  );

  if (isLoading) {
    return <LoadingSpinner></LoadingSpinner>;
  }
  if (error) {
    return <FailedToFetch></FailedToFetch>;
  }
  const firstThree = tools.data.slice(0, 3);

  return (
    <Box sx={{marginBottom: 8}}>
      <Divider />
      <Typography variant="h4" align="center" color="primary" sx={{margin: ".5rem 0"}}>
        Our Top Products
      </Typography>
      <Divider />
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(1, 1fr)",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          },
          gap: 4,
          placeItems: "center",
          marginTop: 1,
          marginBottom: 2,
        }}
      >
        {firstThree.map((tool) => (
          <ProductCard key={tool._id} tool={tool} />
        ))}
      </Box>
      <Button
        variant="contained"
        sx={{ display: "block", margin: "0 auto" }}
        size="large"
      >
        <Link to="/all-products">All Products</Link>
      </Button>
    </Box>
  );
};

export default Tools;
