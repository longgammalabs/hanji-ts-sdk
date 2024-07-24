import React, { useState, useEffect, useContext } from 'react';
import { Button, Container, Typography, Box } from '@mui/material';
import { ClientAddressContext, HanjiClientContext } from './clientContext';
import { MARKET_ADDRESS } from './constants';
import { type Order } from 'hanji-ts-sdk';

export const UserOrdersUpdates: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const hanjiClient = useContext(HanjiClientContext);
  const address = useContext(ClientAddressContext);

  function onUserOrdersUpdated(_marketId: string, data: Order[]) {
    setEvents(prevEvents => [...prevEvents, ...data]);
  }

  useEffect(() => {
    hanjiClient.spot.events.userOrdersUpdated.addListener(onUserOrdersUpdated);

    return () => {
      hanjiClient.spot.events.userOrdersUpdated.removeListener(onUserOrdersUpdated);
    };
  }, []);

  const handleSubscribe = () => {
    if (!address) {
      alert('Please connect your wallet first');
      return;
    }
    setIsSubscribed(prev => !prev);
    if (!isSubscribed) {
      hanjiClient.spot.subscribeToUserOrders({
        market: MARKET_ADDRESS,
        user: address,
      });
    }
    else {
      hanjiClient.spot.unsubscribeFromUserOrders({
        market: MARKET_ADDRESS,
        user: address,
      });
    }
  };

  return (
    <Container>
      <Typography variant="h6" component="h3" gutterBottom>
        User Orders Updates
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

export default UserOrdersUpdates;
