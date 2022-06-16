import * as React from 'react'

import {
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
  StatNumber,
  StatHelpText,
  useBreakpointValue,
  useColorModeValue as mode,
} from '@chakra-ui/react'

import { FaAngleDoubleDown, FaAngleDoubleUp, FaCoins } from 'react-icons/fa'

  export const MainContent = () => {
    return (
        <Box>
            <Heading
                size={useBreakpointValue({
                    base: 'sm',
                    md: 'md',
                })}
                >
                Stake Condor NFT
            </Heading>
        <Text color="muted" mt="5">
            Here you can stake your Condor NFT tokens, unstake them, and claim your rewards in Condor tokens.

            Remember that in order to stake Condor NFT tokens, you must hold Spore Power Tokens in a 5 to 1 ratio, meaning that by 5 Spore Power tokens you possess, you will be able to stake 1 Condor NFT token in the pool.
        </Text>
        <Divider my="5" />

        <Stack spacing="8" borderWidth="1px" rounded="lg" padding="8" width="full" mb='5'>
        
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
       
          <Button colorScheme='linkedin' size="lg" fontSize="md" rightIcon={<FaAngleDoubleDown />}>
            Stake NFTs
          </Button>
        </Stack>

        <Stack spacing="8" borderWidth="1px" rounded="lg" padding="8" width="full" mb='5'>
        
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
       
          <Button colorScheme='linkedin' size="lg" fontSize="md" rightIcon={<FaAngleDoubleUp />}>
            Unstake NFTs
          </Button>
        </Stack>

        <Stack spacing="8" borderWidth="1px" rounded="lg" padding="8" width="full">
        
        <Stat>
          <StatLabel>Your Available Condor Token Rewards</StatLabel>
          <Heading
          size={useBreakpointValue({
            base: 'sm',
            md: 'md',
          })}
        >
          1200.000000
        </Heading>
        </Stat>
       
          <Button colorScheme='linkedin' size="lg" fontSize="md" rightIcon={<FaCoins />}>
            Claim Your Coins
          </Button>
        </Stack>
        
      </Box>
    )
  }