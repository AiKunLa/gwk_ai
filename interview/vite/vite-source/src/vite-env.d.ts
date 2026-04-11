/// <reference types="vite/client" />

declare module '*.svg?url' {
    const content: string
    export default content
}

declare module '*.svg' {
    import * as React from 'react'
    export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>
    const content: string
    export default content
}
