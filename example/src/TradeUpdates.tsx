import React, { useState, useEffect, useContext } from 'react';
import { Button, Container, Typography, Box } from '@mui/material';
import { HanjiClientContext } from './clientContext';
import { MARKET_ADDRESS } from './constants';
import { TradeUpdate } from 'hanji-ts-sdk';

export const TradeUpdates: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const hanjiClient = useContext(HanjiClientContext);

  function onTradesUpdateed(_marketId: string, _isSnapshot: boolean, data: TradeUpdate[]) {
    setEvents(prevEvents => [...prevEvents, data]);
  }

  useEffect(() => {
    hanjiClient.spot.events.tradesUpdated.addListener(onTradesUpdateed);

    return () => {
      hanjiClient.spot.events.tradesUpdated.removeListener(onTradesUpdateed);
    };
  }, []);

  const handleSubscribe = () => {
    setIsSubscribed(prev => !prev);
    if (!isSubscribed) {
      hanjiClient.spot.subscribeToTrades({
        market: MARKET_ADDRESS,
      });
    }
    else {
      hanjiClient.spot.unsubscribeFromTrades({
        market: MARKET_ADDRESS,
      });
    }
  };

  return (
    <Container>
      <Typography variant="h6" component="h3" gutterBottom>
        Trades Updates
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

export default TradeUpdates;
