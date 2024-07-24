import React, { useContext, useState } from 'react';
import { ethers } from 'ethers';
import { MetaMaskInpageProvider } from '@metamask/providers';
import { ClientAddressContext, HanjiClientContext } from './clientContext';

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }
}
export const WalletConnect = ({ setAddress }: { setAddress: (address: string) => void }) => {
  const [connected, setConnected] = useState(false);
  const hanjiClient = useContext(HanjiClientContext);
  const walletAddress = useContext(ClientAddressContext);
  const connectWallet = async () => {
    if ((window as any).ethereum) {
      try {
        let signer = null;

        let provider;
        if (window.ethereum == null) {
          alert('MetaMask not installed; using read-only defaults');
        }
        else {
          provider = new ethers.BrowserProvider(window.ethereum);
          signer = await provider.getSigner();
          hanjiClient.setSignerOrProvider(signer);
          const address = await signer.getAddress();
          setAddress(address);
          setConnected(true);
        }
      }
      catch (error) {
        console.error('Error connecting to wallet:', error);
      }
    }
    else {
      alert('Please install MetaMask!');
    }
  };

  return (
    <div>
      <button onClick={connectWallet} disabled={connected}>
        {connected ? 'Connected' : 'Connect Wallet'}
      </button>
      {connected && (
        <div>
          Wallet Address:
          {walletAddress}
        </div>
      )}
    </div>
  );
};

export default WalletConnect;
