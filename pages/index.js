import { useCallback, useEffect, useState } from 'react'

import { ethers } from 'ethers'
import Web3Modal from "web3modal"

import { Footer } from '../components/Footer'
import { Stat } from '../components/Stat'
import { CartOrderSummary } from '../components/CartOrderSummary'
import { MainContent } from '../components/MainContent'
import { CartPurchaseNft } from '../components/CartPurchaseNft'

import Head from 'next/head'
import { Logo } from '../components/Logo'

import { 
  Box, 
  Container, 
  useColorModeValue, 
  SimpleGrid, 
  ButtonGroup, 
  Flex, 
  useBreakpointValue, 
  Button,
  HStack
} from '@chakra-ui/react'

import { SPORE, CONDOR, POWER, NFT, NFTSALE, POWERSALE, STAKING } from "../helpers/contracts"
import { PROVIDER_OPTIONS, BSC_MAINNET_PROVIDER, NFT_KEY } from "../helpers/constants"

let web3Modal

if (typeof window !== 'undefined') {
    web3Modal = new Web3Modal({
        cacheProvider: true,
        PROVIDER_OPTIONS,
    })
}

const provider = new ethers.providers.JsonRpcProvider(BSC_MAINNET_PROVIDER)
const signer = provider.getSigner()

export default function Home() {

  const isDesktop = useBreakpointValue({
    base: false,
    lg: true,
  })
  
  const [injectedProvider, setInjectedProvider] = useState(provider);
  const [injectedSigner, setInjectedSigner] = useState(signer);
  const [address, setAddress] = useState();

  //const [totalStakedAmount, setTotalStakedAmount] = useState();

  //user balances
  const [userStakedBalance, setUserStakedBalance] = useState()
  const [userNFTBalance, setUserNFTBalance] = useState()
  const [userSporeBalance, setUserSporeBalance] = useState()
  const [userCondorBalance, setUserCondorBalance] = useState()
  const [userPowerBalance, setUserPowerBalance] = useState()
  const [userBnbBalance, setUserBnbBalance] = useState()

  //contracts
  const [sporeContract, setSporeContract] = useState()
  const [condorContract, setCondorContract] = useState()
  const [powerContract, setPowerContract] = useState()
  const [stakingContract, setStakingContract] = useState()
  const [nftContract, setNftContract] = useState()
  const [nftSaleContract, setNftSaleContract] = useState()
  const [powerSaleContract, setPowerSaleContract] = useState()

  const updateUserBalances = async (address) => {
    const balanceBnb = await injectedProvider.getBalance(address)
    const balanceSpore = await sporeContract.balanceOf(address)
    const balanceCondor = await condorContract.balanceOf(address)
    const balancePower = await powerContract.balanceOf(address)
    const stakedTokens = await stakingContract.totalStakedFor(address)
    const nft = await nftContract.balanceOf(address, NFT_KEY)

    setUserBnbBalance(balanceBnb)
    setUserSporeBalance(balanceSpore)
    setUserCondorBalance(balanceCondor)
    setUserPowerBalance(balancePower)
    setUserStakedBalance(stakedTokens)
    setUserNFTBalance(nft)

    console.log("address mainnet bnb balance", ethers.utils.formatEther(balanceBnb))
    console.log("address mainnet spore balance", ethers.utils.formatEther(balanceSpore))
    console.log("address mainnet condor balance", ethers.utils.formatEther(balanceCondor))
    console.log("address mainnet power balance", ethers.utils.formatEther(balancePower))
    console.log("address mainnet staked balance", parseInt(stakedTokens))
    console.log("address mainnet nft balance", parseInt(nft))
  }

  const loadContracts = async () => {
    const sporeTokenContract = new ethers.Contract(SPORE.address, SPORE.abi, injectedProvider)
    const condorTokenContract = new ethers.Contract(CONDOR.address, CONDOR.abi, injectedProvider)
    const powerTokenContract = new ethers.Contract(POWER.address, POWER.abi, injectedProvider)
    const stakingContract = new ethers.Contract(STAKING.address, STAKING.abi, injectedProvider)
    const nftContract = new ethers.Contract(NFT.address, NFT.abi, injectedProvider)
    const nftSaleContract = new ethers.Contract(NFTSALE.address, NFTSALE.abi, injectedProvider)
    const powerSaleContract = new ethers.Contract(POWERSALE.address, POWERSALE.abi, injectedProvider)

    setSporeContract(sporeTokenContract)
    setCondorContract(condorTokenContract)
    setPowerContract(powerTokenContract)
    setStakingContract(stakingContract)
    setNftContract(nftContract)
    setNftSaleContract(nftSaleContract)
    setPowerSaleContract(powerSaleContract)
  }

  const formatNumber = (number) => {
    const amount = ethers.utils.formatEther(number)
    const calcDec = Math.pow(10, 0);

    return Math.trunc(amount * calcDec) / calcDec;
  }

  const connect = useCallback(async () => {
    try {
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()
        const address = await signer.getAddress()
        const net = await provider.getNetwork()

        connection.on("chainChanged", chainId => {
            console.log(`chain changed to ${chainId}! updating providers`);
            setNetwork(chainId);
        });
      
        connection.on("accountsChanged", (accounts) => {
            console.log(`account changed!`, accounts[0]);
            setAddress(accounts[0]);
            
        });
      
        connection.on("disconnect", (code, reason) => {
            console.log(code, reason);
            disconnect()
        });

        if(net.chainId == 56) {
          setInjectedProvider(provider)
          setInjectedSigner(signer)
        }
        else{
          console.log("wrong network")
        }

        setAddress(address)
    } catch (error) {
        console.log("error on connect wallet", error)
    }
}, []);

  const disconnect = useCallback(async function () {
      await web3Modal.clearCachedProvider()
      setAddress('')
      setInjectedProvider('')
      setInjectedSigner('')
      //add page refresh
  }, [injectedProvider])


useEffect(() => {
  if (web3Modal.cachedProvider) {
    connect()
  }
}, [connect])

useEffect(() => {
  if(injectedProvider) {
    loadContracts()  
  }
}, [injectedProvider, injectedSigner]);

useEffect(() => {
  if(address) {
    updateUserBalances(address)
    console.log("address fetched from home", address)   
  }

}, [address]);

  return (
    <>
    <Head>
        <title>Condor Staking NFT UI</title>
    </Head>
    
    <Box
        as="section"
      >
        <Box as="nav" bg="bg-surface" boxShadow={useColorModeValue('sm', 'sm-dark')}>
          <Container
            py={{
              base: '4',
              lg: '5',
            }}
          >

            <HStack spacing="10" justify="space-between">
              <Logo />
              {isDesktop ? (
                <Flex justify="space-between" flex="1">
                  <ButtonGroup variant="link" spacing="8">
                    {['Condor NFT Staking Module'].map((item) => (
                      <Button key={item}>{item}</Button>
                    ))}
                  </ButtonGroup>
                  <HStack spacing="3">
                  {address ? (
                      <Button colorScheme='gray' onClick={disconnect}>Connected</Button>
                  ) : (
                      <Button colorScheme='red' onClick={connect}>Connect Wallet</Button>
                  )}
                  </HStack>
                </Flex>
              ) : (
                address ? (
                  <Button colorScheme='gray' onClick={disconnect}>Connected</Button>
                ) : (
                    <Button colorScheme='red' onClick={connect}>Connect Wallet</Button>
                )
              )}
            </HStack>
          </Container>
        </Box>
    </Box>

    <Box
        as="section"
        py={{
          base: '4',
          md: '8',
        }}
      >
      <Container>
        <SimpleGrid
          columns={{
            base: 1,
            md: 5,
          }}
          gap={{
            base: '5',
            md: '6',
          }}
        >
          <Stat label='Your Spore Balance' value={userSporeBalance ? formatNumber(userSporeBalance):0} />
          <Stat label='Your Power Balance' value={userPowerBalance ? formatNumber(userPowerBalance):0} />
          <Stat label='Your Condor Balance' value={userCondorBalance ? formatNumber(userCondorBalance):0} />
          <Stat label='Your NFT Balance' value={userNFTBalance ? parseInt(userNFTBalance):0} />
          <Stat label='Your Staked NFTs' value={userStakedBalance ? parseInt(userStakedBalance):0} />
        </SimpleGrid>
      </Container>
    </Box>

    <Container>
      <Box
        px={{
          base: '4',
          md: '6',
        }}
        py={{
          base: '5',
          md: '6',
        }}
        w='100%' 
        p={4} 
        bg="bg-surface"
        borderRadius="lg"
        boxShadow={useColorModeValue('sm', 'sm-dark')}>
        
        <SimpleGrid
          columns={{
            base: 1,
            md: 3,
          }}
          gap={{
            base: '5',
            md: '6',
          }}
        >
          
          <CartOrderSummary />
          <CartPurchaseNft />
          <MainContent />
          
        </SimpleGrid>
      </Box>
    </Container>

    <Footer />
      
    </>
  )
}
