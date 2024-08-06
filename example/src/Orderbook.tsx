import React, { useContext, useState } from 'react';
import { Button, Container, Typography, Box } from '@mui/material';
import { HanjiClientContext } from './clientContext';
import { MARKET_ADDRESS } from './constants';
import { type Orderbook as OrderbookType } from 'hanji-ts-sdk';

export const Orderbook: React.FC = () => {
  const [orderbookData, setOrderbookData] = useState<OrderbookType | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const hanjiClient = useContext(HanjiClientContext);

  const fetchOrderbookData = async () => {
    try {
      setIsFetching(true);
      const data = await hanjiClient.spot.getOrderbook({
        market: MARKET_ADDRESS,
        limit: 3,
      });
      setOrderbookData(data);
      setIsFetching(false);
    }
    catch (error) {
      console.error('Error fetching orderbook data:', error);
    }
  };

  return (
    <Container>
      <Typography variant="h6" component="h3" gutterBottom>
        Orderbook
      </Typography>
      <Button variant="contained" color="primary" onClick={fetchOrderbookData} disabled={isFetching}>
        Fetch Orderbook Data
      </Button>
      {orderbookData && (
        <Box mt={2} mb={2} textAlign="left">
          <Typography variant="body1" component="pre">
            {JSON.stringify(orderbookData, (_key, value) =>
              typeof value === 'bigint'
                ? value.toString()
                : value, 2)}
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default Orderbook;
