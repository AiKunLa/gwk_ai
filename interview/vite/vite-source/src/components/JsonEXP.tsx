import { version } from '../../package.json';


export function JsonEXP() {
    return (
        <div>
            {
                `current version: ${version}`
            }
        </div>
    )
}