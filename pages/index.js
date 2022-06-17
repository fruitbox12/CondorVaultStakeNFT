import { useCallback, useEffect, useState } from 'react'

import { ethers } from 'ethers'
import Web3Modal from "web3modal"

import { Footer } from '../views/Footer'
import { HeaderStat } from '../views/HeaderStat'

import Head from 'next/head'
import { Logo } from '../views/Logo'

import {
  Container, 
  SimpleGrid, 
  ButtonGroup, 
  Flex, 
  HStack,
  Button,
  Divider,
  Heading,
  InputGroup,
  InputRightElement,
  Input,
  Stack,
  Text,
  Box,
  Stat,
  StatLabel,
  useBreakpointValue,
  useColorModeValue,
} from '@chakra-ui/react'

import { FaFeather, FaExternalLinkAlt, FaBolt, FaAngleDoubleDown, FaAngleDoubleUp, FaCoins } from 'react-icons/fa'

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
  
  const [injectedProvider, setInjectedProvider] = useState(provider)
  const [injectedSigner, setInjectedSigner] = useState(signer)
  const [address, setAddress] = useState()
  const [count, setCount] = useState(0)

  const [totalStakedAmount, setTotalStakedAmount] = useState()
  const [priceCondorNFT, setPriceCondorNFT] = useState()


  //user balances
  const [userStakedBalance, setUserStakedBalance] = useState()
  const [userPendingRewards, setUserPendingRewards] = useState()
  const [userAvailableStaking, setUserAvailableStaking] = useState()
  const [userNFTBalance, setUserNFTBalance] = useState()
  const [userSporeBalance, setUserSporeBalance] = useState()
  const [userCondorBalance, setUserCondorBalance] = useState()
  const [userPowerBalance, setUserPowerBalance] = useState()
  const [userBnbBalance, setUserBnbBalance] = useState()

  const [userAllowancePurchasePower, setUserAllowancePurchasePower] = useState()
  const [userAllowancePurchaseNFT, setUserAllowancePurchaseNFT] = useState()
  const [userAllowanceStakeNFT, setUserAllowanceStakeNFT] = useState()

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
    const pendingRewards = await stakingContract.takeWithAddress(address)
    const availableStaking = await stakingContract.getUserAvailableStaking(address)
    const nft = await nftContract.balanceOf(address, NFT_KEY)

    const allowancePurchasePower = await sporeContract.allowance(address, POWERSALE.address)
    const allowancePurchaseNFT = await sporeContract.allowance(address, NFTSALE.address)
    const allowanceStakedNFT = await nftContract.isApprovedForAll(address, STAKING.address)

    setUserBnbBalance(balanceBnb)
    setUserSporeBalance(balanceSpore)
    setUserCondorBalance(balanceCondor)
    setUserPowerBalance(balancePower)
    setUserStakedBalance(stakedTokens)
    setUserPendingRewards(formatNumber6Dec(pendingRewards))
    setUserNFTBalance(nft)

    setUserAllowancePurchasePower(allowancePurchasePower)
    setUserAllowancePurchaseNFT(allowancePurchaseNFT)
    setUserAllowanceStakeNFT(allowanceStakedNFT)
    setUserAvailableStaking(availableStaking)

    console.log("address mainnet bnb balance", ethers.utils.formatEther(balanceBnb))
    console.log("address mainnet spore balance", ethers.utils.formatEther(balanceSpore))
    console.log("address mainnet condor balance", ethers.utils.formatEther(balanceCondor))
    console.log("address mainnet power balance", ethers.utils.formatEther(balancePower))
    console.log("address mainnet staked balance", parseInt(stakedTokens))
    console.log("address mainnet pending rewards", formatNumber6Dec(pendingRewards))
    console.log("address mainnet nft balance", parseInt(nft))

    console.log("address mainnet power sale allowance", ethers.utils.formatEther(allowancePurchasePower))
    console.log("address mainnet nft sale allowance", ethers.utils.formatEther(allowancePurchaseNFT))
    console.log("address mainnet nft staking allowance", allowanceStakedNFT)
    console.log("address mainnet nft staking available", parseInt(availableStaking))
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

  const loadDefaultValues = async () => {
    const priceNFT = await nftSaleContract._NFTPrices(NFT_KEY)
    const stakedTokens = await stakingContract.totalStaked()
    
    setPriceCondorNFT(BigInt(priceNFT).toString())
    setTotalStakedAmount(BigInt(stakedTokens).toString())
  }

  const formatNumber = (number) => {
    const amount = ethers.utils.formatEther(number)
    const calcDec = Math.pow(10, 0);

    return Math.trunc(amount * calcDec) / calcDec;
  }

  const formatNumber6Dec = (number) => {
    const amount = ethers.utils.formatEther(number)
    const calcDec = Math.pow(10, 6);

    return Math.trunc(amount * calcDec) / calcDec;
  }

  const getCondorNFT = async () => {

    if(!address || !userSporeBalance || !priceCondorNFT) {
      console.log("display init error msgs")
      return;
    }

    const input = document.querySelector('#inputGetCondorNFT')

    if(!Number.isInteger(parseInt(input.value)) || parseInt(input.value) == 0 || input.value.length == 0) {
      console.log("display not numeric input error msgs")
      return;
    }

    const inputValue = input.value*formatNumber(priceCondorNFT)
    const formattedValue = parseInt(ethers.utils.parseEther(inputValue.toString()))
    
    if(formatNumber(userSporeBalance) < inputValue) {
      console.log("display not enough funds error msgs")
      return;
    }

    if(parseInt(userAllowancePurchaseNFT) < formattedValue) {
      console.log("approving the nft sale contract to spend your spore")
      const sporeContractSigner = sporeContract.connect(injectedSigner);
      const approveTX = await sporeContractSigner.approve(NFTSALE.address, formattedValue.toString())
      console.log("approving the spent...")
      await approveTX.wait()

      if(approveTX) {
        console.log("approve success!")
        setUserAllowancePurchaseNFT(formattedValue)
      }
    }

    console.log("begin purchase of the nfts")

    const nftSaleContractSigner = nftSaleContract.connect(injectedSigner)
    const approvePurchaseTX = await nftSaleContractSigner.purchase(address, NFT_KEY, input.value, "0x0000")
    console.log("purchasing the nfts...")
    await approvePurchaseTX.wait()
    
    if(!approvePurchaseTX) {
      console.log("error purchasing nfts")
    }

    console.log("nfts purchased")
    input.value = ''
    updateUserBalances(address)
  }

  const getSporePower = async () => {

    if(!address || !userSporeBalance) {
      console.log("display init error msgs")
      return;
    }

    const input = document.querySelector('#inputGetSporePower')

    if(!Number.isInteger(parseInt(input.value)) || parseInt(input.value) == 0 || input.value.length == 0) {
      console.log("display not numeric input error msgs")
      return;
    }

    const formattedValue = ethers.utils.parseEther(input.value)
    const inputValue = parseInt(input.value)

    if(formatNumber(userSporeBalance) < inputValue) {
      console.log("display not enough funds error msgs")
      return;
    }

    if(parseInt(userAllowancePurchasePower) < parseInt(formattedValue)) {
      console.log("approving the power sale contract to spend your spore")
      const sporeContractSigner = sporeContract.connect(injectedSigner);
      const approveTX = await sporeContractSigner.approve(POWERSALE.address, formattedValue)
      console.log("approving the spent...")
      await approveTX.wait()

      if(approveTX) {
        console.log("approve success!")
        setUserAllowancePurchasePower(formattedValue)
      }
    }

    console.log("begin purchase of the tokens")

    const powerSaleContractSigner = powerSaleContract.connect(injectedSigner)
    const approvePurchaseTX = await powerSaleContractSigner.purchase(formattedValue)
    console.log("purchasing the tokens...")
    await approvePurchaseTX.wait()
    
    if(!approvePurchaseTX) {
      console.log("error purchasing spore power")
    }

    console.log("spore power purchased")
    input.value = ''
    updateUserBalances(address)
  }

  const stakeCondorNFT = async () => {

    if(!address || !userNFTBalance || !userAvailableStaking) {
      console.log("display init error msgs")
      return;
    }

    const input = document.querySelector('#inputStakeCondorNFT')

    if(!Number.isInteger(parseInt(input.value)) || parseInt(input.value) == 0 || input.value.length == 0) {
      console.log("display not numeric input error msgs")
      return;
    }

    const inputValue = parseInt(input.value)

    if(parseInt(userAvailableStaking) == 0) {
      console.log("display not available staking slots error msgs")
      return;
    }

    if(parseInt(userNFTBalance) < inputValue) {
      console.log("display not enough funds error msgs")
      return;
    }

    if(userAllowanceStakeNFT == false) {
      console.log("approving the staking contract to use NFTs")
      const nftContractSigner = nftContract.connect(injectedSigner);
      const approveTX = await nftContractSigner.setApprovalForAll(STAKING.address, true)
      console.log("approving the use of NFTs...")
      await approveTX.wait()

      if(approveTX) {
        console.log("approve success!")
        setUserAllowanceStakeNFT(true)
      }
    }

    console.log("begin staking the NFTs")

    const stakingContractSigner = stakingContract.connect(injectedSigner)
    const approveStakingTX = await stakingContractSigner.stake(inputValue, "0x0000")
    console.log("staking the tokens...")
    await approveStakingTX.wait()
    
    if(!approveStakingTX) {
      console.log("error staking NFTs")
    }

    console.log("NFTs staked!")
    input.value = ''
    updateUserBalances(address)
  }

  const unstakeCondorNFT = async () => {

    if(!address || !userNFTBalance || !userStakedBalance) {
      console.log("display init error msgs")
      return;
    }

    const input = document.querySelector('#inputUnstakeCondorNFT')

    if(!Number.isInteger(parseInt(input.value)) || parseInt(input.value) == 0 || input.value.length == 0) {
      console.log("display not numeric input error msgs")
      return;
    }

    const inputValue = parseInt(input.value)

    if(inputValue > parseInt(userStakedBalance)) {
      console.log("display not available NFTs error msgs")
      return;
    }

    console.log("unstaking the NFTs")

    const stakingContractSigner = stakingContract.connect(injectedSigner)
    const approveStakingTX = await stakingContractSigner.unstake(inputValue, "0x0000")
    console.log("unstaking the tokens...")
    await approveStakingTX.wait()
    
    if(!approveStakingTX) {
      console.log("error unstaking NFTs")
    }

    console.log("NFTs unstaked!")
    input.value = ''
    updateUserBalances(address)
  }

  const claimRewads = async () => {

    if(!address || !userPendingRewards) {
      console.log("display init error msgs")
      return
    }

    if(userPendingRewards == 0) {
      console.log("display not enough funds to claim error msgs")
      return
    }

    console.log("begin claiming rewards")

    const stakingSaleContractSigner = stakingContract.connect(injectedSigner)
    const approveClaimTX = await stakingSaleContractSigner.claim()
    console.log("claiming the tokens...")
    await approveClaimTX.wait()
    
    if(!approveClaimTX) {
      console.log("error claiming rewards")
    }

    console.log("rewards claimed!")
    updateUserBalances(address)
  }

  const getMaxSporePower = async () => {
    if(address && userSporeBalance) {
      document.querySelector('#inputGetSporePower').value = formatNumber(userSporeBalance)
    }
  }

  const getMaxCondorNFT = async () => {
    if(address && userSporeBalance && priceCondorNFT) {
      const maxPurchase = parseInt(formatNumber(userSporeBalance)/formatNumber(priceCondorNFT))
      document.querySelector('#inputGetCondorNFT').value = maxPurchase
    }
  }

  const getMaxStakeNFT = async () => {
    if(address && userNFTBalance) {
      document.querySelector('#inputStakeCondorNFT').value = parseInt(userNFTBalance)
    }
  }

  const getMaxUnstakeNFT = async () => {
    if(address && userStakedBalance) {
      document.querySelector('#inputUnstakeCondorNFT').value = parseInt(userStakedBalance)
    }
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
  }, [])

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
  if(sporeContract && condorContract && powerContract && stakingContract && nftContract && nftSaleContract && powerSaleContract) {
    loadDefaultValues()
  }
}, [sporeContract, condorContract, powerContract, stakingContract, nftContract, nftSaleContract, powerSaleContract]);

