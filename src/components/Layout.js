import React from "react";
import { Box, Container, Flex, Stack } from "@chakra-ui/react";

import { Footer } from "./Footer";
import { Header } from "./Header";
import { Request } from "./Reqeust";

export const Layout = ({ children }) => {
  return (
    <Flex minHeight={"100vh"} direction={"column"}>
      <Header />
      <Box flex={1}>
        <Container>
          <Request />
          {/* <Stack>{children}</Stack> */}
        </Container>
      </Box>
      <Footer />
    </Flex>
  );
};
