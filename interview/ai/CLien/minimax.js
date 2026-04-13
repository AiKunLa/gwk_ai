const baseURL = "https://api.minimaxi.com/v1"
const apiKey = "I"

const text = "你是一个专业的AI助手"

const getEmbedding = async () => {
    try {
        const response = await fetch(`${baseURL}/embeddings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: "embo",
                texts: [text],
                type: "db",
            }),
        });

        const data = await response.json()
        console.log(data)
        const embedding = data.data?.[0]?.embedding
        console.log("向量维度:", embedding?.length)
        console.log("向量前5位:", embedding?.slice(0, 5))
    } catch (error) {
        console.error(error.message)
    }
}

getEmbedding()