import Worker from './example.js?worker'
import { SvgIcon } from './SvgIcon';
// import { ReactComponent as ReactLogo } from '@assets/vite.svg'

export function Header() {
    const worker = new Worker()
    worker.postMessage('Hello, worker!')
    worker.addEventListener('message', (event) => {
        console.log('Message from worker:', event.data);
    })

    const icons = import.meta.globEager('../assets/icons/*.svg')
    const iconUrls = Object.values(icons).map(icons).map((mod) => {
        const fileName = mod.default.split('/').pop()
        const [svgName] = fileName.split('.')
        return svgName
    })

    return (
        <div>
            {
                `IMG_BASE_URL: ${import.meta.env.VITE_IMG_BASE_URL}`
            }
            <h1>Header</h1>
            {/* <img src={ReactLogo} alt="" /> */}
            {/* <ReactLogo /> */}
            {
                iconUrls.map((item) => (
                    <SvgIcon name={item} key={item} width="50" height="50" />
                ))
            }
        </div>
    )
}