import WarningCard from "@/app/components/ui/Cards/WarningCard";

interface WarningProps {
    message: string;
    description: string;
}

interface WarningSectionProps {
    warnings: WarningProps[];
}

export default function WarningSection({warnings}: WarningSectionProps) {
    if (!warnings || warnings.length === 0) return null;

    return (
        <div>
            {warnings.map((warning, index) => (
                <div key={warning.message}>
                    <WarningCard warningName={warning.message} description={warning.description}/>
                    {index < warnings.length -1 && (<hr/>)}
                </div>
            ))}
        </div>
    )
}