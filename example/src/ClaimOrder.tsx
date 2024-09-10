import React, { useContext, useState } from 'react';
import { TextField, Button, Container, Typography, FormControlLabel, Checkbox } from '@mui/material';
import { HanjiClientContext } from './clientContext';
import { MARKET_ADDRESS } from './constants';

export const ClaimOrder: React.FC = () => {
  const [orderId, setOrderId] = useState('');
  const [isOnlyClaim, setIsOnlyClaim] = useState(true);
  const hanjiClient = useContext(HanjiClientContext);
  const [isFetching, setIsFetching] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Claiming order:', { orderId, MARKET_ADDRESS, isOnlyClaim });
    setIsFetching(true);
    try {
      const response = await hanjiClient.spot.claimOrder({
        market: MARKET_ADDRESS,
        orderId: orderId,
        transferExecutedTokens: true,
        onlyClaim: isOnlyClaim,
      });
      console.log('Order placed', response);
    }
    catch (error) {
      console.error('Error fetching claiming order:', error);
    }
    finally {
      setIsFetching(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h6" component="h3" gutterBottom>
        Claim Order
      </Typography>

      <form onSubmit={handleSubmit}>
        <div>
          <TextField
            label="Order ID"
            variant="outlined"
            fullWidth
            margin="normal"
            value={orderId}
            onChange={e => setOrderId(e.target.value)}
          />
        </div>
        <FormControlLabel
          control={<Checkbox checked={isOnlyClaim} onChange={e => setIsOnlyClaim(e.target.checked)} />}
          label="Is Only Claim"
        />
        <Button type="submit" variant="contained" color="primary" name="submitType" value="placeOrder" disabled={isFetching}>
          Claim Order
        </Button>
      </form>
    </Container>
  );
};

export default ClaimOrder;
