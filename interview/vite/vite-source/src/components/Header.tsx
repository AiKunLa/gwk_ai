import Worker from './example.js?worker'
// import { ReactComponent as ReactLogo } from '@assets/vite.svg'

export function Header() {
    const worker = new Worker()
    worker.postMessage('Hello, worker!')
    worker.addEventListener('message', (event) => {
        console.log('Message from worker:', event.data);
    })
    return (
        <div>
            <h1>Header</h1>
            {/* <img src={ReactLogo} alt="" /> */}
            {/* <ReactLogo /> */}
        </div>
    )
}