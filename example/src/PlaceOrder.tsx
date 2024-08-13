import React, { useContext, useState } from 'react';
import { TextField, Button, Container, Typography, FormControlLabel, Checkbox } from '@mui/material';
import { HanjiClientContext } from './clientContext';
import BigNumber from 'bignumber.js';
import { MARKET_ADDRESS } from './constants';
import { HanjiClient } from '../../dist/types';

async function fetchMaxCommission(hanjiClient: HanjiClient, isMarket: boolean, isAsk: boolean, size: string, price: string): Promise<BigNumber> {
  let maxCommission;
  const inputs: any = {};
  if (isAsk)
    inputs.tokenXInput = size;
  else
    inputs.tokenYInput = size;
  if (isMarket) {
    inputs.slippage = 1;
    const marketDetails = await hanjiClient.spot.calculateMarketDetails({
      market: MARKET_ADDRESS,
      direction: isAsk ? 'sell' : 'buy',
      inputToken: isAsk ? 'base' : 'quote',
      inputs,
    });
    maxCommission = BigNumber(isAsk ? marketDetails.sell.fee : marketDetails.buy.fee);
  }
  else {
    inputs.priceInput = price.toString();
    inputs.postOnly = false;
    const limitDetails = await hanjiClient.spot.calculateLimitDetails({
      market: MARKET_ADDRESS,
      direction: isAsk ? 'sell' : 'buy',
      inputToken: isAsk ? 'base' : 'quote',
      inputs,
    });
    maxCommission = BigNumber(isAsk ? limitDetails.sell.maxFee : limitDetails.buy.maxFee);
  }
  return maxCommission;
}

export const PlaceOrder: React.FC = () => {
  const [size, setSize] = useState('');
  const [price, setPrice] = useState('');
  const [permitValue, setPermitValue] = useState('');
  const [isAsk, setIsAsk] = useState(false);
  const [isMarket, setIsMarket] = useState(false);
  const [useNativeToken, setUseNativeToken] = useState(false);
  const hanjiClient = useContext(HanjiClientContext);
  const [isFetching, setIsFetching] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Placing order:', { size, price, isAsk, isMarket });
    setIsFetching(true);
    try {
      const maxCommission = await fetchMaxCommission(hanjiClient, isMarket, isAsk, size, price);
      const response = await hanjiClient.spot.placeOrder({
        market: MARKET_ADDRESS,
        type: isMarket ? 'market' : 'limit',
        side: isAsk ? 'ask' : 'bid',
        size: BigNumber(size),
        price: BigNumber(price),
        maxCommission,
        useNativeToken,
        quantityToSend: isAsk && useNativeToken ? BigNumber(size) : 0n,
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

  const handlePlaceOrderWithPermit = async (event: React.MouseEvent) => {
    event.preventDefault();
    console.log('Placing order with permit:', { size, price, isAsk, isMarket, permitValue });
    setIsFetching(true);
    try {
      const maxCommission = await fetchMaxCommission(hanjiClient, isMarket, isAsk, size, price);
      const response = await hanjiClient.spot.placeOrderWithPermit({
        market: MARKET_ADDRESS,
        type: isMarket ? 'market' : 'limit',
        side: isAsk ? 'ask' : 'bid',
        size: BigNumber(size),
        price: BigNumber(price),
        permit: BigNumber(permitValue),
        maxCommission,
      });

      console.log('Order with permit placed', response);
      return;
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
        <FormControlLabel
          control={<Checkbox checked={useNativeToken} onChange={e => setUseNativeToken(e.target.checked)} />}
          label="Use Native Token"
        />
        <Button type="submit" variant="contained" color="primary" name="submitType" value="placeOrder" disabled={isFetching}>
          Place Order
        </Button>
        <div>
          <TextField
            label="Permit"
            variant="outlined"
            fullWidth
            margin="normal"
            value={permitValue}
            onChange={e => setPermitValue(e.target.value)}
          />
        </div>
        <Button type="button" onClick={handlePlaceOrderWithPermit} variant="contained" color="primary" name="submitType" value="placeOrderWithPermit" disabled={isFetching}>
          Place Order With Permit
        </Button>
      </form>
    </Container>
  );
};

export default PlaceOrder;
