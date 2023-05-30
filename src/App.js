import "./css/App.css";
import { Layout } from "./components/Layout";
import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "../src/lib/theme";

function App() {
  function getLibrary(provider) {
    return new Web3Provider(provider);
  }

  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <ChakraProvider theme={theme}>
        <Layout></Layout>
      </ChakraProvider>
    </Web3ReactProvider>
  );
}

export default App;
