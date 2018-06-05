const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface)).deploy({
        data: compiledFactory.bytecode
    }).send({
        from: accounts[0],
        gas: '1000000'
    });

    await factory.methods.createCampaign('100').send({
        from: accounts[0],
        gas: '1000000'
    });

    [campaignAddress] = campaignAddress = await factory.methods.getDeployedCampaigns().call();

    campaign = await new web3.eth.Contract(
        JSON.parse(compiledCampaign.interface),
        campaignAddress
    );
});

describe('Campaigns', () => {
    it('deploys a campaign factory and a campaign', () => {
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });

    it('marks the caller as the campaign manager', async () => {
        const manager = await campaign.methods.manager().call();

        assert.equal(accounts[0], manager);
    });

    it('allows people to contribute money and add them as approvers', async () => {
        await campaign.methods.contribute().send({
            from: accounts[1],
            value: '200'
        });

        const isContributor = await campaign.methods.approvers(accounts[1]).call();

        assert(isContributor);
    });

    it('requires a minimum contribution', async () => {
        try {
            await campaign.methods.contribute().send({
                from: accounts[1],
                value: '1'
            });

            assert(false);
        } catch (error) {
            assert(error);
        }
    });

    it('allows a manager to make a payment request', async () => {
        const description = 'buy batteries';
        const value = '1000';
        const recipient = accounts[2];

        // Create the request
        await campaign.methods.createRequest(
            description,
            value,
            recipient
        ).send({
            from: accounts[0],
            gas: '1000000'
        });

        // Fetch the request
        const request = await campaign.methods.requests(0).call();

        // Assert that all properties have been set correctly
        assert.equal(description, request.description);
        assert.equal(value, request.value);
        assert.equal(recipient, request.recipient);
        assert.equal(0, request.approvalCount);
        assert(!request.complete);
    });

    it('processes requests', async () => {
        // Get the recipients balance before the transaction has been sent
        const initialBalance = await getBalanceInEther(accounts[1]);

        // Contribute to campaign
        await campaign.methods.contribute().send({
            from: accounts[0],
            value: web3.utils.toWei('10', 'ether')
        });

        // Create the request
        await campaign.methods.createRequest(
            'buy batteries',
            web3.utils.toWei('5', 'ether'),
            accounts[1]
        ).send({
            from: accounts[0],
            gas: '1000000'
        });

        // Approve the request
        await campaign.methods.approveRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        });

        // Finalize the request
        await campaign.methods.finalizeRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        });

        // Get the recipeints balance after the transaction has been sent
        const endBalance = await getBalanceInEther(accounts[1]);

        // Check if the recipient has received the money
        assert(endBalance > (initialBalance + 4.9));
    });
});

// Helper function to get a comparable balance in ether
const getBalanceInEther = async (account) => {
    return parseFloat(web3.utils.fromWei(
        await web3.eth.getBalance(account),
        'ether'
    ));
}