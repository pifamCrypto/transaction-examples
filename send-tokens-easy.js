const nearAPI  = require('near-api-js');
const { connect, KeyPair, keyStores } = nearAPI
const { formatAmount } = require('./utils');

//this is required if using a local .env file for private key
require('dotenv').config();

// configure accounts, network, and amount of NEAR to send
const sender = 'sender.testnet';
const receiver = 'receiver.testnet';
const networkId = 'default';
const amount = formatAmount(1);

async function main() {
  // sets up an empty keyStore object using near-api-js
  const keyStore = new keyStores.InMemoryKeyStore();
  // creates a keyPair from the private key provided in your .env file
  const keyPair = KeyPair.fromString(process.env.SENDER_PRIVATE_KEY);
  // adds the key you just created to your keyStore which can hold multiple keys
  await keyStore.setKey(networkId, sender, keyPair);

  // creates a configuration object used to connect to NEAR
  const config = {
    networkId,
    keyStore,
    nodeUrl: 'https://rpc.testnet.near.org',
    walletUrl: 'https://wallet.testnet.near.org',
    helperUrl: 'https://helper.testnet.near.org',
    explorerUrl: 'https://explorer.testnet.near.org'
  }

  // connect to NEAR! :) 
  const near = await connect(config);
  // create a NEAR account object
  const senderAccount = await near.account(sender);

  try {
    // send those tokens! :)
    const result = await senderAccount.sendMoney(receiver, amount);

    // console results
    console.log('Transaction Results: ', result.transaction);
    console.log('--------------------------------------------------------------------------------------------')
    console.log('OPEN LINK BELOW to see transaction in NEAR Explorer!');
    console.log(`${config.explorerUrl}/transactions/${result.transaction.hash}`);
    console.log('--------------------------------------------------------------------------------------------');
  } catch (error) {
    console.log(error);
  };
};

// run the function
main();