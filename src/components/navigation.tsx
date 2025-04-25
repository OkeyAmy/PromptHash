"use client";

declare global {
  interface Window {
    ethereum?: any;
  }
}

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import {
  Menu,
  LogOut,
  Loader2,
  Search,
  ShoppingCart,
  Settings,
  User,
  MessageCircle,
  Wallet,
  Copy,
  ExternalLink,
  AlertCircle,
  X,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { TooltipProvider } from "./ui/tooltip";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

export function Navigation() {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-gray-950/95 backdrop-blur supports-[backdrop-filter]:bg-gray-950/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Image
              src="/images/logo.png"
              alt="PromptHash Logo"
              width={32}
              height={32}
              className="object-contain"
            />
            <span className="hidden font-bold sm:inline-block text-purple-400">
              PromptHash
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/browse"
              className="transition-colors hover:text-gray-300 text-white flex items-center gap-1"
            >
              <Search className="h-4 w-4" />
              <span>Browse</span>
            </Link>
            <Link
              href="/sell"
              className="transition-colors hover:text-gray-300 text-white flex items-center gap-1"
            >
              <ShoppingCart className="h-4 w-4" />
              <span>Sell</span>
            </Link>
            <Link
              href="/governance"
              className="transition-colors hover:text-gray-300 text-white flex items-center gap-1"
            >
              <Settings className="h-4 w-4" />
              <span>Governance</span>
            </Link>
            <Link
              href="/profile"
              className="transition-colors hover:text-gray-300 text-white flex items-center gap-1"
            >
              <User className="h-4 w-4" />
              <span>Profile</span>
            </Link>
            <Link
              href="/chat"
              className="transition-colors hover:text-gray-300 text-white flex items-center gap-1"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Chat</span>
            </Link>
          </nav>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="mr-2 px-0 text-base hover:bg-transparent focus-visible:ring-0 md:hidden"
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0 bg-gray-900 text-white">
            <nav className="grid gap-6 px-2 py-6">
              <Link
                href="/browse"
                className="hover:text-gray-300 flex items-center gap-2"
              >
                <Search className="h-4 w-4" />
                <span>Browse</span>
              </Link>
              <Link
                href="/sell"
                className="hover:text-gray-300 flex items-center gap-2"
              >
                <ShoppingCart className="h-4 w-4" />
                <span>Sell</span>
              </Link>
              <Link
                href="/governance"
                className="hover:text-gray-300 flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                <span>Governance</span>
              </Link>
              <Link
                href="/profile"
                className="hover:text-gray-300 flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                <span>Profile</span>
              </Link>
              <Link
                href="/chat"
                className="hover:text-gray-300 flex items-center gap-2"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Chat</span>
              </Link>
              {!isConnected && (
                <Button
                  variant="outline"
                  className="mt-4 border-purple-900 text-purple-800"
                  onClick={connect}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Wallet className="mr-2 h-4 w-4" />
                  )}
                  {isLoading ? "Connecting..." : "Connect Wallet"}
                </Button>
              )}
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-100" />
              <Input
                placeholder="Search prompts..."
                className="pl-8 md:w-[300px] lg:w-[400px] bg-gray-400 border-purple-700"
              />
            </div>
          </div>

          {isConnected && account ? (
            <TooltipProvider>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="ml-auto hidden md:flex font-bold border-purple-900 text-purple-900 hover:text-purple-300 hover:border-purple-800"
                  >
                    <Wallet className="mr-2 h-4 w-4" />
                    {formatAddress(account)}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-gray-900 text-white border-gray-800">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
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
            </TooltipProvider>
          ) : (
            <Button
              variant="outline"
              className="ml-auto font-bold border-purple-900 text-purple-800 hover:text-purple-300 hover:border-purple-800 md:flex"
              onClick={connect}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Wallet className="mr-2 h-4 w-4" />
              )}
              {isLoading ? "Connecting..." : "Connect Wallet"}
            </Button>
          )}
        </div>
      </div>

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
    </header>
  );
}
