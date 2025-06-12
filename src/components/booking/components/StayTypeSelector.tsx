
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Heart } from "lucide-react";

interface StayOption {
  id: string;
  label: string;
  description: string;
}

interface StayTypeSelectorProps {
  selectedStay: string;
  setSelectedStay: (value: string) => void;
  stayOptions: StayOption[];
}

export const StayTypeSelector = ({
  selectedStay,
  setSelectedStay,
  stayOptions,
}: StayTypeSelectorProps) => {
  return (
    <div className="space-y-3">
      <Label className="flex items-center gap-2">
        <Heart className="h-4 w-4 text-pink-500" />
        Typ pobytu
      </Label>
      <RadioGroup value={selectedStay} onValueChange={setSelectedStay}>
        {stayOptions.map((option, index) => {
          const uniqueKey = `${option.id}-${index}`;
          return (
            <div key={uniqueKey} className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-gray-50">
              <RadioGroupItem value={option.id} id={uniqueKey} />
              <div className="flex-1">
                <Label htmlFor={uniqueKey} className="font-medium cursor-pointer">
                  {option.label}
                </Label>
                <p className="text-sm text-gray-500">{option.description}</p>
              </div>
            </div>
          );
        })}
      </RadioGroup>
    </div>
  );
};
