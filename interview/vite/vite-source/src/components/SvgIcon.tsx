export interface SvgIconProps {
    name?: string
    prefix?: string
    color?: string
    [key: string]: any  // 或者 string | undefined
}


export function SvgIcon({ name, prefix = 'icon', color = '#333', ...props }: SvgIconProps) {
    const symbolId = `#${prefix}-${name}`
    return (
        <svg {...props} aria-hidden="true" fill={color}>
            <use href={symbolId} fill={color} />
        </svg>
    )
}