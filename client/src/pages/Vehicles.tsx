import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Car, Edit, Trash2, Eye, Calendar, FileText, Shield, ImageIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ImageCropDialog } from "@/components/ImageCropDialog";

interface Vehicle {
  id: string;
  vehicleId: string;
  customerId: string;
  vehicleNumber?: string;
  vehicleBrand: string;
  vehicleModel: string;
  variant?: string;
  color?: string;
  yearOfPurchase?: number;
  vehiclePhoto: string;
  vinNumber?: string;
  chassisNumber?: string;
  lastServiceDate?: string;
  serviceHistory?: Array<{
    serviceId: string;
    serviceDate: string;
    description: string;
  }>;
  warrantyRecords?: Array<{
    productName: string;
    warrantyStartDate: string;
    warrantyEndDate: string;
    warrantyStatus: string;
  }>;
  createdAt: string;
}

export default function Vehicles() {
  const [searchTerm, setSearchTerm] = useState("");
  const [brandFilter, setBrandFilter] = useState("all");
  const [variantFilter, setVariantFilter] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isCropDialogOpen, setIsCropDialogOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string>("");
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    customerId: "",
    vehicleNumber: "",
    vehicleBrand: "",
    vehicleModel: "",
    variant: "Standard",
    color: "",
    yearOfPurchase: "",
    vehiclePhoto: "",
    vinNumber: "",
    chassisNumber: "",
  });

  const { data: vehicles = [], isLoading, refetch } = useQuery<Vehicle[]>({
    queryKey: ["/api/vehicles"],
  });

  const { data: customers = [] } = useQuery<any[]>({
    queryKey: ["/api/registration/customers"],
  });

  const { data: serviceReminders = [] } = useQuery<any[]>({
    queryKey: ["/api/vehicles/service-reminders"],
  });

  const createVehicleMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', '/api/registration/vehicles', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['/api/vehicles/service-reminders'] });
      setIsCreateDialogOpen(false);
      resetForm();
      toast({
        title: "Success",
        description: "Vehicle registered successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to register vehicle",
        variant: "destructive",
      });
    },
  });

  const updateVehicleMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await apiRequest('PATCH', `/api/registration/vehicles/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/vehicles'] });
      setIsEditDialogOpen(false);
      setSelectedVehicle(null);
      toast({
        title: "Success",
        description: "Vehicle updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update vehicle",
        variant: "destructive",
      });
    },
  });

  const deleteVehicleMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest('DELETE', `/api/registration/vehicles/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/vehicles'] });
      setIsDeleteDialogOpen(false);
      setSelectedVehicle(null);
      toast({
        title: "Success",
        description: "Vehicle deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete vehicle",
        variant: "destructive",
      });
    },
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setImageToCrop(result);
      setIsCropDialogOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = (croppedImage: string) => {
    setFormData(prev => ({ ...prev, vehiclePhoto: croppedImage }));
    setIsCropDialogOpen(false);
  };

  const resetForm = () => {
    setFormData({
      customerId: "",
      vehicleNumber: "",
      vehicleBrand: "",
      vehicleModel: "",
      variant: "Standard",
      color: "",
      yearOfPurchase: "",
      vehiclePhoto: "",
      vinNumber: "",
      chassisNumber: "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      ...formData,
      yearOfPurchase: formData.yearOfPurchase ? parseInt(formData.yearOfPurchase) : undefined,
    };

    createVehicleMutation.mutate(payload);
  };

  const handleEdit = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setFormData({
      customerId: vehicle.customerId,
      vehicleNumber: vehicle.vehicleNumber || "",
      vehicleBrand: vehicle.vehicleBrand,
      vehicleModel: vehicle.vehicleModel,
      variant: vehicle.variant || "Standard",
      color: vehicle.color || "",
      yearOfPurchase: vehicle.yearOfPurchase?.toString() || "",
      vehiclePhoto: vehicle.vehiclePhoto,
      vinNumber: vehicle.vinNumber || "",
      chassisNumber: vehicle.chassisNumber || "",
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVehicle) return;

    const payload = {
      ...formData,
      yearOfPurchase: formData.yearOfPurchase ? parseInt(formData.yearOfPurchase) : undefined,
    };

    updateVehicleMutation.mutate({ id: selectedVehicle.id, data: payload });
  };

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = 
      vehicle.vehicleId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.vehicleNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.vehicleBrand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.vehicleModel?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.vinNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesBrand = brandFilter === "all" || vehicle.vehicleBrand === brandFilter;
    const matchesVariant = variantFilter === "all" || vehicle.variant === variantFilter;
    
    return matchesSearch && matchesBrand && matchesVariant;
  });

  const uniqueBrands = Array.from(new Set(vehicles.map(v => v.vehicleBrand)));
  const uniqueVariants = Array.from(new Set(vehicles.map(v => v.variant).filter(Boolean)));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Car className="h-8 w-8" />
            Vehicle Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage vehicle registrations and track service history
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-vehicle">
              <Plus className="h-4 w-4 mr-2" />
              Add Vehicle
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Register New Vehicle</DialogTitle>
              <DialogDescription>
                Add a new vehicle to the system with customer details
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="customerId">Customer *</Label>
                  <Select
                    value={formData.customerId}
                    onValueChange={(value) => setFormData({ ...formData, customerId: value })}
                  >
                    <SelectTrigger id="customerId" data-testid="select-customer">
                      <SelectValue placeholder="Select customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.fullName} ({customer.referenceCode})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="vehicleBrand">Brand *</Label>
                  <Input
                    id="vehicleBrand"
                    value={formData.vehicleBrand}
                    onChange={(e) => setFormData({ ...formData, vehicleBrand: e.target.value })}
                    placeholder="e.g., Toyota"
                    required
                    data-testid="input-brand"
                  />
                </div>

                <div>
                  <Label htmlFor="vehicleModel">Model *</Label>
                  <Input
                    id="vehicleModel"
                    value={formData.vehicleModel}
                    onChange={(e) => setFormData({ ...formData, vehicleModel: e.target.value })}
                    placeholder="e.g., Innova"
                    required
                    data-testid="input-model"
                  />
                </div>

                <div>
                  <Label htmlFor="variant">Variant</Label>
                  <Select
                    value={formData.variant}
                    onValueChange={(value) => setFormData({ ...formData, variant: value })}
                  >
                    <SelectTrigger id="variant" data-testid="select-variant">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Standard">Standard</SelectItem>
                      <SelectItem value="Base">Base</SelectItem>
                      <SelectItem value="Mid">Mid</SelectItem>
                      <SelectItem value="Top">Top</SelectItem>
                      <SelectItem value="Custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="color">Color</Label>
                  <Input
                    id="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    placeholder="e.g., White"
                    data-testid="input-color"
                  />
                </div>

                <div>
                  <Label htmlFor="vehicleNumber">Vehicle Number</Label>
                  <Input
                    id="vehicleNumber"
                    value={formData.vehicleNumber}
                    onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                    placeholder="e.g., MH12AB1234"
                    data-testid="input-vehicle-number"
                  />
                </div>

                <div>
                  <Label htmlFor="yearOfPurchase">Year of Purchase</Label>
                  <Input
                    id="yearOfPurchase"
                    type="number"
                    value={formData.yearOfPurchase}
                    onChange={(e) => setFormData({ ...formData, yearOfPurchase: e.target.value })}
                    placeholder="e.g., 2023"
                    data-testid="input-year"
                  />
                </div>

                <div>
                  <Label htmlFor="vinNumber">VIN Number</Label>
                  <Input
                    id="vinNumber"
                    value={formData.vinNumber}
                    onChange={(e) => setFormData({ ...formData, vinNumber: e.target.value })}
                    placeholder="17-character VIN"
                    maxLength={17}
                    data-testid="input-vin"
                  />
                </div>

                <div>
                  <Label htmlFor="chassisNumber">Chassis Number</Label>
                  <Input
                    id="chassisNumber"
                    value={formData.chassisNumber}
                    onChange={(e) => setFormData({ ...formData, chassisNumber: e.target.value })}
                    placeholder="Chassis number"
                    data-testid="input-chassis"
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="vehiclePhoto">Vehicle Photo *</Label>
                  <div className="flex gap-4 items-start">
                    <Input
                      id="vehiclePhoto"
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      data-testid="input-photo"
                    />
                    {formData.vehiclePhoto && (
                      <img
                        src={formData.vehiclePhoto}
                        alt="Vehicle preview"
                        className="w-24 h-24 object-cover rounded border"
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                  data-testid="button-cancel"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createVehicleMutation.isPending}
                  data-testid="button-submit"
                >
                  {createVehicleMutation.isPending ? "Registering..." : "Register Vehicle"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all" data-testid="tab-all">
            All Vehicles ({vehicles.length})
          </TabsTrigger>
          <TabsTrigger value="reminders" data-testid="tab-reminders">
            Service Reminders ({serviceReminders.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Search & Filter</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by ID, number, brand, model, VIN..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                    data-testid="input-search"
                  />
                </div>
                <Select value={brandFilter} onValueChange={setBrandFilter}>
                  <SelectTrigger data-testid="select-filter-brand">
                    <SelectValue placeholder="Filter by brand" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Brands</SelectItem>
                    {uniqueBrands.map((brand) => (
                      <SelectItem key={brand} value={brand}>
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={variantFilter} onValueChange={setVariantFilter}>
                  <SelectTrigger data-testid="select-filter-variant">
                    <SelectValue placeholder="Filter by variant" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Variants</SelectItem>
                    {uniqueVariants.map((variant) => (
                      <SelectItem key={variant} value={variant!}>
                        {variant}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i}>
                  <CardContent className="pt-6">
                    <Skeleton className="h-32 w-full mb-4" />
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredVehicles.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Car className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {searchTerm || brandFilter !== "all" || variantFilter !== "all"
                    ? "No vehicles match your search criteria"
                    : "No vehicles registered yet. Add your first vehicle to get started."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredVehicles.map((vehicle) => (
                <Card key={vehicle.id} className="hover:shadow-lg transition-shadow" data-testid={`card-vehicle-${vehicle.id}`}>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary" data-testid={`badge-vehicle-id-${vehicle.id}`}>
                              {vehicle.vehicleId}
                            </Badge>
                            {vehicle.variant && (
                              <Badge variant="outline">{vehicle.variant}</Badge>
                            )}
                          </div>
                          <h3 className="font-semibold text-lg" data-testid={`text-brand-model-${vehicle.id}`}>
                            {vehicle.vehicleBrand} {vehicle.vehicleModel}
                          </h3>
                          <p className="text-sm text-muted-foreground" data-testid={`text-vehicle-number-${vehicle.id}`}>
                            {vehicle.vehicleNumber || "No registration number"}
                          </p>
                        </div>
                        {vehicle.vehiclePhoto && (
                          <img
                            src={vehicle.vehiclePhoto}
                            alt="Vehicle"
                            className="w-20 h-20 object-cover rounded border"
                          />
                        )}
                      </div>

                      <div className="space-y-1 text-sm">
                        {vehicle.color && (
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">Color:</span>
                            <span>{vehicle.color}</span>
                          </div>
                        )}
                        {vehicle.yearOfPurchase && (
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">Year:</span>
                            <span>{vehicle.yearOfPurchase}</span>
                          </div>
                        )}
                        {vehicle.lastServiceDate && (
                          <div className="flex items-center gap-2 text-xs">
                            <Calendar className="h-3 w-3" />
                            <span className="text-muted-foreground">Last Service:</span>
                            <span>{format(new Date(vehicle.lastServiceDate), 'PP')}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 pt-2 border-t">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedVehicle(vehicle);
                            setIsViewDialogOpen(true);
                          }}
                          className="flex-1"
                          data-testid={`button-view-${vehicle.id}`}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(vehicle)}
                          data-testid={`button-edit-${vehicle.id}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedVehicle(vehicle);
                            setIsDeleteDialogOpen(true);
                          }}
                          data-testid={`button-delete-${vehicle.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="reminders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Vehicles Needing Service (6+ Months)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {serviceReminders.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No vehicles need service reminders at this time
                </p>
              ) : (
                <div className="space-y-4">
                  {serviceReminders.map((vehicle: any) => (
                    <div
                      key={vehicle.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                      data-testid={`reminder-${vehicle.id}`}
                    >
                      <div>
                        <p className="font-semibold">
                          {vehicle.vehicleId} - {vehicle.vehicleBrand} {vehicle.vehicleModel}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {vehicle.vehicleNumber || "No registration number"}
                        </p>
                        <p className="text-sm text-amber-600 mt-1">
                          {vehicle.daysSinceLastService 
                            ? `${vehicle.daysSinceLastService} days since last service`
                            : "No service record"}
                        </p>
                      </div>
                      <Badge variant="destructive">Reminder</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* View Vehicle Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Vehicle Details</DialogTitle>
          </DialogHeader>
          {selectedVehicle && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Vehicle ID</Label>
                  <p className="font-semibold">{selectedVehicle.vehicleId}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Brand & Model</Label>
                  <p className="font-semibold">
                    {selectedVehicle.vehicleBrand} {selectedVehicle.vehicleModel}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Variant</Label>
                  <p>{selectedVehicle.variant || "N/A"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Color</Label>
                  <p>{selectedVehicle.color || "N/A"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Vehicle Number</Label>
                  <p>{selectedVehicle.vehicleNumber || "N/A"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Year of Purchase</Label>
                  <p>{selectedVehicle.yearOfPurchase || "N/A"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">VIN Number</Label>
                  <p className="font-mono text-sm">{selectedVehicle.vinNumber || "N/A"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Chassis Number</Label>
                  <p className="font-mono text-sm">{selectedVehicle.chassisNumber || "N/A"}</p>
                </div>
              </div>

              {selectedVehicle.vehiclePhoto && (
                <div>
                  <Label className="text-muted-foreground mb-2 block">Vehicle Photo</Label>
                  <img
                    src={selectedVehicle.vehiclePhoto}
                    alt="Vehicle"
                    className="w-full max-w-md rounded-lg border"
                  />
                </div>
              )}

              {selectedVehicle.serviceHistory && selectedVehicle.serviceHistory.length > 0 && (
                <div>
                  <Label className="flex items-center gap-2 mb-3">
                    <FileText className="h-4 w-4" />
                    Service History
                  </Label>
                  <div className="space-y-2">
                    {selectedVehicle.serviceHistory.map((service, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <p className="font-semibold text-sm">
                          {format(new Date(service.serviceDate), 'PPP')}
                        </p>
                        <p className="text-sm text-muted-foreground">{service.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedVehicle.warrantyRecords && selectedVehicle.warrantyRecords.length > 0 && (
                <div>
                  <Label className="flex items-center gap-2 mb-3">
                    <Shield className="h-4 w-4" />
                    Warranty Records
                  </Label>
                  <div className="space-y-2">
                    {selectedVehicle.warrantyRecords.map((warranty, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <p className="font-semibold text-sm">{warranty.productName}</p>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(warranty.warrantyStartDate), 'PP')} -{" "}
                            {format(new Date(warranty.warrantyEndDate), 'PP')}
                          </p>
                          <Badge
                            variant={warranty.warrantyStatus === "Active" ? "default" : "secondary"}
                          >
                            {warranty.warrantyStatus}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Vehicle Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Vehicle</DialogTitle>
            <DialogDescription>Update vehicle information</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-vehicleBrand">Brand *</Label>
                <Input
                  id="edit-vehicleBrand"
                  value={formData.vehicleBrand}
                  onChange={(e) => setFormData({ ...formData, vehicleBrand: e.target.value })}
                  required
                  data-testid="input-edit-brand"
                />
              </div>

              <div>
                <Label htmlFor="edit-vehicleModel">Model *</Label>
                <Input
                  id="edit-vehicleModel"
                  value={formData.vehicleModel}
                  onChange={(e) => setFormData({ ...formData, vehicleModel: e.target.value })}
                  required
                  data-testid="input-edit-model"
                />
              </div>

              <div>
                <Label htmlFor="edit-variant">Variant</Label>
                <Select
                  value={formData.variant}
                  onValueChange={(value) => setFormData({ ...formData, variant: value })}
                >
                  <SelectTrigger id="edit-variant" data-testid="select-edit-variant">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Standard">Standard</SelectItem>
                    <SelectItem value="Base">Base</SelectItem>
                    <SelectItem value="Mid">Mid</SelectItem>
                    <SelectItem value="Top">Top</SelectItem>
                    <SelectItem value="Custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="edit-color">Color</Label>
                <Input
                  id="edit-color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  data-testid="input-edit-color"
                />
              </div>

              <div>
                <Label htmlFor="edit-vehicleNumber">Vehicle Number</Label>
                <Input
                  id="edit-vehicleNumber"
                  value={formData.vehicleNumber}
                  onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                  data-testid="input-edit-vehicle-number"
                />
              </div>

              <div>
                <Label htmlFor="edit-yearOfPurchase">Year of Purchase</Label>
                <Input
                  id="edit-yearOfPurchase"
                  type="number"
                  value={formData.yearOfPurchase}
                  onChange={(e) => setFormData({ ...formData, yearOfPurchase: e.target.value })}
                  data-testid="input-edit-year"
                />
              </div>

              <div>
                <Label htmlFor="edit-vinNumber">VIN Number</Label>
                <Input
                  id="edit-vinNumber"
                  value={formData.vinNumber}
                  onChange={(e) => setFormData({ ...formData, vinNumber: e.target.value })}
                  maxLength={17}
                  data-testid="input-edit-vin"
                />
              </div>

              <div>
                <Label htmlFor="edit-chassisNumber">Chassis Number</Label>
                <Input
                  id="edit-chassisNumber"
                  value={formData.chassisNumber}
                  onChange={(e) => setFormData({ ...formData, chassisNumber: e.target.value })}
                  data-testid="input-edit-chassis"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditDialogOpen(false);
                  setSelectedVehicle(null);
                }}
                data-testid="button-cancel-edit"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updateVehicleMutation.isPending}
                data-testid="button-submit-edit"
              >
                {updateVehicleMutation.isPending ? "Updating..." : "Update Vehicle"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the vehicle record. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedVehicle && deleteVehicleMutation.mutate(selectedVehicle.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="button-confirm-delete"
            >
              {deleteVehicleMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Image Crop Dialog */}
      <ImageCropDialog
        open={isCropDialogOpen}
        onOpenChange={setIsCropDialogOpen}
        imageSrc={imageToCrop}
        onCropComplete={handleCropComplete}
      />
    </div>
  );
}
