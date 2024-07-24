import { useState } from 'react';
import './App.css';
import { WalletConnect } from './WalletConnect';
import { PlaceOrder } from './PlaceOrder';
import { Orderbook } from './Orderbook';
import { Box, Divider, Typography } from '@mui/material';
import UserOrdersUpdates from './UserOrdersUpdates';
import { ClientAddressContext, HanjiClientContext, defaultHanjiClient } from './clientContext';
import ApproveToken from './ApproveToken';
import OrderbookUpdates from './OrderbookUpdates';

function App() {
  const [address, setAddress] = useState<string>('');

  return (
    <HanjiClientContext.Provider value={defaultHanjiClient}>
      <ClientAddressContext.Provider value={address}>
        <WalletConnect setAddress={(address: string) => setAddress(address)} />
        <Box display="grid" gridTemplateColumns="1fr 1fr 1fr" gap={2}>
          <Box p={1} sx={{ gridColumn: '1 / 2' }}>
            <Typography variant="h6">Contract API</Typography>
            <Divider />
            {
              address !== ''
                ? (
                  <>
                    <ApproveToken />
                    <Divider />
                    <PlaceOrder />
                  </>
                )
                : (
                  <Typography variant="h6">Connect Wallet</Typography>
                )
            }
          </Box>
          <Box p={1} sx={{ gridColumn: '2 / 3' }}>
            <Typography variant="h6">HTTP API</Typography>
            <Divider />
            <Orderbook />
          </Box>
          <Box p={1} sx={{ gridColumn: '3 / 4' }}>
            <Typography variant="h6">WebSocket</Typography>
            <Divider />
            <UserOrdersUpdates />
            <Divider />
            <OrderbookUpdates />
          </Box>
        </Box>
      </ClientAddressContext.Provider>
    </HanjiClientContext.Provider>
  );
}

export default App;
