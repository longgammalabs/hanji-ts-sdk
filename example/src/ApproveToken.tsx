import React, { useContext, useState } from 'react';
import {
  Box,
  Checkbox,
  FormControlLabel,
  TextField,
  Button,
  Typography
} from '@mui/material';
import { HanjiClientContext } from './clientContext';
import { MARKET_ADDRESS } from './constants';

export const ApproveToken: React.FC = () => {
  const [isBaseToken, setIsBaseToken] = useState(false);
  const [amount, setAmount] = useState('');
  const hanjiClient = useContext(HanjiClientContext);
  const [isFetching, setIsFetching] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsFetching(true);
    try {
      const approveToken = await hanjiClient.spot.approveTokens({
        market: MARKET_ADDRESS,
        isBaseToken,
        amount: BigInt(amount),
      });
      console.log('Approve Token:', approveToken);
    }
    catch (error) {
      console.error('Error approving token:', error);
    }
    finally {
      setIsFetching(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ '& > :not(style)': { m: 1 } }}>
      <Typography variant="h6">Approve Token</Typography>
      <FormControlLabel
        control={(
          <Checkbox
            checked={isBaseToken}
            onChange={e => setIsBaseToken(e.target.checked)}
            name="isBaseToken"
          />
        )}
        label="Is Base Token"
      />
      <TextField
        fullWidth
        label="Raw Amount"
        variant="outlined"
        value={amount}
        onChange={e => setAmount(e.target.value)}
        placeholder="Enter amount"
      />
      <Button type="submit" variant="contained" color="primary" disabled={isFetching}>
        Approve Token
      </Button>
    </Box>
  );
};

export default ApproveToken;
