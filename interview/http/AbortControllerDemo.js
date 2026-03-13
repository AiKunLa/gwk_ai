async function getUseInfo(url, signal) {
    try {
        const response = await fetch(url, { signal })
        if (signal.aborted) throw new DOMException('Abort', "AbortError")
        return response
    } catch (error) {
        if (error.name === "AbortError") {
            console.log('Request cancelled by user or component unmount.');
            return null
        }
        throw error
    }
}

