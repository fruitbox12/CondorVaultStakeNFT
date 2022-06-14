import { Box, Container, SimpleGrid } from '@chakra-ui/react'
import * as React from 'react'
import { Stat } from './Stat'
const stats = [
  {
    label: 'Your Spore Balance',
    value: '755.99',
  },
  {
    label: 'Your Power Balance',
    value: '33.85',
  },
  {
    label: 'Your NFT Balance',
    value: '3',
  },
  {
    label: 'Your Staked NFTs',
    value: '30',
  },
  {
    label: 'Total Staked NFTs',
    value: '550',
  },
]

export const Stats = () => (
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
        {stats.map(({ label, value }) => (
          <Stat key={label} label={label} value={value} />
        ))}
      </SimpleGrid>
    </Container>
  </Box>
)