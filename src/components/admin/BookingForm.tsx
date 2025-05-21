
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField, FormItem, FormLabel, FormControl, Form } from "@/components/ui/form";
import { DialogFooter } from "@/components/ui/dialog";

interface BookingFormProps {
  form: any;
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
              <FormLabel>Meno a priezvisko</FormLabel>
              <FormControl>
                <Input {...field} required />
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
                <Input type="email" {...field} required />
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
                <FormLabel>Dátum príchodu</FormLabel>
                <FormControl>
                  <Input type="date" {...field} required />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dateTo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dátum odchodu</FormLabel>
                <FormControl>
                  <Input type="date" {...field} required />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="guests"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Počet hostí</FormLabel>
                <FormControl>
                  <Input type="number" min="1" {...field} required />
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
                <FormControl>
                  <select 
                    {...field} 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="Čaká na potvrdenie">Čaká na potvrdenie</option>
                    <option value="Potvrdené">Potvrdené</option>
                  </select>
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <DialogFooter className="sm:justify-end">
          <Button type="button" variant="outline" onClick={onCancel}>
            Zrušiť
          </Button>
          <Button type="submit" className="bg-booking-primary hover:bg-booking-secondary">
            {submitLabel}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
