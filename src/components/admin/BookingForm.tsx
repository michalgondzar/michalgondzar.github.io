
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";

interface BookingFormProps {
  form: UseFormReturn<any>;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  submitLabel: string;
}

export const BookingForm = ({ form, onSubmit, onCancel, submitLabel }: BookingFormProps) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meno</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Meno hosťa" />
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" placeholder="email@example.com" />
              </FormControl>
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="dateFrom"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dátum od</FormLabel>
                <FormControl>
                  <Input {...field} type="date" />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="dateTo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dátum do</FormLabel>
                <FormControl>
                  <Input {...field} type="date" />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="guests"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Počet hostí</FormLabel>
              <FormControl>
                <Input {...field} type="number" min="1" max="10" />
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="stayType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Typ pobytu</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Vyberte typ pobytu" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="manzelsky">Manželský pobyt</SelectItem>
                  <SelectItem value="rodinny">Rodinný pobyt</SelectItem>
                  <SelectItem value="komorka">Pobyt v komôrke</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="coupon"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Zľavový kupón</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Kód kupónu (voliteľné)" />
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stav</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Čaká na potvrdenie">Čaká na potvrdenie</SelectItem>
                  <SelectItem value="Potvrdené">Potvrdené</SelectItem>
                  <SelectItem value="Zrušené">Zrušené</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        
        <div className="flex gap-2 pt-4">
          <Button type="submit" className="flex-1">{submitLabel}</Button>
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
            Zrušiť
          </Button>
        </div>
      </form>
    </Form>
  );
};
