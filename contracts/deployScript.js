require("dotenv").config();
const fs = require("fs").promises;
const { JsonRpcProvider } = require("@ethersproject/providers");
const { Wallet } = require("@ethersproject/wallet");
const { ContractFactory } = require("@ethersproject/contracts");
const { Hbar, HbarUnit } = require("@hashgraph/sdk");

const CHARS = {
  HELLIP: "…",
  START: "🏁",
  SECTION: "🟣",
  COMPLETE: "🎉",
  ERROR: "❌",
  SUMMARY: "🔢",
  REMINDER: "🧐",
};
function calculateTransactionFeeFromViem(txReceipt) {
  const { gasUsed, effectiveGasPrice } = txReceipt;
  const txFee = (BigInt(gasUsed) * BigInt(effectiveGasPrice)) / 10_000_000_000n;
  return Hbar.from(txFee, HbarUnit.Tinybar).toString(HbarUnit.Hbar);
}

async function deployContract() {
  const solidityFileName = "PromptHash";
  console.log("trying to deploy PromptHash smart contract...");

  // Initialize the operator account
  const operatorIdStr = process.env.OPERATOR_ACCOUNT_ID;
  console.log("operatorIdStr", operatorIdStr);
  const operatorKeyStr = process.env.OPERATOR_ACCOUNT_PRIVATE_KEY;
  const rpcUrl = process.env.RPC_URL;
  if (!operatorIdStr || !operatorKeyStr || !rpcUrl) {
    throw new Error(
      "Must set OPERATOR_ACCOUNT_ID, OPERATOR_ACCOUNT_PRIVATE_KEY, and RPC_URL environment variables"
    );
  }

  try {
    console.log("Initializing operator account");
    const rpcProvider = new JsonRpcProvider(rpcUrl);
    const operatorWallet = new Wallet(operatorKeyStr, rpcProvider);
    const operatorAddress = operatorWallet.address;
    console.log("Operator account initialized:", operatorAddress);
    console.log("This address will be the contract owner");

    // Prepare Smart Contract for Deployment
    const abi = await fs.readFile(
      `../PromptHash/contracts/${solidityFileName}.abi`,
      {
        encoding: "utf8",
      }
    );
    const evmBytecode = await fs.readFile(
      `../PromptHash/contracts/${solidityFileName}.bin`,
      {
        encoding: "utf8",
      }
    );
    console.log(
      "Compiled smart contract ABI:",
      abi.substring(0, 32),
      CHARS.HELLIP
    );
    console.log(
      "Compiled smart contract EVM bytecode:",
      evmBytecode.substring(0, 32),
      CHARS.HELLIP
    );

    const promptFactory = new ContractFactory(
      abi,
      evmBytecode,
      operatorWallet
    );

    // Deploy without constructor arguments
    const myContract = await promptFactory.deploy();
    const deployTx = myContract.deployTransaction;
    const deploymentTxReceipt = await deployTx.wait();
    console.log(
      "Smart contract deployment transaction fee",
      calculateTransactionFeeFromViem(deploymentTxReceipt)
    );

    const deploymentTxAddress = myContract.address;
    const deploymentTxHashscanUrl = `https://hashscan.io/testnet/contract/${deploymentTxAddress}`;

    console.log("Smart contract deployment address:", deploymentTxAddress);
    console.log(
      "Smart contract deployment Hashscan URL:\n",
      ("URL", deploymentTxHashscanUrl)
    );
  } catch (error) {
    console.error("Error initializing client:", error);
    throw error;
  }
}

deployContract();

// SAMPLE OUTPUT
// trying to deploy PromptHash smart contract...
// operatorIdStr 0.0.5864782
// Initializing operator account
// Operator account initialized: 0xE250f9d195c7D750DAFd251A0cbF94D0Bfb5B1bA
// This address will be the contract owner
// Compiled smart contract ABI: [{"inputs":[],"stateMutability": …
// Compiled smart contract EVM bytecode: 60806040526001805534801561001457 …
// Smart contract deployment transaction fee 0.1201851 ℏ
// Smart contract deployment address: 0xaC3773297C26A6336453C09943f67A2F5023FcEB
// Smart contract deployment Hashscan URL:
//  https://hashscan.io/testnet/contract/0xaC3773297C26A6336453C09943f67A2F5023FcEB