
  import { 
    Box, 
    Container, 
    useColorModeValue, 
    SimpleGrid, 
    Stack,
    Flex, 
    Divider,
    Heading, 
    useBreakpointValue, 
    Text } from '@chakra-ui/react'
  
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
        
      </Box>
    )
  }