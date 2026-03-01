interface Props {
    value: string;
    label: string;
}

export function LandingStat({ value, label }: Props) {
    return (
        <div className="flex flex-col items-center gap-1">
            <span className="text-2xl font-extrabold text-foreground">{value}</span>
            <span className="text-xs text-muted-foreground">{label}</span>
        </div>
    );
}
