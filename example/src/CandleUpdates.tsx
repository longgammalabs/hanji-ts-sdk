import React, { useState, useEffect, useContext } from 'react';
import { Button, Container, Typography, Box } from '@mui/material';
import { HanjiClientContext } from './clientContext';
import { MARKET_ADDRESS } from './constants';
import { CandleUpdate } from 'hanji-ts-sdk';

export const CandleUpdates: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const hanjiClient = useContext(HanjiClientContext);

  function onCandleUpdated(_marketId: string, _isSnapshot: boolean, data: CandleUpdate) {
    setEvents(prevEvents => [...prevEvents, data]);
  }

  useEffect(() => {
    hanjiClient.spot.events.candlesUpdated.addListener(onCandleUpdated);

    return () => {
      hanjiClient.spot.events.candlesUpdated.removeListener(onCandleUpdated);
    };
  }, []);

  const handleSubscribe = () => {
    setIsSubscribed(prev => !prev);
    if (!isSubscribed) {
      hanjiClient.spot.subscribeToCandles({
        market: MARKET_ADDRESS,
        resolution: '60',
      });
    }
    else {
      hanjiClient.spot.unsubscribeFromCandles({
        market: MARKET_ADDRESS,
        resolution: '60',
      });
    }
  };

  return (
    <Container>
      <Typography variant="h6" component="h3" gutterBottom>
        Candles Updates
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

export default CandleUpdates;
