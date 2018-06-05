import web3 from './web3';
import CampaignFactory from './build/CampaignFactory';

const address = '0x824a2A3ED7C8Cc6BA59aF90D5e0c86EE9da19015';

const instance = new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    address
);

export default instance;