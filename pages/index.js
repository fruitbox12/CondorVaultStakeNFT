import { Footer } from '../components/Footer'
import { Navbar } from '../components/Navbar'
import { Stats } from '../components/Stats'

import Head from 'next/head'

import { 
  Box, 
  Container, 
  useColorModeValue, 
  SimpleGrid, 
  Stack, 
  Heading, 
  useBreakpointValue, 
  Text } from '@chakra-ui/react'

  import { CartOrderSummary } from '../components/CartOrderSummary'
import { MainContent } from '../components/MainContent'
import { CartPurchaseNft } from '../components/CartPurchaseNft'

export default function Home() {
  return (
    <>
    <Head>
        <title>Dapp</title>
    </Head>
    <Navbar />
    <Stats />

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
