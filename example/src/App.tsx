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
import AllMarketsUpdates from './AllMarketUpdates';
import CalculateOrderDetails from './CalculateOrderDetails';
import CandleUpdates from './CandleUpdates';
import UserBalances from './UserBalances';
import UserOrderHistoryUpdates from './UserOrderHistoryUpdates';
import ClaimOrder from './ClaimOrder';
import TradeUpdates from './TradeUpdates';
import Timetx from './Timetx';

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
                    <Timetx />
                    <Divider />
                    <ApproveToken />
                    <Divider />
                    <PlaceOrder />
                    <Divider />
                    <ClaimOrder />
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
            <Divider />
            <UserBalances />
            <Divider />
            <CalculateOrderDetails />
          </Box>
          <Box p={1} sx={{ gridColumn: '3 / 4' }}>
            <Typography variant="h6">WebSocket</Typography>
            <Divider />
            <UserOrdersUpdates />
            <Divider />
            <UserOrderHistoryUpdates />
            <Divider />
            <OrderbookUpdates />
            <Divider />
            <TradeUpdates />
            <Divider />
            <AllMarketsUpdates />
            <Divider />
            <CandleUpdates />
          </Box>
        </Box>
      </ClientAddressContext.Provider>
    </HanjiClientContext.Provider>
  );
}

export default App;
