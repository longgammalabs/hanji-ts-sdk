import React, { useContext, useState } from 'react';
import { Button, Container, Typography, Box } from '@mui/material';
import { ClientAddressContext, HanjiClientContext } from './clientContext';
import { type UserBalances as UserBalancesType } from 'hanji-ts-sdk';

export const UserBalances: React.FC = () => {
  const [balancesData, setBalancesData] = useState<UserBalancesType | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const hanjiClient = useContext(HanjiClientContext);
  const address = useContext(ClientAddressContext);

  const fetchBalancesData = async () => {
    if (!address) {
      alert('Please connect your wallet first');
      return;
    }
    try {
      setIsFetching(true);
      const data = await hanjiClient.spot.getUserBalances({
        user: address,
      });
      setBalancesData(data);
      setIsFetching(false);
    }
    catch (error) {
      console.error('Error fetching orderbook data:', error);
    }
  };

  return (
    <Container>
      <Typography variant="h6" component="h3" gutterBottom>
        User Balances
      </Typography>
      <Button variant="contained" color="primary" onClick={fetchBalancesData} disabled={isFetching}>
        Fetch User Balances Data
      </Button>
      {balancesData && (
        <Box mt={2} mb={2} textAlign="left">
          <Typography variant="body1" component="pre">
            {JSON.stringify(balancesData, (_key, value) =>
              typeof value === 'bigint'
                ? value.toString()
                : value, 2)}
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default UserBalances;
