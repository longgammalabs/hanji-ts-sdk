import React, { useContext, useState } from 'react';
import { TextField, Button, Container, Typography, FormControlLabel, Checkbox } from '@mui/material';
import { HanjiClientContext } from './clientContext';
import BigNumber from 'bignumber.js';
import { MARKET_ADDRESS } from './constants';

export const PlaceOrder: React.FC = () => {
  const [size, setSize] = useState('');
  const [price, setPrice] = useState('');
  const [isAsk, setIsAsk] = useState(false);
  const [isMarket, setIsMarket] = useState(false);
  const hanjiClient = useContext(HanjiClientContext);
  const [isFetching, setIsFetching] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Placing order:', { size, price, isAsk, isMarket });
    setIsFetching(true);
    try {
      const response = await hanjiClient.spot.placeOrder({
        market: MARKET_ADDRESS,
        type: isMarket ? 'market' : 'limit',
        side: isAsk ? 'ask' : 'bid',
        size: BigNumber(size),
        price: BigNumber(price),
      });
      console.log('Order placed', response);
    }
    catch (error) {
      console.error('Error fetching placing order:', error);
    }
    finally {
      setIsFetching(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h6" component="h3" gutterBottom>
        Place Order
      </Typography>
      <form onSubmit={handleSubmit}>
        <div>
          <TextField
            label="Size"
            variant="outlined"
            fullWidth
            margin="normal"
            value={size}
            onChange={e => setSize(e.target.value)}
          />
        </div>
        <div>
          <TextField
            label="Price"
            variant="outlined"
            fullWidth
            margin="normal"
            value={price}
            onChange={e => setPrice(e.target.value)}
          />
        </div>
        <FormControlLabel
          control={<Checkbox checked={isAsk} onChange={e => setIsAsk(e.target.checked)} />}
          label="Is Ask"
        />
        <FormControlLabel
          control={<Checkbox checked={isMarket} onChange={e => setIsMarket(e.target.checked)} />}
          label="Is Market"
        />
        <Button type="submit" variant="contained" color="primary" disabled={isFetching}>
          Place Order
        </Button>
      </form>
    </Container>
  );
};

export default PlaceOrder;
