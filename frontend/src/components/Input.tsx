interface InputProps {
    name: string;
    label: string;
    type: string;
    placeholder: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function Input({
    name, label, type, placeholder, value, onChange
}: InputProps) {
    return (
        <>
            <label htmlFor={name}>
                <span className="label">{label}</span>
                <input className={name}
                    id={name}
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                />
            </label>
        </>
    )
}
