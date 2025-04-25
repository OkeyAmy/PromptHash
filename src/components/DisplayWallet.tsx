"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ethers } from "ethers";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import {
  LogOut,
  Loader2,
  Wallet,
  Copy,
  ExternalLink,
  AlertCircle,
  X,
} from "lucide-react";

declare global {
  interface Window {
    ethereum?: any;
  }
}

const DisplayWallet = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Add useEffect for auto-connection
  useEffect(() => {
    // Check if wallet was previously connected
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });
          if (accounts.length > 0) {
            // Auto connect if accounts exist
            connect();
          }
        } catch (err) {
          console.error("Failed to check wallet connection:", err);
        }
      }
    };

    checkConnection();
  }, []); // Empty dependency array means this runs once on mount

  // Add event listener for account changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
        } else {
          setAccount(null);
          setIsConnected(false);
        }
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", () => {});
      }
    };
  }, []);

  const connect = async () => {
    if (!window.ethereum) {
      setError("MetaMask not installed");
      return;
    }

    setIsLoading(true);
    try {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: "0x128",
            chainName: "Hedera Testnet (Hashio)",
            nativeCurrency: {
              name: "HBAR",
              symbol: "HBAR",
              decimals: 18,
            },
            rpcUrls: ["https://testnet.hashio.io/api"],
            blockExplorerUrls: ["https://hashscan.io/testnet"],
          },
        ],
      });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const network = await provider.getNetwork();
      console.log("Connected Network:", Number(network.chainId));
      const address = await signer.getAddress();
      setAccount(address);
      setIsConnected(true);

      // Make POST request to register user
      try {
        const response = await fetch("/api/user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            walletAddress: address,
          }),
        });

        const data = await response.json();
        console.log("User registration response:", data);

        if (!response.ok) {
          throw new Error(data.error || "Failed to register user");
        }
      } catch (apiError: any) {
        console.error("API Error:", apiError);
        setError(apiError.message);
      }

      setError(null);
    } catch (err: any) {
      setError(err.message || "Wallet connection failed");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = () => {
    setAccount(null);
    setIsConnected(false);
  };

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  const copyAddress = () => {
    if (account) {
      navigator.clipboard.writeText(account);
    }
  };

  const viewInExplorer = () => {
    if (account) {
      window.open(`https://hashscan.io/testnet/account/${account}`, "_blank");
    }
  };
  return (
    <div>
      {/* Wallet Display - Both Mobile and Desktop */}
      {isConnected && account ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="ml-auto font-bold border-purple-900 text-purple-900 hover:text-purple-300 hover:border-purple-800"
            >
              <Wallet className="md:mr-2 h-4 w-4" />
              <span className="hidden lg:inline">{formatAddress(account)}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-gray-900 text-white border-gray-800">
            <DropdownMenuLabel className="flex items-center">
              <span className="md:hidden font-mono text-purple-400">
                {formatAddress(account)}
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-800" />
            <DropdownMenuItem
              onClick={copyAddress}
              className="flex cursor-pointer items-center hover:bg-gray-800"
            >
              <Copy className="mr-2 h-4 w-4" />
              <span>Copy Address</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={viewInExplorer}
              className="flex cursor-pointer items-center hover:bg-gray-800"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              <span>View in Explorer</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gray-800" />
            <DropdownMenuItem
              onClick={disconnect}
              className="flex cursor-pointer items-center text-red-400 hover:bg-gray-800 hover:text-red-300"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Disconnect</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button
          variant="outline"
          className="ml-auto font-bold border-purple-900 text-purple-800 hover:text-purple-300 hover:border-purple-800"
          onClick={connect}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Wallet className="md:mr-2 h-4 w-4" />
          )}
          <span className="hidden md:inline">
            {isLoading ? "Connecting..." : "Connect Wallet"}
          </span>
        </Button>
      )}
      {/* Error Display */}
      {error && (
        <div className="container py-2">
          <div className="bg-red-900/60 text-red-200 text-sm px-4 py-2 rounded-md flex justify-between items-center">
            <div className="flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              {error}
            </div>
            <button
              title="Close"
              onClick={() => setError(null)}
              className="text-red-200 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisplayWallet;
