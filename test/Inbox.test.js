const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

// connect to local test network hosted on our machine solely for testing contracts
const provider = ganache.provider();
const web3 = new Web3(provider);
const { interface, bytecode } = require('../compile');

describe('Inbox contract', () => {

    let accounts;
    let inboxContract;
    beforeEach(async () => {
        // get list of all accounts
        accounts = await web3.eth.getAccounts();

        // use one of those accounts to deploy the contract
        inboxContract = await new web3.eth.Contract(JSON.parse(interface))
            .deploy({ data: bytecode, arguments: ['Hi there!'] })
            .send({ from: accounts[0], gas: '1000000' })

        inboxContract.setProvider(provider);
    });
    it('deploys a contract', () => {
        assert.ok(inboxContract.options.address);
    });
    it('should have an initial message of "Hi there!"', async () => {
        const msg = await inboxContract.methods.message().call();
        assert.equal(msg, 'Hi there!');
    });
    it('should have a new message of "Bye!" after calling newMessage', async () => {
        const transactionID = await inboxContract.methods.setMessage('Boom').send({ from: accounts[0], });
        console.log(transactionID);
        const currentMsg = await inboxContract.methods.message().call();
        assert.equal(currentMsg, 'Boom');
    });
});