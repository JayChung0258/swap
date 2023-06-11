import { CopyIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  IconButton,
  Input,
  Link,
  Select,
  Stack,
  Text,
  useClipboard,
  useToast,
} from "@chakra-ui/react";
import { Web3Provider } from "@ethersproject/providers";
import { Seaport } from "@opensea/seaport-js";
import { useWeb3React } from "@web3-react/core";
// import { Client } from "@xmtp/xmtp-js";
import { ethers } from "ethers";
import { create } from "ipfs-http-client";
import React, { useState } from "react";

import { ItemType } from "../constants";
import { abi } from "../lib/abi/abi";
import config from "../lib/config.json";
import { injected } from "../lib/injected";
import { Chain, isChain } from "../lib/chain";
// import { Buffer } from "buffer";

export const Request = () => {
  const [assetURI, setAssetURI] = useState("");
  const [ownerAddress, setOwnerAddress] = useState(
    "0x05B135Bed01fc637e9e94253FcB73082997D7Fee"
  );
  const [assetURIErrorMessage, setAssetURIErrorMessage] = useState("");
  const [network, setNetwork] = useState("");
  const [nftContractAddress, setNFTContractAddress] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [tokenId1, setTokenId1] = useState("");
  const [tokenId2, setTokenId2] = useState("");
  const [contractAddress1, setContractAddress1] = useState("");
  const [contractAddress2, setContractAddress2] = useState("");
  const [tokenType1, setTokenType1] = useState();
  const [tokenType2, setTokenType2] = useState();
  const [orderURI, setOrderURI] = useState("");
  const toast = useToast();
  // const rpc = "https://mainnet.infura.io/v3/bec0d73480084555bb647f29c72fe941";
  const rpc = "https://goerli.infura.io/v3/bec0d73480084555bb647f29c72fe941";
  const provider = new ethers.providers.JsonRpcProvider(rpc);
  const { onCopy } = useClipboard(orderURI);
  const { activate, library, account } = useWeb3React();
  const clear = () => {
    setAssetURI("");
    setNFTContractAddress("");
    setTokenId("");
    setNetwork("");
    setOrderURI("");
  };

  const handleChangeContractAddress1 = (e) => {
    const inputValue = e.target.value;
    setContractAddress1(inputValue);
  };
  const handleChangeContractAddress2 = (e) => {
    const inputValue = e.target.value;
    setContractAddress2(inputValue);
  };
  const handleChangeTokenId1 = (e) => {
    const inputValue = e.target.value;
    setTokenId1(inputValue);
  };
  const handleChangeTokenId2 = (e) => {
    const inputValue = e.target.value;
    setTokenId2(inputValue);
  };

  const handleAssetURIChange = async (e) => {
    const inputValue = e.target.value;
    setAssetURI(inputValue);
    const [tokenId, nftContractAddress, network] = inputValue
      .split("/")
      .reverse();
    console.log(tokenId, nftContractAddress, network);
    if (
      typeof tokenId !== "string" ||
      typeof nftContractAddress !== "string" ||
      !ethers.utils.isAddress(nftContractAddress) ||
      typeof network !== "string" ||
      !isChain(network) ||
      !config[network]
    ) {
      clear();
      setAssetURIErrorMessage("URI Invalid");
      return;
    }
    const contract = new ethers.Contract(nftContractAddress, abi, provider);
    const owner = await contract.ownerOf(tokenId);

    console.log(owner, "owner");
    // const address = setAssetURIErrorMessage("");
    setNFTContractAddress(nftContractAddress);
    setTokenId(tokenId);
    setNetwork(network);
    setOwnerAddress(owner);
  };

  const handleTokenType1 = (e) => {
    switch (e.target.value) {
      case "ERC20":
        setTokenType1(ItemType.ERC20);
        break;
      case "ERC721":
        setTokenType1(ItemType.ERC721);
        break;
      case "ERC1155":
        setTokenType1(ItemType.ERC1155);
        break;
    }
  };
  const handleTokenType2 = (e) => {
    switch (e.target.value) {
      case "ERC20":
        setTokenType2(ItemType.ERC20);
        break;
      case "ERC721":
        setTokenType2(ItemType.ERC721);
        break;
      case "ERC1155":
        setTokenType2(ItemType.ERC1155);
        break;
    }
  };

  const createOrder = async () => {
    if (!library || !account) {
      activate(injected);
      return;
    }
    if (!assetURI || !nftContractAddress || !tokenId || !network) {
      toast({
        title: "Error",
        description: "Please fill in all the required fields",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    const seaport = new Seaport(library.getSigner(account), config.seaportURL);

    const orderData = {
      offer: [
        {
          itemType: tokenType1,
          token: contractAddress1,
          identifier: tokenId1,
        },
        // {
        //   amount: ethers.utils.parseEther("0.0001").toString(),
        //   gasLimit: 100000,
        // },
      ],
      consideration: [
        {
          itemType: ItemType.ERC721,
          token: nftContractAddress,
          identifier: tokenId,
          recipient: account,
        },
      ],
    };
    try {
      const { executeAllActions } = await seaport.createOrder(orderData, account);
      toast({
        title: "Order created",
        description: (
          <Box>
            <Text>Order created successfully. Order ID: test</Text>
            <Stack direction="row" mt={2}>
              <Link href={orderURI} isExternal>
                <Button size="sm" colorScheme="blue" leftIcon={<CopyIcon />}>
                  View Order URI
                </Button>
              </Link>
              <IconButton
                aria-label="Copy order URI"
                icon={<CopyIcon />}
                onClick={onCopy}
              />
            </Stack>
          </Box>
        ),
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      const order = await executeAllActions();

      console.log(order)
      if (account == ownerAddress) {
        const { executeAllActions: executeAllFulfillActions } =
          await seaport.fulfillOrder({
            order,
            accountAddress: ownerAddress,
          });
        const transaction = executeAllFulfillActions();
      }

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create order",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      console.error(error);
    }
  };

  const connect = async () => {
    activate(injected);
  };

  return (
    <Box>
      <Text>Create Order</Text>
      {!orderURI ? (
        <Stack spacing={4} mt={4}>
          <FormControl
            id="assetURI"
            isRequired
            isInvalid={!!assetURIErrorMessage}
          >
            <Input
              placeholder="Asset URI"
              value={assetURI}
              onChange={handleAssetURIChange}
            />
            <FormErrorMessage>{assetURIErrorMessage}</FormErrorMessage>
          </FormControl>
          <FormControl id="nftContractAddress" isRequired>
            <Input
              placeholder="NFT Contract Address"
              value={nftContractAddress}
              onChange={(e) => setNFTContractAddress(e.target.value)}
            />
          </FormControl>
          <FormControl id="tokenId" isRequired>
            <Input
              placeholder="Token ID"
              value={tokenId}
              onChange={(e) => setTokenId(e.target.value)}
            />
          </FormControl>

          <Text>Token 1</Text>
          <Box>
            <Select placeholder="Select token type" onChange={handleTokenType1}>
              <option value="ERC20">ERC20</option>
              <option value="ERC721">ERC721</option>
              <option value="ERC1155">ERC1155</option>
            </Select>
            <Input
              placeholder="ContractAddress"
              onChange={handleChangeContractAddress1}
            ></Input>
            <Input
              placeholder="tokenId"
              onChange={handleChangeTokenId1}
            ></Input>
          </Box>
          <Text mt="10">Token 2</Text>
          <Box>
            <Select placeholder="Select token type" onChange={handleTokenType2}>
              <option value="ERC20">ERC20</option>
              <option value="ERC721">ERC721</option>
              <option value="ERC1155">ERC1155</option>
            </Select>
            <Input
              placeholder="ContractAddress"
              onChange={handleChangeContractAddress2}
            ></Input>
            <Input
              placeholder="tokenId"
              onChange={handleChangeTokenId2}
            ></Input>
          </Box>
          <Button colorScheme="blue" onClick={createOrder}>
            Create Order
          </Button>
          {!library || !account ? (
            <Button colorScheme="blue" onClick={connect}>
              Connect Wallet
            </Button>
          ) : (
            <Button colorScheme="blue" onClick={clear}>
              Clear
            </Button>
          )}
        </Stack>
      ) : (
        <Box>
          <Text>Order URI: {orderURI}</Text>
          <Stack direction="row" mt={2}>
            <Link href={orderURI} isExternal>
              <Button size="sm" colorScheme="blue" leftIcon={<CopyIcon />}>
                View Order URI
              </Button>
            </Link>
            <IconButton
              aria-label="Copy order URI"
              icon={<CopyIcon />}
              onClick={onCopy}
            />
          </Stack>
        </Box>
      )}
    </Box>
  );
};
