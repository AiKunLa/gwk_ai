// 安装依赖： npm install tronweb
const { TronWeb } = require('tronweb');

// 创建一个随机钱包
function createTronWallet() {
    const tronWeb = new TronWeb({
        fullHost: 'https://api.trongrid.io'
    });

    // 随机生成私钥
    const account = tronWeb.createAccount().then(account => {
        console.log('私钥 (Private Key):', account.privateKey);
        console.log('公钥 (Public Key):', account.publicKey);
        console.log('钱包地址 (Base58):', account.address.base58);
        console.log('钱包地址 (Hex):', account.address.hex);
    }).catch(err => {
        console.error(err);
    });
}

createTronWallet();