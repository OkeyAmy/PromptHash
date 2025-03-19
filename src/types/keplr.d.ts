interface Window {
	keplr?: {
		enable: (chainId: string) => Promise<void>;
		getOfflineSigner: (chainId: string) => any;
		getKey: (chainId: string) => Promise<{
			name: string;
			algo: string;
			pubKey: Uint8Array;
			address: Uint8Array;
			bech32Address: string;
		}>;
		sendTokens: (
			chainId: string,
			recipientAddress: string,
			amount: Array<{
				denom: string;
				amount: string;
			}>
		) => Promise<any>;
	};
}
