import { useEffect, useMemo, useState } from 'react'
import './App.css'

type Block = {
  index: number
  timestamp: string
  data: string
  previousHash: string
  hash: string
  nonce: number
}

type Verification = {
  valid: boolean
  message: string
  invalidIndexes: number[]
}

const DIFFICULTY = 3
const INITIAL_BLOCK_DATA = [
  '创世区块: 初始化账本',
  'Alice -> Bob: 5 BTC',
  'Bob -> Coffee Shop: 1 BTC',
]

const encoder = new TextEncoder()

function blockPayload(
  index: number,
  timestamp: string,
  data: string,
  previousHash: string,
  nonce: number,
) {
  return `${index}|${timestamp}|${data}|${previousHash}|${nonce}`
}

async function sha256(value: string) {
  const buffer = await crypto.subtle.digest('SHA-256', encoder.encode(value))
  return [...new Uint8Array(buffer)]
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

async function calculateHash(block: Omit<Block, 'hash'>) {
  return sha256(
    blockPayload(
      block.index,
      block.timestamp,
      block.data,
      block.previousHash,
      block.nonce,
    ),
  )
}

async function mineBlock(index: number, data: string, previousHash: string) {
  const timestamp = new Date().toLocaleString('zh-CN', { hour12: false })
  let nonce = 0
  let hash = ''
  const prefix = '0'.repeat(DIFFICULTY)

  do {
    hash = await calculateHash({
      index,
      timestamp,
      data,
      previousHash,
      nonce,
    })
    nonce += 1
  } while (!hash.startsWith(prefix))

  return {
    index,
    timestamp,
    data,
    previousHash,
    hash,
    nonce: nonce - 1,
  }
}

async function buildChain(items: string[]) {
  const chain: Block[] = []

  for (const [index, data] of items.entries()) {
    const previousHash = index === 0 ? '0'.repeat(64) : chain[index - 1].hash
    chain.push(await mineBlock(index, data, previousHash))
  }

  return chain
}

async function verifyChain(chain: Block[]): Promise<Verification> {
  const invalidIndexes: number[] = []

  for (const block of chain) {
    const recalculatedHash = await calculateHash({
      index: block.index,
      timestamp: block.timestamp,
      data: block.data,
      previousHash: block.previousHash,
      nonce: block.nonce,
    })
    const isGenesis = block.index === 0
    const previousHashMatches =
      isGenesis || block.previousHash === chain[block.index - 1]?.hash
    const proofOfWorkMatches = block.hash.startsWith('0'.repeat(DIFFICULTY))

    if (
      block.hash !== recalculatedHash ||
      !previousHashMatches ||
      !proofOfWorkMatches
    ) {
      invalidIndexes.push(block.index)
    }
  }

  return {
    valid: invalidIndexes.length === 0,
    message:
      invalidIndexes.length === 0
        ? '链条完整: 每个区块 hash 与上一个区块都能对上'
        : `检测到异常: 第 ${invalidIndexes.join(', ')} 个区块需要重新挖矿`,
    invalidIndexes,
  }
}

function shortHash(hash: string) {
  return `${hash.slice(0, 12)}...${hash.slice(-10)}`
}

function App() {
  const [chain, setChain] = useState<Block[]>([])
  const [newData, setNewData] = useState('Charlie -> Dora: 2 BTC')
  const [verification, setVerification] = useState<Verification>({
    valid: true,
    message: '正在准备区块链...',
    invalidIndexes: [],
  })
  const [isMining, setIsMining] = useState(true)

  const totalNonce = useMemo(
    () => chain.reduce((sum, block) => sum + block.nonce, 0),
    [chain],
  )

  useEffect(() => {
    let ignore = false

    async function setup() {
      setIsMining(true)
      const initialChain = await buildChain(INITIAL_BLOCK_DATA)

      if (!ignore) {
        setChain(initialChain)
        setVerification(await verifyChain(initialChain))
        setIsMining(false)
      }
    }

    setup()

    return () => {
      ignore = true
    }
  }, [])

  async function refreshVerification(nextChain: Block[]) {
    setVerification(await verifyChain(nextChain))
  }

  async function handleAddBlock() {
    if (!newData.trim() || isMining || chain.length === 0) {
      return
    }

    setIsMining(true)
    const lastBlock = chain[chain.length - 1]
    const block = await mineBlock(chain.length, newData.trim(), lastBlock.hash)
    const nextChain = [...chain, block]

    setChain(nextChain)
    setNewData('')
    await refreshVerification(nextChain)
    setIsMining(false)
  }

  async function handleTamper(index: number) {
    const nextChain = chain.map((block) =>
      block.index === index
        ? { ...block, data: `${block.data} (已被篡改)` }
        : block,
    )

    setChain(nextChain)
    await refreshVerification(nextChain)
  }

  async function handleReset() {
    setIsMining(true)
    const nextChain = await buildChain(INITIAL_BLOCK_DATA)

    setChain(nextChain)
    await refreshVerification(nextChain)
    setIsMining(false)
  }

  return (
    <main className="app-shell">
      <section className="hero">
        <div>
          <p className="eyebrow">Blockchain Demo</p>
          <h1>迷你区块链实验台</h1>
          <p className="hero-copy">
            用 React 演示区块、SHA-256、工作量证明、前后 hash 连接和篡改检测。
          </p>
        </div>
        <div className={`chain-status ${verification.valid ? 'valid' : 'broken'}`}>
          <span>{verification.valid ? '链条有效' : '链条异常'}</span>
          <strong>{verification.message}</strong>
        </div>
      </section>

      <section className="control-panel">
        <label htmlFor="block-data">新区块数据</label>
        <div className="control-row">
          <input
            id="block-data"
            value={newData}
            placeholder="例如: Eve -> Frank: 8 BTC"
            onChange={(event) => setNewData(event.target.value)}
          />
          <button onClick={handleAddBlock} disabled={isMining || !newData.trim()}>
            {isMining ? '挖矿中...' : '添加区块'}
          </button>
          <button className="secondary" onClick={handleReset} disabled={isMining}>
            重置链
          </button>
        </div>
      </section>

      <section className="metrics" aria-label="区块链统计">
        <div>
          <span>区块数量</span>
          <strong>{chain.length}</strong>
        </div>
        <div>
          <span>挖矿难度</span>
          <strong>{'0'.repeat(DIFFICULTY)} 前缀</strong>
        </div>
        <div>
          <span>累计 nonce</span>
          <strong>{totalNonce.toLocaleString('zh-CN')}</strong>
        </div>
      </section>

      <section className="chain-list" aria-label="区块列表">
        {chain.map((block) => {
          const isInvalid = verification.invalidIndexes.includes(block.index)

          return (
            <article
              className={`block-card ${isInvalid ? 'invalid' : ''}`}
              key={`${block.index}-${block.timestamp}`}
            >
              <header>
                <span className="block-index">Block #{block.index}</span>
                <button
                  className="ghost"
                  disabled={block.index === 0 || isMining}
                  onClick={() => handleTamper(block.index)}
                  title={block.index === 0 ? '创世区块不参与篡改演示' : '修改数据但不重算 hash'}
                >
                  篡改数据
                </button>
              </header>

              <p className="block-data">{block.data}</p>

              <dl>
                <div>
                  <dt>时间</dt>
                  <dd>{block.timestamp}</dd>
                </div>
                <div>
                  <dt>Nonce</dt>
                  <dd>{block.nonce}</dd>
                </div>
                <div>
                  <dt>Previous Hash</dt>
                  <dd>{shortHash(block.previousHash)}</dd>
                </div>
                <div>
                  <dt>Hash</dt>
                  <dd>{shortHash(block.hash)}</dd>
                </div>
              </dl>
            </article>
          )
        })}
      </section>
    </main>
  )
}

export default App
