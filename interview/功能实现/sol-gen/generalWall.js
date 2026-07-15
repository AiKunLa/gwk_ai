const TronWeb = require('tronweb');
const bip39 = require('bip39');
const hdkey = require('ethereumjs-wallet').hdkey;

// TRON 的派生路径
const TRON_PATH = "m/44'/195'/0'/0/0";

async function createTronWallet() {

    // 生成12个单词助记词
    const mnemonic = bip39.generateMnemonic();

    // 助记词转种子
    const seed = await bip39.mnemonicToSeed(mnemonic);

    // HD钱包
    const hdwallet = hdkey.fromMasterSeed(seed);

    // 派生私钥
    const wallet = hdwallet.derivePath(TRON_PATH).getWallet();

    const privateKey = wallet.getPrivateKey().toString('hex');
    const publicKey = wallet.getPublicKey().toString('hex');

    // 根据私钥生成TRON地址
    const tronWeb = new TronWeb({
        fullHost: 'https://api.trongrid.io'
    });

    const address = tronWeb.address.fromPrivateKey(privateKey);

    console.log('助记词:', mnemonic);
    console.log('私钥:', privateKey);
    console.log('公钥:', publicKey);
    console.log('地址:', address);
}

createTronWallet();