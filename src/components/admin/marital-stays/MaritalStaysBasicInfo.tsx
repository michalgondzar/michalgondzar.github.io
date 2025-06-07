
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface MaritalStayContent {
  title: string;
  description: string;
  external_link: string;
}

interface MaritalStaysBasicInfoProps {
  content: MaritalStayContent;
  onUpdate: (updates: Partial<MaritalStayContent>) => void;
}

export const MaritalStaysBasicInfo = ({ content, onUpdate }: MaritalStaysBasicInfoProps) => {
  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="title">Nadpis sekcie</Label>
        <Input 
          id="title"
          value={content.title} 
          onChange={(e) => onUpdate({ title: e.target.value })}
        />
      </div>
      
      <div>
        <Label htmlFor="description">Popis</Label>
        <Textarea 
          id="description"
          rows={4}
          value={content.description}
          onChange={(e) => onUpdate({ description: e.target.value })}
        />
      </div>
      
      <div>
        <Label htmlFor="externalLink">Externý odkaz</Label>
        <Input 
          id="externalLink"
          value={content.external_link}
          onChange={(e) => onUpdate({ external_link: e.target.value })}
          placeholder="https://www.manzelkepobyty.sk"
        />
      </div>
    </div>
  );
};
