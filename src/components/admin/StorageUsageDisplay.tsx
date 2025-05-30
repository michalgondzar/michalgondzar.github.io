
import { HardDrive } from "lucide-react";

interface StorageUsageDisplayProps {
  storageUsage: {
    used: number;
    percentage: number;
  };
}

export const StorageUsageDisplay = ({ storageUsage }: StorageUsageDisplayProps) => {
  return (
    <div className="text-sm text-orange-600 mt-1 space-y-1">
      <p>Supabase nie je nakonfigurovaný - obrázky sa ukladajú lokálne</p>
      <div className="flex items-center gap-2">
        <HardDrive size={14} />
        <span>Využitie úložiska: {storageUsage.used.toFixed(2)} MB ({storageUsage.percentage.toFixed(1)}%)</span>
      </div>
    </div>
  );
};
