"use client";

import {
	useState,
	useEffect,
	createContext,
	useContext,
	type ReactNode,
} from "react";

// Define the chain info for Cosmos Hub
const chainInfo = {
	chainId: "cosmoshub-4",
	chainName: "Cosmos Hub",
	rpc: "https://rpc.cosmos.directory/cosmoshub",
	rest: "https://rest.cosmos.directory/cosmoshub",
	bip44: {
		coinType: 118,
	},
	bech32Config: {
		bech32PrefixAccAddr: "cosmos",
		bech32PrefixAccPub: "cosmospub",
		bech32PrefixValAddr: "cosmosvaloper",
		bech32PrefixValPub: "cosmosvaloperpub",
		bech32PrefixConsAddr: "cosmosvalcons",
		bech32PrefixConsPub: "cosmosvalconspub",
	},
	currencies: [
		{
			coinDenom: "ATOM",
			coinMinimalDenom: "uatom",
			coinDecimals: 6,
		},
	],
	feeCurrencies: [
		{
			coinDenom: "ATOM",
			coinMinimalDenom: "uatom",
			coinDecimals: 6,
			gasPriceStep: {
				low: 0.01,
				average: 0.025,
				high: 0.04,
			},
		},
	],
	stakeCurrency: {
		coinDenom: "ATOM",
		coinMinimalDenom: "uatom",
		coinDecimals: 6,
	},
};

interface KeplrWalletContextType {
	connect: () => Promise<void>;
	disconnect: () => void;
	isConnected: boolean;
	isLoading: boolean;
	account: { address: string; chainId: string } | null;
	balance: { amount: string; denom: string } | null;
	error: string | null;
	sendTokens: (recipientAddress: string, amount: number) => Promise<any>;
}

const KeplrWalletContext = createContext<KeplrWalletContextType | undefined>(
	undefined
);

