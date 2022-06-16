import {
    Button,
    Flex,
    Heading,
    InputGroup,
    InputRightElement,
    Input,
    Stack,
    Text,
    useColorModeValue as mode,
  } from '@chakra-ui/react'
  import * as React from 'react'
  import { FaExternalLinkAlt, FaBolt } from 'react-icons/fa'
  
  const OrderSummaryItem = (props) => {
    const { label, value, children } = props

    return (
      <Flex justify="space-between" fontSize="sm">
        <Text fontWeight="medium" color={mode('gray.600', 'gray.400')}>
          {label}
        </Text>
        {value ? <Text fontWeight="medium">{value}</Text> : children}
      </Flex>
    )
  }

  
  
  export const CartOrderSummary = () => {
    return (
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
            <Input
              pr='4.5rem'
              type='text'
              placeholder='Spore Amount'
            />
            <InputRightElement width='4.5rem'>
              <Button h='1.75rem' size='sm'>
                max
              </Button>
            </InputRightElement>
          </InputGroup>
       
          <Button colorScheme='linkedin' size="lg" fontSize="md" rightIcon={<FaBolt />}>
            Get Spore Power
          </Button>
        </Stack>
      </Stack>
    )
  }