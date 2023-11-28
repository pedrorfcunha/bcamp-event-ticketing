/// <reference types="react-scripts" />
import { ExternalProvider } from '@ethersproject/providers';
import { BrowserProvider, Eip1193Provider } from 'ethers';

declare global {
  interface Window {
    ethereum?: ExternalProvider;
  }
}
