
export function FromItem(props: { label?: string, value: string, onChange: (value: string) => void }) {
    const { label, value, onChange } = props
    return (
        <div>
            {label && <label>{label}</label>}
            <input value={value} onChange={e => onChange(e.target.value)} />
        </div>
    )
}