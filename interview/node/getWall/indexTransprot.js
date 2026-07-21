require('dotenv').config();
const { TronWeb } = require('tronweb');

//.env
//A_PRIVATE_KEY=你的A钱包私钥
//B_ADDRESS=接收方B钱包地址
//TRON_API_KEY=你的TronGrid_API_KEY_可选

const A_PRIVATE_KEY = process.env.A_PRIVATE_KEY;
const B_ADDRESS = process.env.B_ADDRESS;
const TRON_API_KEY = process.env.TRON_API_KEY;

// 要转账的 TRX 数量
const amountTRX = 1; // 例如转 1 TRX

async function main() {
    console.log('开始转账...');
    console.log(A_PRIVATE_KEY ? 'A_PRIVATE_KEY 已配置' : 'A_PRIVATE_KEY 未配置');
    console.log(B_ADDRESS ? 'B_ADDRESS 已配置' : 'B_ADDRESS 未配置');
    console.log(TRON_API_KEY ? 'TRON_API_KEY 已配置' : 'TRON_API_KEY 未配置');
    if (!A_PRIVATE_KEY || !B_ADDRESS) {
        throw new Error('请在 .env 中配置 A_PRIVATE_KEY 和 B_ADDRESS');
    }

    const tronWeb = new TronWeb({
        fullHost: 'https://api.trongrid.io',
        headers: TRON_API_KEY
            ? { 'TRON-PRO-API-KEY': TRON_API_KEY }
            : undefined,
        privateKey: A_PRIVATE_KEY,
    });

    const fromAddress = tronWeb.address.fromPrivateKey(A_PRIVATE_KEY);

    const isValidReceiver = tronWeb.isAddress(B_ADDRESS);
    if (!isValidReceiver) {
        throw new Error('B_ADDRESS 不是有效的 TRON 地址');
    }

    const amountSun = tronWeb.toSun(amountTRX);

    console.log('发送方 A:', fromAddress);
    console.log('接收方 B:', B_ADDRESS);
    console.log('转账金额:', amountTRX, 'TRX');
    console.log('转账金额:', amountSun, 'sun');

    // 方法一：官方推荐的简化方法
    const result = await tronWeb.trx.sendTrx(B_ADDRESS, amountSun);

    console.log('广播结果:', result);

    if (result.result) {
        console.log('转账成功，TxID:', result.txid || result.transaction?.txID);
    } else {
        console.log('转账失败:', result);
    }
}

main().catch((err) => {
    console.error('错误:', err.message || err);
});