export function KeplrWalletProvider({ children }: { children: ReactNode }) {
	const [isConnected, setIsConnected] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [account, setAccount] = useState<{
		address: string;
		chainId: string;
	} | null>(null);
	const [balance, setBalance] = useState<{
		amount: string;
		denom: string;
	} | null>(null);
	const [error, setError] = useState<string | null>(null);

	// Check if Keplr is installed
	const isKeplrAvailable = () => {
		return typeof window !== "undefined" && window.keplr !== undefined;
	};

	// Connect to Keplr wallet
	const connect = async () => {
		try {
			setIsLoading(true);
			setError(null);

			if (!isKeplrAvailable()) {
				throw new Error(
					"Keplr extension is not installed. Please install it from https://www.keplr.app/"
				);
			}

			// Enable the chain
			await window.keplr!.enable(chainInfo.chainId);

			// Get the key
			const key = await window.keplr!.getKey(chainInfo.chainId);

			setAccount({
				address: key.bech32Address,
				chainId: chainInfo.chainId,
			});
			setIsConnected(true);

			// Fetch balance with fallbacks and CORS handling
			try {
				// Set a default balance first so the UI doesn't break if fetching fails
				setBalance({ amount: "0", denom: "uatom" });

				// Try multiple endpoints with fallbacks
				const endpoints = [
					`${chainInfo.rest}/cosmos/bank/v1beta1/balances/${key.bech32Address}`,
					`https://rest.cosmos.directory/cosmoshub/cosmos/bank/v1beta1/balances/${key.bech32Address}`,
					`https://lcd-cosmoshub.keplr.app/cosmos/bank/v1beta1/balances/${key.bech32Address}`,
				];

				let success = false;
				let data;

				// Try each endpoint until one works
				for (const endpoint of endpoints) {
					try {
						const response = await fetch(endpoint, {
							method: "GET",
							headers: {
								Accept: "application/json",
							},
						});

						if (!response.ok) {
							throw new Error(`HTTP error! status: ${response.status}`);
						}

						data = await response.json();
						success = true;
						break;
					} catch (e) {
						console.log(`Failed to fetch from ${endpoint}`, e);
						// Continue to next endpoint
					}
				}

				if (success && data) {
					const atomBalance = data.balances?.find(
						(b: any) => b.denom === "uatom"
					) || { amount: "0", denom: "uatom" };
					setBalance(atomBalance);
				} else {
					console.log(
						"Could not fetch balance from any endpoint, using default"
					);
				}
			} catch (balanceError) {
				console.error("Error fetching balance:", balanceError);
				// Don't let balance errors prevent wallet connection
			}
		} catch (err) {
			console.error("Connection error:", err);
			setError(
				err instanceof Error ? err.message : "Failed to connect to Keplr"
			);
			setIsConnected(false);
		} finally {
			setIsLoading(false);
		}
	};

	// Disconnect from wallet
	const disconnect = () => {
		setIsConnected(false);
		setAccount(null);
		setBalance(null);
	};

	// Send tokens (simplified implementation)
	const sendTokens = async (recipientAddress: string, amount: number) => {
		if (!isConnected || !account) {
			throw new Error("Wallet not connected");
		}

		try {
			// Convert amount to uatom (1 ATOM = 1,000,000 uatom)
			const amountInUAtom = Math.floor(amount * 1000000).toString();

			// Use Keplr's sendTokens method
			const result = await window.keplr!.sendTokens(
				chainInfo.chainId,
				recipientAddress,
				[{ denom: "uatom", amount: amountInUAtom }]
			);

			return result;
		} catch (err) {
			console.error("Transaction error:", err);
			throw err;
		}
	};

	// Fetch account balance with multiple fallbacks
	const fetchBalance = async (address: string) => {
		if (!address) return;

		try {
			// Try multiple endpoints with fallbacks
			const endpoints = [
				`${chainInfo.rest}/cosmos/bank/v1beta1/balances/${address}`,
				`https://rest.cosmos.directory/cosmoshub/cosmos/bank/v1beta1/balances/${address}`,
				`https://lcd-cosmoshub.keplr.app/cosmos/bank/v1beta1/balances/${address}`,
			];

			let success = false;
			let data;

			// Try each endpoint until one works
			for (const endpoint of endpoints) {
				try {
					console.log(`Trying to fetch balance from ${endpoint}`);
					const response = await fetch(endpoint, {
						method: "GET",
						headers: {
							Accept: "application/json",
						},
					});

					if (!response.ok) {
						throw new Error(`HTTP error! status: ${response.status}`);
					}

					data = await response.json();
					success = true;
					console.log("Balance fetch successful:", data);
					break;
				} catch (e) {
					console.log(`Failed to fetch from ${endpoint}`, e);
					// Continue to next endpoint
				}
			}

			if (success && data) {
				const atomBalance = data.balances?.find(
					(b: any) => b.denom === "uatom"
				) || { amount: "0", denom: "uatom" };
				setBalance(atomBalance);
			}
		} catch (err) {
			console.error("Error fetching balance:", err);
			// Set a default balance so the UI doesn't break
			setBalance({ amount: "0", denom: "uatom" });
		}
	};

	// Check for Keplr on window load
	useEffect(() => {
		const checkKeplr = async () => {
			if (isKeplrAvailable()) {
				// If Keplr is already connected, try to reconnect
				try {
					const key = await window.keplr!.getKey(chainInfo.chainId);
					setAccount({
						address: key.bech32Address,
						chainId: chainInfo.chainId,
					});
					setIsConnected(true);
				} catch (err) {
					// Keplr is available but not connected to this chain
					console.log("Keplr available but not connected");
				}
			}
		};

		// Wait for window to be fully loaded
		if (typeof window !== "undefined") {
			checkKeplr();
		}
	}, []);

	const value = {
		connect,
		disconnect,
		isConnected,
		isLoading,
		account,
		balance,
		error,
		sendTokens,
	};

	return (
		<KeplrWalletContext.Provider value={value}>
			{children}
		</KeplrWalletContext.Provider>
	);
}

export function useKeplrWallet() {
	const context = useContext(KeplrWalletContext);
	if (context === undefined) {
		throw new Error("useKeplrWallet must be used within a KeplrWalletProvider");
	}
	return context;
}
