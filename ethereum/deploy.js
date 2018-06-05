const HDWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require("web3");
const compiledCampaignFactory = require("./build/CampaignFactory.json");

const provider = new HDWalletProvider(
  "draft benefit cube saddle coast dignity yellow inherit video wire fit sign",
  "https://rinkeby.infura.io/FXlWEkrUTybb27sXaupl"
);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log("Deploying contract from:", accounts[0]);

  const result = await new web3.eth.Contract(
    JSON.parse(compiledCampaignFactory.interface)
  )
    .deploy({ data: "0x" + compiledCampaignFactory.bytecode })
    .send({ from: accounts[0], gas: "3000000" });

  console.log("Address of the contract:", result.options.address);
};

deploy();