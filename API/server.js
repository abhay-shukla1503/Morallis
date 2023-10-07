const express = require("express")
const Moralis = require("moralis").default;
const { EvmChain } = require("@moralisweb3/common-evm-utils");


const app = express();
const PORT = 3000;

const MORALIS_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjUyZjNlNDM4LTA0ZjEtNDhlOC1iMzY2LTBmZTI0NjAxM2FlMCIsIm9yZ0lkIjoiMzYwMTYyIiwidXNlcklkIjoiMzcwMTUxIiwidHlwZUlkIjoiODM2MDM1ZDItOTdiNS00NzhkLWI0ZjgtMThiYjA5YmRiZjQ3IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE2OTY2NTU0NTcsImV4cCI6NDg1MjQxNTQ1N30.fAegGLW2lFzLy2AiGKDlFXLNTxab6IpjGR7SP7kzNcY";
const address = "0x6d77FA0c0cc1181ba128a25e25594f004e03a141";
const chain =  EvmChain.ETHEREUM;

/* --------------------------------------DEMO--------------------------------*/
async function getDemoData() {
    // Get native balance
    const nativeBalance = await Moralis.EvmApi.balance.getNativeBalance({
      address,
      chain,
    });
  
    // Format the native balance formatted in ether via the .ether getter
    const native = nativeBalance.result.balance.ether;
  
    // Get token balances
    const tokenBalances = await Moralis.EvmApi.token.getWalletTokenBalances({
      address,
      chain,
    });
  
    // Format the balances to a readable output with the .display() method
    const tokens = tokenBalances.result.map((token) => token.display());
  
    // Get the nfts
    const nftsBalances = await Moralis.EvmApi.nft.getWalletNFTs({
      address,
      chain,
      limit: 10,
    });
  
    // Format the output to return name, amount and metadata
    const nfts = nftsBalances.result.map((nft) => ({
      name: nft.result.name,
      amount: nft.result.amount,
      metadata: nft.result.metadata,
    }));
  
    return { native, tokens, nfts };
  }
  
