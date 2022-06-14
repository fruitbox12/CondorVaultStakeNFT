
import { providers, ethers } from 'ethers'
import { useCallback, useEffect, useState } from 'react'

import Portis from "@portis/web3";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Authereum from "authereum";
import Fortmatic from "fortmatic";
import WalletLink from "walletlink";
import Web3Modal from "web3modal";

import {
    Box,
    Button,
    ButtonGroup,
    Container,
    Flex,
    HStack,
    IconButton,
    useBreakpointValue,
    useColorModeValue,
  } from '@chakra-ui/react'

import { useStaticJsonRPC } from "../hooks/useStaticJsonRPC";

const mainnetProviders = [
    "https://bsc-dataseed1.binance.org",
    "https://bsc-dataseed2.binance.org",
    "https://bsc-dataseed3.binance.org",
    "https://bsc-dataseed4.binance.org",
    "https://bsc-dataseed1.defibit.io",
    "https://bsc-dataseed2.defibit.io",
    "https://bsc-dataseed3.defibit.io",
    "https://bsc-dataseed4.defibit.io",
    "https://bsc-dataseed1.ninicoin.io",
    "https://bsc-dataseed2.ninicoin.io",
    "https://bsc-dataseed3.ninicoin.io",
    "https://bsc-dataseed4.ninicoin.io"
];

const testnetProviders = [
    "https://data-seed-prebsc-1-s1.binance.org:8545",
    "https://data-seed-prebsc-2-s1.binance.org:8545",
    "https://data-seed-prebsc-1-s3.binance.org:8545",
    "https://data-seed-prebsc-2-s3.binance.org:8545"
];




const INFURA_ID = '460f40a260564ac4a4f4b3fffb032dad'



const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        infuraId: INFURA_ID, // required
      },
    },
    'custom-walletlink': {
      display: {
        logo: 'https://play-lh.googleusercontent.com/PjoJoG27miSglVBXoXrxBSLveV6e3EeBPpNY55aiUUBM9Q1RCETKCOqdOkX2ZydqVf0',
        name: 'Coinbase',
        description: 'Connect to Coinbase Wallet (not Coinbase App)',
      },
      options: {
        appName: 'Coinbase', // Your app name
        networkUrl: `https://mainnet.infura.io/v3/${INFURA_ID}`,
        chainId: 1,
      },
      package: WalletLink,
      connector: async (_, options) => {
        const { appName, networkUrl, chainId } = options
        const walletLink = new WalletLink({
          appName,
        })
        const provider = walletLink.makeWeb3Provider(networkUrl, chainId)
        await provider.enable()
        return provider
      },
    },
  }

    
  let web3Modal
  if (typeof window !== 'undefined') {
    web3Modal = new Web3Modal({
      cacheProvider: true,
      providerOptions, // required
    })
  }
  
  //const mainnetProvider = useStaticJsonRPC(mainnetProviders);
  //const testnetProvider = useStaticJsonRPC(testnetProviders);

export const ConnectButton = () => {
    
    const [injectedProvider, setInjectedProvider] = useState();
    const [address, setAddress] = useState();
    const [network, setNetwork] = useState();

    const connect = useCallback(async () => {
        const provider = await web3Modal.connect();

        const web3Provider = new providers.Web3Provider(provider)
        setInjectedProvider(web3Provider)
        
        const signer = web3Provider.getSigner()
        const address = await signer.getAddress()
        const network = await web3Provider.getNetwork()
        
        setAddress(address);
        setNetwork(network);
        
    
        provider.on("chainChanged", chainId => {
          console.log(`chain changed to ${chainId}! updating providers`);
          setNetwork(chainId);
        });
    
        provider.on("accountsChanged", (accounts) => {
          console.log(`account changed!`, accounts[0]);
          setAddress(accounts[0]);
          
        });
    
        provider.on("disconnect", (code, reason) => {
          console.log(code, reason);
          disconnect()
        });

    }, []);
    
    useEffect(() => {
        if (web3Modal.cachedProvider) {
          connect();
        }
    }, [connect]);

    const disconnect = useCallback(async function () {
        await web3Modal.clearCachedProvider()
        setAddress('')
        setInjectedProvider('')
    }, [injectedProvider])

    useEffect(() => {
        if(address) {
            console.log(address);
        }

    }, [address, injectedProvider]);

    return (
        <>
            {injectedProvider ? (
                <Button colorScheme='gray' onClick={disconnect}>Connected</Button>
            ) : (
                <Button colorScheme='red' onClick={connect}>Connect Wallet</Button>
            )}
        </>
    )
}