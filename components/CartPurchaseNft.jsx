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
  import { FaFeather, FaExternalLinkAlt } from 'react-icons/fa'
  
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
  
  export const CartPurchaseNft = () => {
    return (
      <Stack spacing="8" borderWidth="1px" rounded="lg" padding="8" width="full">
        <Heading size="md">Get Condor NFT</Heading>
  
        <Stack spacing="6">
         
        <li>You can get as much Spore Power Tokens as you need.</li>
          <li>Spore Power Tokens have 1:1 relationship ratio with Spore Token.</li>
          <li>Spore Power Tokens can only be purchased with <a target="_blank" href="https://pancakeswap.finance/swap?inputCurrency=0x77f6a5f1b7a2b6d6c322af8581317d6bb0a52689" rel="noopener noreferrer"><strong>Spore Tokens from BSC on Pancakeswap</strong><FaExternalLinkAlt style={{display:'inline', marginLeft: '5px'}} /></a></li>
        </Stack>
        <Stack spacing="8" borderWidth="1px" rounded="lg" padding="8" width="full">
        
          <InputGroup size='md'>
            <Input
              pr='4.5rem'
              type='text'
              placeholder='NFT Amount'
            />
            <InputRightElement width='4.5rem'>
              <Button h='1.75rem' size='sm'>
                max
              </Button>
            </InputRightElement>
          </InputGroup>
       
          <Button colorScheme='linkedin' size="lg" fontSize="md" rightIcon={<FaFeather />}>
            Get Condor NFT
          </Button>
        </Stack>
      </Stack>
    )
  }