/* ----------------------------------DEMO---------------------------------------*/

  app.get("/demo", async (req, res) => {
    try {
    const data = await getDemoData();
      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

/* ----------------------------------ACTIVE CHAINS------------------------------*/

  app.get("/active-chains", async (req, res) => {
    try {
      const address = "0xd8da6bf26964af9d7eed9e03e53415d37aa96045"; 
    const chains = [EvmChain.ETHEREUM, EvmChain.BSC, EvmChain.POLYGON];
    const response = await Moralis.EvmApi.wallets.getWalletActiveChains({
      address,
      chains,
    });
    res.status(200).json(response.toJSON());
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

/* ----------------------------------NATIVE BALANCE------------------------------*/
//actual balance of wallet
app.get("/native-balance", async (req, res) => {
  try { 
  const response = await Moralis.EvmApi.balance.getNativeBalance({
    address,
    chain,
  });
  const native = response.result.balance.ether;
  res.status(200).json("Balance: "+native+" Ether");
} catch (error) {
  console.error(error);
  res.status(500).json({ error: error.message });
}
});

/* ----------------------------------ERC20 TOKEN------------------------------*/
//owned by contract address
app.get("/native-erc20-balance", async (req, res) => {
  try { 
  const response = await Moralis.EvmApi.balance.getNativeBalance({
    address : "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    chain:1,
  });
  const native = response.result.balance.ether;
  res.status(200).json("Balance: "+native+" Tokens");
} catch (error) {
  console.error(error);
  res.status(500).json({ error: error.message });
}
});

/* ----------------------------------MULTI SIGNATURE WALLET------------------------------*/

app.get("/multisig-balance", async (req, res) => {
  try { 
  const response = await Moralis.EvmApi.balance.getNativeBalance({
    address :"0x849D52316331967b6fF1198e5E32A0eB168D039d",
    chain :1,
  });
  const native = response.result.balance.ether;
  res.status(200).json("Balance: "+native+" Tokens");
} catch (error) {
  console.error(error);
  res.status(500).json({ error: error.message });
}
});
  
/* ----------------------------------NFT OWNED---------------------------------*/  
//only in single chain
app.get("/nft-owned", async (req, res) => {
  try { 
  const response = await Moralis.EvmApi.nft.getWalletNFTs({
    address :"0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
    chain :1,
  });
  res.status(200).json(response);
  console.log(response.toJSON());
} catch (error) {
  console.error(error);
  res.status(500).json({ error: error.message });
}
});

/* -----------------------------NFT OWNED CROSS-CHAIN---------------------------*/
//in multi chains
app.get("/nft-owned-cross-chain", async (req, res) => {
  try { 
    const array = [];
    const chains =[1,56,137];
    for(const chain of chains){
  const response = await Moralis.EvmApi.nft.getWalletNFTs({
    address :"0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
    chain,
  });
  array.push(response)
}
  res.status(200).json(array);
  
} catch (error) {
  console.error(error);
  res.status(500).json({ error: error.message });
}
});

/* -----------------------------NFTs BY WALLET-----------------------------------*/
//owned by wallet and multichains
app.get("/nft-by-wallet", async (req, res) => {
  try { 
    const array = [];
    const chains =[1,56,137];
    for(const chain of chains){
  const response = await Moralis.EvmApi.nft.getWalletNFTs({
    address :"0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
    chain,
  });
  array.push(response)
}
  res.status(200).json(array);
  
} catch (error) {
  console.error(error);
  res.status(500).json({ error: error.message });
}
});

/* -----------------------------NFTs BY COLLECTION-----------------------------------*/
//all nfts in a single collection
app.get("/nft-by-collection", async (req, res) => {
  try { 
  const response = await Moralis.EvmApi.nft.getContractNFTs({
    address :"0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB",
    chain,
  });
  res.status(200).json(response);
  
} catch (error) {
  console.error(error);
  res.status(500).json({ error: error.message });
}
});

/* -----------------------------ERC20 OWNED BY WALLET-----------------------------------*/

app.get("/token-by-wallet", async (req, res) => {
  try { 
  const response = await Moralis.EvmApi.token.getWalletTokenBalances({
    address :"0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d",
    chain,
  });
  res.status(200).json(response);
  
} catch (error) {
  console.error(error);
  res.status(500).json({ error: error.message });
}
});

/* -----------------------------TRANSACTIONS BY WALLET-----------------------------------*/

app.get("/transactions-by-wallet", async (req, res) => {
  try { 
  const response = await Moralis.EvmApi.transaction.getWalletTransactions({
    address :"0x6d77FA0c0cc1181ba128a25e25594f004e03a141",
    chain:11155111,
  });
  res.status(200).json(response);
  
} catch (error) {
  console.error(error);
  res.status(500).json({ error: error.message });
}
});

/* -----------------------------NFT TRANSFER BY WALLET-----------------------------------*/

app.get("/nft-transfer-by-wallet", async (req, res) => {
  try { 
  const response = await Moralis.EvmApi.nft.getWalletNFTTransfers({
    address :"0x6d77FA0c0cc1181ba128a25e25594f004e03a141",
    chain:11155111,
  });
  res.status(200).json(response);
  
} catch (error) {
  console.error(error);
  res.status(500).json({ error: error.message });
}
});

/* -----------------------------ERC20 TRANSFER BY WALLET-----------------------------------*/

app.get("/erc20-transfer-by-wallet", async (req, res) => {
  try { 
  const response = await Moralis.EvmApi.nft.getWalletNFTTransfers({
    address :"0x6d77FA0c0cc1181ba128a25e25594f004e03a141",
    chain:11155111,
  });
  res.status(200).json(response);
  
} catch (error) {
  console.error(error);
  res.status(500).json({ error: error.message });
}
});

/* -----------------------------ADDRESS BY ENS DOMAIN-----------------------------------*/
//traditional method eg:-.eth or TLDs(Top level domains) like .xyz, .kred, .luxe,
// .art, .club, .nft, .blockchain, .coin
app.get("/ens-domain", async (req, res) => {
  try { 
    const domain = "vitalik.eth";
  const response = await Moralis.EvmApi.resolve.resolveENSDomain({
    domain
  });
  res.status(200).json(response);
  
} catch (error) {
  console.error(error);
  res.status(500).json({ error: error.message });
}
});


/* -----------------------------ENS DOMAIN BY ADDRESS-----------------------------------*/

app.get("/ens-domain-by-address", async (req, res) => {
  try { 
    const response = await Moralis.EvmApi.resolve.resolveAddress({
      address:"0xd8da6bf26964af9d7eed9e03e53415d37aa96045"
    });
    res.status(200).json(response);
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

/* -----------------------------ADDRESS BY UNSTOPPABLE DOMAIN-----------------------------------*/
//unstoppable as an alternative eg:-.crypto,.zil
app.get("/unstoppable-domain", async (req, res) => {
  try { 
    const domain = "brad.crypto";
  const response = await Moralis.EvmApi.resolve.resolveDomain({
    domain
  });
  res.status(200).json(response);
} catch (error) {
  console.error(error);
  res.status(500).json({ error: error.message });
}
});

/* -----------------------------METADATA NORMALIZATION-----------------------------------*/
//returns metadata in normalised form
/*Refreshing metadata is resource intensive - therefore we have a cool-off 
period during which the same token can’t be refreshed more than once.
If the token_uri points to IPFS - we allow refreshing every 10 minutes 
for each individual token.*/
app.get("/metadata", async (req, res) => {
  try { 
  const response = await Moralis.EvmApi.nft.getNFTMetadata({
  address:"0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB",
  chain:1,
  tokenId: 1,
  normalizeMetadata: true,
  });
  res.status(200).json(response);
} catch (error) {
  console.error(error);
  res.status(500).json({ error: error.message });
}
});

/* -----------------------------METADATA NFT-----------------------------------*/
//returns metadata of nft
app.get("/metadata-nft", async (req, res) => {
  try { 
  const response = await Moralis.EvmApi.nft.getNFTMetadata({
  address:"0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB",
  chain:1,
  tokenId: 3931,
  });
  res.status(200).json(response);
} catch (error) {
  console.error(error);
  res.status(500).json({ error: error.message });
}
});

/* -----------------------------NFT TRANSFER BY BLOCK-----------------------------------*/
//All nfts transfered in a block
app.get("/nft-transfer-by-block", async (req, res) => {
  try { 
  const response = await Moralis.EvmApi.nft.getNFTTransfersByBlock({
    blockNumberOrHash:15846571,
    chain,
  });
  res.status(200).json(response);
} catch (error) {
  console.error(error);
  res.status(500).json({ error: error.message });
}
});

/* -----------------------------NFT TRANSFER BY COLLECTION-----------------------------------*/
//All nfts transfered in a collection
app.get("/nft-transfer-by-contract", async (req, res) => {
  try { 
  const response = await Moralis.EvmApi.nft.getNFTContractTransfers({
    address:"0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d",
    chain,
  });
  res.status(200).json(response);
} catch (error) {
  console.error(error);
  res.status(500).json({ error: error.message });
}
});

/* -----------------------------NFT TRANSFER BY ID-----------------------------------*/
//All nfts transfered by token id
app.get("/nft-transfer-by-id", async (req, res) => {
  try { 
  const response = await Moralis.EvmApi.nft.getNFTTransfers({
    address:"0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d",
    tokenId:1,
    chain,
  });
  res.status(200).json(response);
} catch (error) {
  console.error(error);
  res.status(500).json({ error: error.message });
}
});

/* -----------------------------NFT COLLECTION OWNED BY WALLET-----------------------------------*/

app.get("/nft-collection-by-wallet", async (req, res) => {
  try { 
  const response = await Moralis.EvmApi.nft.getWalletNFTCollections({
    address:"0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
    chain,
  });
  res.status(200).json(response);
} catch (error) {
  console.error(error);
  res.status(500).json({ error: error.message });
}
});

/* -----------------------------SERVER START-----------------------------------*/

const startServer = async () => {
    await Moralis.start({
        apiKey: MORALIS_API_KEY,
    });
app.listen(PORT,()=>{
    console.log(`Server is runnig at ${PORT}`);
})
};
startServer();