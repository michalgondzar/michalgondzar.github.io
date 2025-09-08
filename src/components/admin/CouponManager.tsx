import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Plus, Edit, Trash2, CalendarIcon, Tag, Percent } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Coupon {
  id: string;
  code: string;
  name: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_stay_nights: number;
  valid_from: string;
  valid_to: string;
  usage_limit: number | null;
  usage_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const CouponManager = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    discount_type: 'percentage' as 'percentage' | 'fixed',
    discount_value: '',
    min_stay_nights: '1',
    valid_from: new Date(),
    valid_to: new Date(),
    usage_limit: '',
    is_active: true
  });

  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = async () => {
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading coupons:', error);
        toast.error("Chyba pri načítavaní kupónov");
        return;
      }

      setCoupons((data || []) as Coupon[]);
    } catch (error) {
      console.error('Error loading coupons:', error);
      toast.error("Chyba pri načítavaní kupónov");
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      name: '',
      discount_type: 'percentage',
      discount_value: '',
      min_stay_nights: '1',
      valid_from: new Date(),
      valid_to: new Date(),
      usage_limit: '',
      is_active: true
    });
    setEditingCoupon(null);
  };

  const openDialog = (coupon?: Coupon) => {
    if (coupon) {
      setEditingCoupon(coupon);
      setFormData({
        code: coupon.code,
        name: coupon.name,
        discount_type: coupon.discount_type,
        discount_value: coupon.discount_value.toString(),
        min_stay_nights: coupon.min_stay_nights.toString(),
        valid_from: new Date(coupon.valid_from),
        valid_to: new Date(coupon.valid_to),
        usage_limit: coupon.usage_limit?.toString() || '',
        is_active: coupon.is_active
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.code || !formData.name || !formData.discount_value) {
      toast.error("Vyplňte všetky povinné polia");
      return;
    }

    setLoading(true);
    try {
      const couponData = {
        code: formData.code.toUpperCase(),
        name: formData.name,
        discount_type: formData.discount_type,
        discount_value: parseFloat(formData.discount_value),
        min_stay_nights: parseInt(formData.min_stay_nights),
        valid_from: format(formData.valid_from, 'yyyy-MM-dd'),
        valid_to: format(formData.valid_to, 'yyyy-MM-dd'),
        usage_limit: formData.usage_limit ? parseInt(formData.usage_limit) : null,
        is_active: formData.is_active
      };

      if (editingCoupon) {
        const { error } = await supabase
          .from('coupons')
          .update(couponData)
          .eq('id', editingCoupon.id);

        if (error) throw error;
        toast.success("Kupón bol úspešne aktualizovaný");
      } else {
        const { error } = await supabase
          .from('coupons')
          .insert([couponData]);

        if (error) throw error;
        toast.success("Kupón bol úspešne vytvorený");
      }

      setIsDialogOpen(false);
      resetForm();
      loadCoupons();
    } catch (error: any) {
      console.error('Error saving coupon:', error);
      if (error.code === '23505') {
        toast.error("Kupón s týmto kódom už existuje");
      } else {
        toast.error("Chyba pri ukladaní kupóna");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Naozaj chcete vymazať tento kupón?")) return;

    try {
      const { error } = await supabase
        .from('coupons')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success("Kupón bol vymazaný");
      loadCoupons();
    } catch (error) {
      console.error('Error deleting coupon:', error);
      toast.error("Chyba pri mazaní kupóna");
    }
  };

  const getStatusBadge = (coupon: Coupon) => {
    if (!coupon.is_active) {
      return <Badge variant="destructive">Neaktívny</Badge>;
    }
    
    const now = new Date();
    const validFrom = new Date(coupon.valid_from);
    const validTo = new Date(coupon.valid_to);
    
    if (now < validFrom) {
      return <Badge variant="secondary">Čaká na aktiváciu</Badge>;
    } else if (now > validTo) {
      return <Badge variant="destructive">Expirovaný</Badge>;
    } else if (coupon.usage_limit && coupon.usage_count >= coupon.usage_limit) {
      return <Badge variant="destructive">Vyčerpaný</Badge>;
    } else {
      return <Badge variant="default">Aktívny</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Tag className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Správa zľavových kupónov</h2>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openDialog()} className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Nový kupón
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingCoupon ? 'Upraviť kupón' : 'Nový kupón'}
              </DialogTitle>
              <DialogDescription>
                Vytvorte alebo upravte zľavový kupón pre rezervácie.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="code">Kód kupóna *</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                  placeholder="napr. LETO2024"
                />
              </div>
              
              <div>
                <Label htmlFor="name">Názov *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="napr. Letná zľava 2024"
                />
              </div>
              
              <div>
                <Label htmlFor="discount-type">Typ zľavy</Label>
                <Select 
                  value={formData.discount_type} 
                  onValueChange={(value: 'percentage' | 'fixed') => 
                    setFormData(prev => ({ ...prev, discount_type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentuálna (%)</SelectItem>
                    <SelectItem value="fixed">Pevná suma (€)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="discount-value">
                  Hodnota zľavy * {formData.discount_type === 'percentage' ? '(%)' : '(€)'}
                </Label>
                <Input
                  id="discount-value"
                  type="number"
                  step={formData.discount_type === 'percentage' ? '1' : '0.01'}
                  value={formData.discount_value}
                  onChange={(e) => setFormData(prev => ({ ...prev, discount_value: e.target.value }))}
                  placeholder={formData.discount_type === 'percentage' ? '10' : '15.00'}
                />
              </div>
              
              <div>
                <Label htmlFor="min-stay">Minimálny pobyt (noci)</Label>
                <Input
                  id="min-stay"
                  type="number"
                  value={formData.min_stay_nights}
                  onChange={(e) => setFormData(prev => ({ ...prev, min_stay_nights: e.target.value }))}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Platný od</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.valid_from && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.valid_from ? format(formData.valid_from, "PPP") : <span>Vyberte dátum</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.valid_from}
                        onSelect={(date) => date && setFormData(prev => ({ ...prev, valid_from: date }))}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div>
                  <Label>Platný do</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.valid_to && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.valid_to ? format(formData.valid_to, "PPP") : <span>Vyberte dátum</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.valid_to}
                        onSelect={(date) => date && setFormData(prev => ({ ...prev, valid_to: date }))}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              <div>
                <Label htmlFor="usage-limit">Limit použití (voliteľné)</Label>
                <Input
                  id="usage-limit"
                  type="number"
                  value={formData.usage_limit}
                  onChange={(e) => setFormData(prev => ({ ...prev, usage_limit: e.target.value }))}
                  placeholder="neobmedzené"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="is-active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                />
                <Label htmlFor="is-active">Aktívny</Label>
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Zrušiť
                </Button>
                <Button 
                  onClick={handleSave}
                  disabled={loading}
                  className="bg-primary hover:bg-primary/90"
                >
                  {loading ? "Ukladám..." : (editingCoupon ? "Aktualizovať" : "Vytvoriť")}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Zoznam kupónov</CardTitle>
          <CardDescription>
            Spravujte všetky zľavové kupóny pre rezervácie
          </CardDescription>
        </CardHeader>
        <CardContent>
          {coupons.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Tag className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Žiadne kupóny neboli vytvorené</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kód</TableHead>
                    <TableHead>Názov</TableHead>
                    <TableHead>Zľava</TableHead>
                    <TableHead>Platnosť</TableHead>
                    <TableHead>Použitie</TableHead>
                    <TableHead>Stav</TableHead>
                    <TableHead>Akcie</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {coupons.map((coupon) => (
                    <TableRow key={coupon.id}>
                      <TableCell className="font-mono font-semibold">
                        {coupon.code}
                      </TableCell>
                      <TableCell>{coupon.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {coupon.discount_type === 'percentage' ? (
                            <>
                              <Percent className="h-3 w-3" />
                              {coupon.discount_value}%
                            </>
                          ) : (
                            <>€{coupon.discount_value}</>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{format(new Date(coupon.valid_from), "dd.MM.yyyy")}</div>
                          <div className="text-muted-foreground">
                            do {format(new Date(coupon.valid_to), "dd.MM.yyyy")}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {coupon.usage_count}/{coupon.usage_limit || '∞'}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(coupon)}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDialog(coupon)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(coupon.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};