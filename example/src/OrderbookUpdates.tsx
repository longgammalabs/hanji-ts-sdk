import React, { useState, useEffect, useContext } from 'react';
import { Button, Container, Typography, Box } from '@mui/material';
import { HanjiClientContext } from './clientContext';
import { MARKET_ADDRESS } from './constants';
import { OrderbookUpdate } from 'hanji-ts-sdk';

export const OrderbookUpdates: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const hanjiClient = useContext(HanjiClientContext);

  function onOrderbookUpdateed(_marketId: string, data: OrderbookUpdate) {
    setEvents(prevEvents => [...prevEvents, data]);
  }

  useEffect(() => {
    hanjiClient.spot.events.orderbookUpdated.addListener(onOrderbookUpdateed);

    return () => {
      hanjiClient.spot.events.orderbookUpdated.removeListener(onOrderbookUpdateed);
    };
  }, []);

  const handleSubscribe = () => {
    setIsSubscribed(prev => !prev);
    if (!isSubscribed) {
      hanjiClient.spot.subscribeToOrderbook({
        market: MARKET_ADDRESS,
        aggregation: 2,
      });
    }
    else {
      hanjiClient.spot.unsubscribeFromOrderbook({
        market: MARKET_ADDRESS,
        aggregation: 2,
      });
    }
  };

  return (
    <Container>
      <Typography variant="h6" component="h3" gutterBottom>
        Orderbook Updates
      </Typography>
      <Button variant="contained" color="primary" onClick={handleSubscribe}>
        {isSubscribed ? 'Unsubscribe' : 'Subscribe'}
      </Button>
      <Box mt={2} textAlign="left">
        <Typography variant="body1" component="pre">
          {JSON.stringify(events, (_key, value) =>
            typeof value === 'bigint'
              ? value.toString()
              : value, 2)}
        </Typography>
      </Box>
    </Container>
  );
};

export default OrderbookUpdates;
