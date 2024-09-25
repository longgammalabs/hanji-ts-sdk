import React, { useContext, useState } from 'react';
import { TextField, Checkbox, FormControlLabel, Button, Typography, Box } from '@mui/material';
import { MARKET_ADDRESS } from './constants';
import { HanjiClientContext } from './clientContext';

const CalculateOrderDetails: React.FC = () => {
  const [inputTokenX, setInputTokenX] = useState('');
  const [inputTokenY, setInputTokenY] = useState('');
  const [slippage, setSlippage] = useState('');
  const [isBuy, setIsBuy] = useState(false);
  const [isMarket, setIsMarket] = useState(false);
  const [price, setPrice] = useState('');
  const [postOnly, setPostOnly] = useState(false);
  const [useAutoSlippage, setUseAutoSlippage] = useState(false);
  const [result, setResult] = useState({});
  const hanjiClient = useContext(HanjiClientContext);
  const [isFetching, setIsFetching] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    let calculatedResult;
    setIsFetching(true);
    if (isMarket) {
      calculatedResult = await hanjiClient.spot.calculateMarketDetails({
        market: MARKET_ADDRESS,
        direction: isBuy ? 'buy' : 'sell',
        inputToken: inputTokenX ? 'base' : 'quote',
        inputs: {
          tokenXInput: inputTokenX,
          tokenYInput: inputTokenY,
          slippage: Number(slippage),
          useAutoSlippage,
        },
      });
    }
    else {
      calculatedResult = await hanjiClient.spot.calculateLimitDetails({
        market: MARKET_ADDRESS,
        direction: isBuy ? 'buy' : 'sell',
        inputToken: inputTokenX ? 'base' : 'quote',
        inputs: {
          tokenXInput: inputTokenX,
          tokenYInput: inputTokenY,
          priceInput: price,
          postOnly: postOnly,
        },
      });
    }
    setResult(calculatedResult);
    setIsFetching(false);
  };

  return (
    <>
      <Typography variant="h6" component="h3" gutterBottom>
        Calculate Order Detail
      </Typography>
      <form onSubmit={handleSubmit}>
        <div>
          <FormControlLabel
            control={(
              <Checkbox
                checked={isMarket}
                onChange={e => setIsMarket(e.target.checked)}
              />
            )}
            label="Is Market"
          />
        </div>
        <div>
          <FormControlLabel
            control={(
              <Checkbox
                checked={isBuy}
                onChange={e => setIsBuy(e.target.checked)}
              />
            )}
            label="Is Buy"
          />
        </div>
        <div>
          <TextField
            label="Input Token X"
            value={inputTokenX}
            onChange={e => setInputTokenX(e.target.value)}
            fullWidth
            margin="normal"
          />
        </div>
        <div>
          <TextField
            label="Input Token Y"
            value={inputTokenY}
            onChange={e => setInputTokenY(e.target.value)}
            fullWidth
            margin="normal"
          />
        </div>
        <div>
          <TextField
            label="Slippage"
            value={slippage}
            onChange={e => setSlippage(e.target.value)}
            fullWidth
            margin="normal"
          />
        </div>
        <div>
          <TextField
            label="Price"
            value={price}
            onChange={e => setPrice(e.target.value)}
            fullWidth
            margin="normal"
          />
        </div>
        <div>
          <FormControlLabel
            control={(
              <Checkbox
                checked={postOnly}
                onChange={e => setPostOnly(e.target.checked)}
              />
            )}
            label="Post Only"
          />
        </div>
        <div>
          <FormControlLabel
            control={(
              <Checkbox
                checked={useAutoSlippage}
                onChange={e => setUseAutoSlippage(e.target.checked)}
              />
            )}
            label="Auto Slippage"
          />
        </div>
        <Button type="submit" variant="contained" color="primary" disabled={isFetching}>
          Submit
        </Button>
        <Box textAlign="left">
          <Typography variant="h6">Result:</Typography>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </Box>
      </form>
    </>
  );
};

export default CalculateOrderDetails;
