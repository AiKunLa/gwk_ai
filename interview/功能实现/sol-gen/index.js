require("dotenv").config();

const {
    Connection,
    Keypair,
    PublicKey
} = require("@solana/web3.js");

const {
    createMint,
    getOrCreateAssociatedTokenAccount,
    mintTo
} = require("@solana/spl-token");

/**
 * 从 .env 中读取并校验必填配置项
 */
function loadConfig() {
    const {
        SOLANA_RPC_URL,
        PAYER_SECRET_KEY,
        RECIPIENT_PUBLIC_KEY,
        TOKEN_DECIMALS,
        TOKEN_AMOUNT
    } = process.env;

    // 校验必填项
    if (!SOLANA_RPC_URL) {
        throw new Error("❌ 请在 .env 中配置 SOLANA_RPC_URL");
    }
    if (!PAYER_SECRET_KEY || PAYER_SECRET_KEY === "[]") {
        throw new Error("❌ 请在 .env 中配置 PAYER_SECRET_KEY（支付钱包的 64 字节密钥）");
    }
    if (!RECIPIENT_PUBLIC_KEY) {
        throw new Error("❌ 请在 .env 中配置 RECIPIENT_PUBLIC_KEY（接收代币的钱包地址）");
    }

    // 解析密钥：支持 JSON 数组、hex 字符串、Base58 字符串三种格式
    let keypair;
    const trimmed = PAYER_SECRET_KEY.trim();
    if (trimmed.startsWith("[")) {
        // JSON 数组格式: [23,145,208,...] → 64 字节完整密钥
        let arr;
        try { arr = JSON.parse(trimmed); } catch {
            throw new Error("❌ PAYER_SECRET_KEY JSON 格式错误");
        }
        if (!Array.isArray(arr) || arr.length !== 64) {
            throw new Error(`❌ JSON 数组必须是 64 个数字，当前: ${arr.length}`);
        }
        keypair = Keypair.fromSecretKey(Uint8Array.from(arr));
    } else if (/^[0-9a-fA-F]+$/.test(trimmed)) {
        // hex 字符串格式（只含 0-9 a-f）
        const hex = trimmed.startsWith("0x") ? trimmed.slice(2) : trimmed;
        if (hex.length === 128) {
            // 64 字节完整密钥（32私钥+32公钥）
            keypair = Keypair.fromSecretKey(Uint8Array.from(Buffer.from(hex, "hex")));
        } else if (hex.length === 64) {
            // 32 字节纯种子 → 用 fromSeed 推导完整密钥对
            keypair = Keypair.fromSeed(Uint8Array.from(Buffer.from(hex, "hex")));
        } else {
            throw new Error(
                `❌ PAYER_SECRET_KEY hex 长度不正确（当前 ${hex.length} 字符），应为 128（64字节完整密钥）或 64（32字节种子）`
            );
        }
    } else {
        // Base58 字符串格式（OKX/Phantom 导出的私钥通常是这种）
        const bs58 = require("bs58").default || require("bs58");
        let bytes;
        try { bytes = bs58.decode(trimmed); } catch {
            throw new Error("❌ PAYER_SECRET_KEY 无法解析，请检查格式");
        }
        if (bytes.length === 64) {
            keypair = Keypair.fromSecretKey(bytes);
        } else if (bytes.length === 32) {
            keypair = Keypair.fromSeed(bytes);
        } else {
            throw new Error(
                `❌ PAYER_SECRET_KEY Base58 解码后为 ${bytes.length} 字节，应为 32 或 64 字节`
            );
        }
    }

    const decimals = parseInt(TOKEN_DECIMALS || "9", 10);
    const amount = parseInt(TOKEN_AMOUNT || "1000000", 10);

    return {
        rpcUrl: SOLANA_RPC_URL,
        payer: keypair,
        recipientPublicKey: RECIPIENT_PUBLIC_KEY,
        decimals,
        amount
    };
}

/**
 * 在 Solana 上创建 SPL Token 并铸造到指定钱包
 */
async function main() {
    console.log("🚀 Solana SPL Token 创建工具");
    console.log("=" .repeat(40));

    // 1. 加载配置
    const config = loadConfig();
    console.log(`🌐 RPC: ${config.rpcUrl}`);
    console.log(`📬 接收地址: ${config.recipientPublicKey}`);
    console.log(`🔢 小数位数: ${config.decimals}`);
    console.log(`💰 铸造数量: ${config.amount}`);

    // 2. 连接 Solana
    const connection = new Connection(config.rpcUrl, "confirmed");

    // 3. 从配置获取支付钱包
    const payer = config.payer;
    console.log(`👛 支付钱包: ${payer.publicKey.toBase58()}`);

    // 4. 接收方公钥
    const recipient = new PublicKey(config.recipientPublicKey);

    // 5. 创建 Mint（代币铸造厂）
    console.log("⏳ 正在创建 Mint...");
    const mint = await createMint(
        connection,
        payer,
        payer.publicKey,  // Mint Authority — 谁有权铸造新代币
        payer.publicKey,  // Freeze Authority — 谁有权冻结账户
        config.decimals
    );
    console.log(`✅ Mint 地址: ${mint.toBase58()}`);

    // 6. 创建接收方的关联代币账户（ATA）
    console.log("⏳ 正在创建接收方 ATA...");
    const tokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        payer,
        mint,
        recipient
    );
    console.log(`✅ ATA 地址: ${tokenAccount.address.toBase58()}`);

    // 7. 铸造代币
    const rawAmount = config.amount * Math.pow(10, config.decimals);
    console.log(`⏳ 正在铸造 ${config.amount} 枚代币（raw: ${rawAmount}）...`);
    await mintTo(
        connection,
        payer,
        mint,
        tokenAccount.address,
        payer,
        rawAmount
    );

    // 8. 打印结果
    console.log("=".repeat(40));
    console.log("🎉 铸造成功！");
    console.log(`   Mint:     ${mint.toBase58()}`);
    console.log(`   ATA:      ${tokenAccount.address.toBase58()}`);
    console.log(`   Owner:    ${recipient.toBase58()}`);
    console.log(`   Supply:   ${config.amount} (raw: ${rawAmount})`);
}

main().catch((err) => {
    console.error("❌ 执行失败:", err.message);
    process.exit(1);
});