useEffect(() => {
  if(address) {
    updateUserBalances(address)
    console.log("address fetched from home", address)
  }
}, [address])

useEffect(() => {
  const interval = setInterval(async () => {
    if(address) {
      const pendingRewards = await stakingContract.takeWithAddress(address)
      setUserPendingRewards(formatNumber6Dec(pendingRewards))
    }
  }, 10000);
  return () => clearInterval(interval);
}, [address])


  return (
    <>
    <Head>
        <title>Condor Staking NFT UI</title>
    </Head>
    
    <Box
        as="section"
      >
        <Box as="nav" bg="bg-surface" boxShadow={useColorModeValue('sm', 'sm-dark')}>
          <Container py={{ base: '4', lg: '5'}}>

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

    <Box as="section" py={{ base: '4', md: '8'}}>
      <Container>
        <SimpleGrid columns={{ base: 1, md: 5}} gap={{ base: '5', md: '6'}}>
          <HeaderStat label='Your Spore Balance' value={userSporeBalance ? formatNumber(userSporeBalance):0} />
          <HeaderStat label='Your Power Balance' value={userPowerBalance ? formatNumber(userPowerBalance):0} />
          <HeaderStat label='Your Condor Balance' value={userCondorBalance ? formatNumber(userCondorBalance):0} />
          <HeaderStat label='Your NFT Balance' value={userNFTBalance ? parseInt(userNFTBalance):0} />
          <HeaderStat label='Your Staked NFTs' value={userStakedBalance ? parseInt(userStakedBalance):0} />
        </SimpleGrid>
      </Container>
    </Box>

    <Container>
      <Box px={{ base: '4', md: '6'}} py={{ base: '5', md: '6'}} w='100%' p={4} bg="bg-surface" borderRadius="lg" boxShadow={useColorModeValue('sm', 'sm-dark')}>
        
        <SimpleGrid columns={{ base: 1, md: 3}} gap={{ base: 5, md: 6}}>
          <Stack spacing="8" borderWidth="1px" rounded="lg" padding="8" width="full">
            <Heading size="md">Get Spore Power</Heading>
            <Stack spacing="6">
              <li>You can get as much Spore Power Tokens as you need.</li>
              <li>Spore Power Tokens have 1:1 relationship ratio with Spore Token.</li>
              <li>Spore Power Tokens can only be purchased with <a target="_blank" href="https://pancakeswap.finance/swap?inputCurrency=0x77f6a5f1b7a2b6d6c322af8581317d6bb0a52689" rel="noopener noreferrer"><strong>Spore Tokens from BSC on Pancakeswap</strong><FaExternalLinkAlt style={{display:'inline', marginLeft: '5px'}} /></a></li>
              <li>Spore Power Tokens will represent your voting power on the <a target="_blank" href="https://snapshot.org/#/spore-engineering.eth" rel="noopener noreferrer"><strong>Snapshot DAO Governance</strong><FaExternalLinkAlt style={{display:'inline', marginLeft: '5px'}} /></a></li>
              <li>All Spore Tokens from purchases will be transferred to the <a target="_blank" href="https://bscscan.com/address/0x79207f009733a9770ede24f7fd7b8e02b2a25222" rel="noopener noreferrer"><strong>Gnosis Safe DAO multisig burner wallet</strong><FaExternalLinkAlt style={{display:'inline', marginLeft: '5px'}} /></a></li>
              <li>Read more abour Spore Power on <a target="_blank" href="https://spore-eng.medium.com/govern-vote-on-protocol-proposals-without-spending-on-gas-fees-dc8ea7818d33" rel="noopener noreferrer"><strong>this Medium article</strong><FaExternalLinkAlt style={{display:'inline', marginLeft: '5px'}} /></a></li>
            </Stack>
            <Stack spacing="8" borderWidth="1px" rounded="lg" padding="8" width="full">
              <InputGroup size='md'>
                <Input pr='4.5rem' type='text' placeholder='Spore Amount' id='inputGetSporePower' />
                <InputRightElement width='4.5rem'>
                  <Button h='1.75rem' size='sm' onClick={getMaxSporePower}>
                    max
                  </Button>
                </InputRightElement>
              </InputGroup>
              <Button colorScheme='linkedin' size="lg" fontSize="md" rightIcon={<FaBolt />} onClick={getSporePower}>
                Get Spore Power
              </Button>
            </Stack>
          </Stack>

          <Stack spacing="8" borderWidth="1px" rounded="lg" padding="8" width="full">
            <Heading size="md">Get Condor NFT</Heading>
            <Stack spacing="6">
              <li>You can get as much Spore Power Tokens as you need.</li>
              <li>Spore Power Tokens have 1:1 relationship ratio with Spore Token.</li>
              <li>Spore Power Tokens can only be purchased with <a target="_blank" href="https://pancakeswap.finance/swap?inputCurrency=0x77f6a5f1b7a2b6d6c322af8581317d6bb0a52689" rel="noopener noreferrer"><strong>Spore Tokens from BSC on Pancakeswap</strong><FaExternalLinkAlt style={{display:'inline', marginLeft: '5px'}} /></a></li>
              <li>Spore Power Tokens will represent your voting power on the <a target="_blank" href="https://snapshot.org/#/spore-engineering.eth" rel="noopener noreferrer"><strong>Snapshot DAO Governance</strong><FaExternalLinkAlt style={{display:'inline', marginLeft: '5px'}} /></a></li>
              <li>All Spore Tokens from purchases will be transferred to the <a target="_blank" href="https://bscscan.com/address/0x79207f009733a9770ede24f7fd7b8e02b2a25222" rel="noopener noreferrer"><strong>Gnosis Safe DAO multisig burner wallet</strong><FaExternalLinkAlt style={{display:'inline', marginLeft: '5px'}} /></a></li>
              <li>Read more abour Spore Power on <a target="_blank" href="https://spore-eng.medium.com/govern-vote-on-protocol-proposals-without-spending-on-gas-fees-dc8ea7818d33" rel="noopener noreferrer"><strong>this Medium article</strong><FaExternalLinkAlt style={{display:'inline', marginLeft: '5px'}} /></a></li>
            </Stack>
            <Stack spacing="8" borderWidth="1px" rounded="lg" padding="8" width="full">
              <InputGroup size='md'>
                <Input pr='4.5rem' type='text' placeholder='NFT Amount' id='inputGetCondorNFT' />
                <InputRightElement width='4.5rem'>
                  <Button h='1.75rem' size='sm' onClick={getMaxCondorNFT}>
                    max
                  </Button>
                </InputRightElement>
              </InputGroup>
              <Button colorScheme='linkedin' size="lg" fontSize="md" rightIcon={<FaFeather />} onClick={getCondorNFT}>
                Get Condor NFT
              </Button>
            </Stack>
          </Stack>

          <Box>
            <Heading size={useBreakpointValue({ base: 'sm', md: 'md'})}>
              Stake Condor NFT
            </Heading>
            <Text color="muted" mt="5">
                Here you can stake your Condor NFT tokens, unstake them, and claim your rewards in Condor tokens.

                Remember that in order to stake Condor NFT tokens, you must hold Spore Power Tokens in a 5 to 1 ratio, meaning that by 5 Spore Power tokens you possess, you will be able to stake 1 Condor NFT token in the pool.
            </Text>
            <Divider my="5" />
            <Stack spacing="8" borderWidth="1px" rounded="lg" padding="8" width="full" mb='5'>
              <InputGroup size='md'>
                <Input pr='4.5rem' type='text' placeholder='NFT Amount' id='inputStakeCondorNFT' />
                <InputRightElement width='4.5rem'>
                  <Button h='1.75rem' size='sm' onClick={getMaxStakeNFT}>
                    max
                  </Button>
                </InputRightElement>
              </InputGroup>
              <Button colorScheme='linkedin' size="lg" fontSize="md" rightIcon={<FaAngleDoubleDown />} onClick={stakeCondorNFT}>
                Stake NFTs
              </Button>
            </Stack>
            <Stack spacing="8" borderWidth="1px" rounded="lg" padding="8" width="full" mb='5'>
              <InputGroup size='md'>
                <Input pr='4.5rem' type='text' placeholder='NFT Amount' id='inputUnstakeCondorNFT' />
                <InputRightElement width='4.5rem'>
                  <Button h='1.75rem' size='sm' onClick={getMaxUnstakeNFT}>
                    max
                  </Button>
                </InputRightElement>
              </InputGroup>
              <Button colorScheme='linkedin' size="lg" fontSize="md" rightIcon={<FaAngleDoubleUp />} onClick={unstakeCondorNFT}>
                Unstake NFTs
              </Button>
            </Stack>
            <Stack spacing="8" borderWidth="1px" rounded="lg" padding="8" width="full">
              <Stat>
                <StatLabel>Your Available Condor Token Rewards</StatLabel>
                <Heading size={useBreakpointValue({ base: 'sm', md: 'md'})}>
                  {userPendingRewards}
                </Heading>
              </Stat>
              <Button colorScheme='linkedin' size="lg" fontSize="md" rightIcon={<FaCoins />} onClick={claimRewads}>
                Claim Your Coins
              </Button>
            </Stack>
          </Box>
          
        </SimpleGrid>
      </Box>
    </Container>

    <Footer />
      
    </>
  )
}
