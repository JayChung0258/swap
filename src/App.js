import "./css/App.css";
import { Layout } from "./components/Layout";
import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "../src/lib/theme";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Header } from './components/Header';

import { Request } from "./components/Reqeust";
import OtherPage from "./OtherPage";

function App() {
  function getLibrary(provider) {
    return new Web3Provider(provider);
  }

  return (
    <Router >
      <Web3ReactProvider getLibrary={getLibrary}>
        <ChakraProvider theme={theme}>
          <Header />
          <Routes>
            <Route path="/" element={<Layout />} />
            <Route path="/other-page" element={<OtherPage />} />
          </Routes>

        </ChakraProvider>
      </Web3ReactProvider>

    </Router>
  );
}

export default App;
