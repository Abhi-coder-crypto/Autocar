import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Package, AlertTriangle, TrendingDown, TrendingUp, Edit, Trash2, Building2, Car, Layers, Tag, Palette, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { format } from "date-fns";

export default function InventoryManagement() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("products");
  
  // Dialog states
  const [brandDialog, setBrandDialog] = useState(false);
  const [modelDialog, setModelDialog] = useState(false);
  const [variantDialog, setVariantDialog] = useState(false);
  const [categoryDialog, setCategoryDialog] = useState(false);
  const [rangeDialog, setRangeDialog] = useState(false);
  const [vendorDialog, setVendorDialog] = useState(false);
  const [productDialog, setProductDialog] = useState(false);

  // Form data states
  const [brandForm, setBrandForm] = useState({ name: "", description: "" });
  const [modelForm, setModelForm] = useState({ brandId: "", brandName: "", name: "", description: "" });
  const [variantForm, setVariantForm] = useState({ modelId: "", modelName: "", brandId: "", brandName: "", name: "Base" });
  const [categoryForm, setCategoryForm] = useState({ name: "", description: "" });
  const [rangeForm, setRangeForm] = useState({ name: "", description: "" });
  const [vendorForm, setVendorForm] = useState({
    name: "", contactPerson: "", mobileNumber: "", email: "",
    address: "", city: "", state: "", pinCode: "", gstNumber: ""
  });
  const [productForm, setProductForm] = useState({
    brandId: "", brandName: "", modelId: "", modelName: "", variantId: "", variantName: "",
    categoryId: "", categoryName: "", rangeId: "", rangeName: "",
    productName: "", color: "", finish: "", stockQty: "0", reorderLevel: "5",
    purchasePrice: "", sellingPrice: "", mrp: "", gstRate: "18",
    vendorId: "", vendorName: "", warehouseLocation: "", description: ""
  });

  // Fetch data
  const { data: brands = [], isLoading: brandsLoading } = useQuery<any[]>({
    queryKey: ["/api/inventory/brands"],
  });

  const { data: models = [], isLoading: modelsLoading } = useQuery<any[]>({
    queryKey: ["/api/inventory/models"],
  });

  const { data: variants = [], isLoading: variantsLoading } = useQuery<any[]>({
    queryKey: ["/api/inventory/variants"],
  });

  const { data: categories = [], isLoading: categoriesLoading } = useQuery<any[]>({
    queryKey: ["/api/inventory/categories"],
  });

  const { data: ranges = [], isLoading: rangesLoading } = useQuery<any[]>({
    queryKey: ["/api/inventory/ranges"],
  });

  const { data: vendors = [], isLoading: vendorsLoading } = useQuery<any[]>({
    queryKey: ["/api/inventory/vendors"],
  });

  const { data: products = [], isLoading: productsLoading } = useQuery<any[]>({
    queryKey: ["/api/inventory/products"],
  });

  const { data: lowStockProducts = [] } = useQuery<any[]>({
    queryKey: ["/api/inventory/stock/low"],
  });

  const { data: movements = [] } = useQuery<any[]>({
    queryKey: ["/api/inventory/movements"],
  });

  // Brand mutations
  const createBrandMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', '/api/inventory/brands', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/inventory/brands'] });
      setBrandDialog(false);
      setBrandForm({ name: "", description: "" });
      toast({ title: "Success", description: "Brand created successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create brand", variant: "destructive" });
    },
  });

  // Model mutations
  const createModelMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', '/api/inventory/models', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/inventory/models'] });
      setModelDialog(false);
      setModelForm({ brandId: "", brandName: "", name: "", description: "" });
      toast({ title: "Success", description: "Model created successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create model", variant: "destructive" });
    },
  });

  // Variant mutations
  const createVariantMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', '/api/inventory/variants', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/inventory/variants'] });
      setVariantDialog(false);
      setVariantForm({ modelId: "", modelName: "", brandId: "", brandName: "", name: "Base" });
      toast({ title: "Success", description: "Variant created successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create variant", variant: "destructive" });
    },
  });

  // Category mutations
  const createCategoryMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', '/api/inventory/categories', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/inventory/categories'] });
      setCategoryDialog(false);
      setCategoryForm({ name: "", description: "" });
      toast({ title: "Success", description: "Category created successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create category", variant: "destructive" });
    },
  });

  // Range mutations
  const createRangeMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', '/api/inventory/ranges', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/inventory/ranges'] });
      setRangeDialog(false);
      setRangeForm({ name: "", description: "" });
      toast({ title: "Success", description: "Range created successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create range", variant: "destructive" });
    },
  });

  // Vendor mutations
  const createVendorMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', '/api/inventory/vendors', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/inventory/vendors'] });
      setVendorDialog(false);
      setVendorForm({
        name: "", contactPerson: "", mobileNumber: "", email: "",
        address: "", city: "", state: "", pinCode: "", gstNumber: ""
      });
      toast({ title: "Success", description: "Vendor created successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create vendor", variant: "destructive" });
    },
  });

  // Product mutations
  const createProductMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', '/api/inventory/products', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/inventory/products'] });
      queryClient.invalidateQueries({ queryKey: ['/api/inventory/stock/low'] });
      setProductDialog(false);
      setProductForm({
        brandId: "", brandName: "", modelId: "", modelName: "", variantId: "", variantName: "",
        categoryId: "", categoryName: "", rangeId: "", rangeName: "",
        productName: "", color: "", finish: "", stockQty: "0", reorderLevel: "5",
        purchasePrice: "", sellingPrice: "", mrp: "", gstRate: "18",
        vendorId: "", vendorName: "", warehouseLocation: "", description: ""
      });
      toast({ title: "Success", description: "Product created successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create product", variant: "destructive" });
    },
  });

  const handleBrandChange = (brandId: string) => {
    const brand = brands.find(b => b._id === brandId);
    if (brand) {
      setModelForm({ ...modelForm, brandId, brandName: brand.name });
    }
  };

  const handleModelChange = (modelId: string) => {
    const model = models.find(m => m._id === modelId);
    if (model) {
      setVariantForm({ 
        ...variantForm, 
        modelId, 
        modelName: model.name,
        brandId: model.brandId,
        brandName: model.brandName
      });
    }
  };

  const handleProductBrandChange = (brandId: string) => {
    const brand = brands.find(b => b._id === brandId);
    if (brand) {
      setProductForm({ ...productForm, brandId, brandName: brand.name, modelId: "", modelName: "", variantId: "", variantName: "" });
    }
  };

  const handleProductModelChange = (modelId: string) => {
    const model = models.find(m => m._id === modelId);
    if (model) {
      setProductForm({ ...productForm, modelId, modelName: model.name, variantId: "", variantName: "" });
    }
  };

  const handleProductVariantChange = (variantId: string) => {
    const variant = variants.find(v => v._id === variantId);
    if (variant) {
      setProductForm({ ...productForm, variantId, variantName: variant.name });
    }
  };

  const handleProductCategoryChange = (categoryId: string) => {
    const category = categories.find(c => c._id === categoryId);
    if (category) {
      setProductForm({ ...productForm, categoryId, categoryName: category.name });
    }
  };

  const handleProductRangeChange = (rangeId: string) => {
    const range = ranges.find(r => r._id === rangeId);
    if (range) {
      setProductForm({ ...productForm, rangeId, rangeName: range.name });
    }
  };

  const handleProductVendorChange = (vendorId: string) => {
    const vendor = vendors.find(v => v._id === vendorId);
    if (vendor) {
      setProductForm({ ...productForm, vendorId, vendorName: vendor.name });
    }
  };

  const filteredProducts = products.filter(p =>
    p.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.brandName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const variants: any = {
      in_stock: "default",
      low_stock: "secondary",
      out_of_stock: "destructive",
    };
    return <Badge variant={variants[status] || "default"} data-testid={`badge-status-${status}`}>{status.replace('_', ' ')}</Badge>;
  };

  return (
    <div className="p-6 space-y-6" data-testid="page-inventory-management">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold" data-testid="heading-inventory">Inventory Management</h1>
          <p className="text-muted-foreground" data-testid="text-description">
            Comprehensive inventory tracking with hierarchical product structure
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card data-testid="card-total-products">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-total-products">{products.length}</div>
          </CardContent>
        </Card>

        <Card data-testid="card-low-stock">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500" data-testid="text-low-stock">{lowStockProducts.length}</div>
          </CardContent>
        </Card>

        <Card data-testid="card-total-brands">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Brands</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-total-brands">{brands.length}</div>
          </CardContent>
        </Card>

        <Card data-testid="card-total-vendors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-total-vendors">{vendors.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="products" data-testid="tab-products">Products</TabsTrigger>
          <TabsTrigger value="hierarchy" data-testid="tab-hierarchy">Hierarchy Setup</TabsTrigger>
          <TabsTrigger value="vendors" data-testid="tab-vendors">Vendors</TabsTrigger>
          <TabsTrigger value="low-stock" data-testid="tab-low-stock">Low Stock</TabsTrigger>
          <TabsTrigger value="movements" data-testid="tab-movements">Stock Movements</TabsTrigger>
        </TabsList>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="relative w-72">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
                data-testid="input-search-products"
              />
            </div>
            <Dialog open={productDialog} onOpenChange={setProductDialog}>
              <DialogTrigger asChild>
                <Button data-testid="button-add-product">
                  <Plus className="mr-2 h-4 w-4" /> Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Product</DialogTitle>
                  <DialogDescription>Create a new inventory product with hierarchical details</DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Brand *</Label>
                    <Select value={productForm.brandId} onValueChange={handleProductBrandChange}>
                      <SelectTrigger data-testid="select-product-brand">
                        <SelectValue placeholder="Select brand" />
                      </SelectTrigger>
                      <SelectContent>
                        {brands.map(brand => (
                          <SelectItem key={brand._id} value={brand._id}>{brand.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Model *</Label>
                    <Select value={productForm.modelId} onValueChange={handleProductModelChange} disabled={!productForm.brandId}>
                      <SelectTrigger data-testid="select-product-model">
                        <SelectValue placeholder="Select model" />
                      </SelectTrigger>
                      <SelectContent>
                        {models.filter(m => m.brandId === productForm.brandId).map(model => (
                          <SelectItem key={model._id} value={model._id}>{model.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Variant</Label>
                    <Select value={productForm.variantId} onValueChange={handleProductVariantChange} disabled={!productForm.modelId}>
                      <SelectTrigger data-testid="select-product-variant">
                        <SelectValue placeholder="Select variant" />
                      </SelectTrigger>
                      <SelectContent>
                        {variants.filter(v => v.modelId === productForm.modelId).map(variant => (
                          <SelectItem key={variant._id} value={variant._id}>{variant.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Category *</Label>
                    <Select value={productForm.categoryId} onValueChange={handleProductCategoryChange}>
                      <SelectTrigger data-testid="select-product-category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category._id} value={category._id}>{category.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Product Range</Label>
                    <Select value={productForm.rangeId} onValueChange={handleProductRangeChange}>
                      <SelectTrigger data-testid="select-product-range">
                        <SelectValue placeholder="Select range" />
                      </SelectTrigger>
                      <SelectContent>
                        {ranges.map(range => (
                          <SelectItem key={range._id} value={range._id}>{range.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Product Name *</Label>
                    <Input
                      value={productForm.productName}
                      onChange={(e) => setProductForm({ ...productForm, productName: e.target.value })}
                      placeholder="e.g., Premium Seat Cover"
                      data-testid="input-product-name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Color</Label>
                    <Input
                      value={productForm.color}
                      onChange={(e) => setProductForm({ ...productForm, color: e.target.value })}
                      placeholder="e.g., Red, Black, Beige"
                      data-testid="input-product-color"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Finish</Label>
                    <Input
                      value={productForm.finish}
                      onChange={(e) => setProductForm({ ...productForm, finish: e.target.value })}
                      placeholder="e.g., Matte, Glossy"
                      data-testid="input-product-finish"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Stock Quantity *</Label>
                    <Input
                      type="number"
                      value={productForm.stockQty}
                      onChange={(e) => setProductForm({ ...productForm, stockQty: e.target.value })}
                      data-testid="input-stock-qty"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Reorder Level *</Label>
                    <Input
                      type="number"
                      value={productForm.reorderLevel}
                      onChange={(e) => setProductForm({ ...productForm, reorderLevel: e.target.value })}
                      data-testid="input-reorder-level"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Purchase Price *</Label>
                    <Input
                      type="number"
                      value={productForm.purchasePrice}
                      onChange={(e) => setProductForm({ ...productForm, purchasePrice: e.target.value })}
                      placeholder="₹"
                      data-testid="input-purchase-price"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Selling Price *</Label>
                    <Input
                      type="number"
                      value={productForm.sellingPrice}
                      onChange={(e) => setProductForm({ ...productForm, sellingPrice: e.target.value })}
                      placeholder="₹"
                      data-testid="input-selling-price"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>MRP</Label>
                    <Input
                      type="number"
                      value={productForm.mrp}
                      onChange={(e) => setProductForm({ ...productForm, mrp: e.target.value })}
                      placeholder="₹"
                      data-testid="input-mrp"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>GST Rate (%)</Label>
                    <Input
                      type="number"
                      value={productForm.gstRate}
                      onChange={(e) => setProductForm({ ...productForm, gstRate: e.target.value })}
                      data-testid="input-gst-rate"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Vendor</Label>
                    <Select value={productForm.vendorId} onValueChange={handleProductVendorChange}>
                      <SelectTrigger data-testid="select-product-vendor">
                        <SelectValue placeholder="Select vendor" />
                      </SelectTrigger>
                      <SelectContent>
                        {vendors.map(vendor => (
                          <SelectItem key={vendor._id} value={vendor._id}>{vendor.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Warehouse Location</Label>
                    <Input
                      value={productForm.warehouseLocation}
                      onChange={(e) => setProductForm({ ...productForm, warehouseLocation: e.target.value })}
                      placeholder="e.g., A-12, Rack 5"
                      data-testid="input-warehouse-location"
                    />
                  </div>

                  <div className="space-y-2 col-span-2">
                    <Label>Description</Label>
                    <Textarea
                      value={productForm.description}
                      onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                      placeholder="Product description..."
                      data-testid="textarea-description"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    onClick={() => createProductMutation.mutate(productForm)}
                    disabled={!productForm.brandId || !productForm.modelId || !productForm.categoryId || !productForm.productName}
                    data-testid="button-save-product"
                  >
                    Create Product
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SKU</TableHead>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Brand / Model / Variant</TableHead>
                    <TableHead>Category / Range</TableHead>
                    <TableHead>Color</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Reorder Level</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productsLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      </TableRow>
                    ))
                  ) : filteredProducts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center text-muted-foreground">
                        No products found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProducts.map((product) => (
                      <TableRow key={product._id} data-testid={`row-product-${product._id}`}>
                        <TableCell className="font-mono" data-testid={`text-sku-${product._id}`}>{product.sku}</TableCell>
                        <TableCell data-testid={`text-name-${product._id}`}>{product.productName}</TableCell>
                        <TableCell data-testid={`text-hierarchy-${product._id}`}>
                          <div className="text-sm">
                            <div>{product.brandName} / {product.modelName}</div>
                            {product.variantName && <div className="text-muted-foreground">{product.variantName}</div>}
                          </div>
                        </TableCell>
                        <TableCell data-testid={`text-category-${product._id}`}>
                          <div className="text-sm">
                            <div>{product.categoryName}</div>
                            {product.rangeName && <div className="text-muted-foreground">{product.rangeName}</div>}
                          </div>
                        </TableCell>
                        <TableCell data-testid={`text-color-${product._id}`}>{product.color || '-'}</TableCell>
                        <TableCell data-testid={`text-stock-${product._id}`}>
                          <span className={product.stockQty <= product.reorderLevel ? "text-orange-500 font-semibold" : ""}>
                            {product.stockQty}
                          </span>
                        </TableCell>
                        <TableCell data-testid={`text-reorder-${product._id}`}>{product.reorderLevel}</TableCell>
                        <TableCell data-testid={`text-price-${product._id}`}>₹{product.sellingPrice}</TableCell>
                        <TableCell>{getStatusBadge(product.status)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Hierarchy Setup Tab */}
        <TabsContent value="hierarchy" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Brands */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Building2 className="h-5 w-5" /> Brands
                  </CardTitle>
                  <Dialog open={brandDialog} onOpenChange={setBrandDialog}>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline" data-testid="button-add-brand">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Brand</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Brand Name *</Label>
                          <Input
                            value={brandForm.name}
                            onChange={(e) => setBrandForm({ ...brandForm, name: e.target.value })}
                            placeholder="e.g., Toyota, Hyundai"
                            data-testid="input-brand-name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Description</Label>
                          <Textarea
                            value={brandForm.description}
                            onChange={(e) => setBrandForm({ ...brandForm, description: e.target.value })}
                            data-testid="textarea-brand-description"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={() => createBrandMutation.mutate(brandForm)} data-testid="button-save-brand">
                          Save
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {brandsLoading ? (
                    <Skeleton className="h-8 w-full" />
                  ) : brands.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No brands added</p>
                  ) : (
                    brands.map(brand => (
                      <div key={brand._id} className="flex justify-between items-center p-2 border rounded" data-testid={`item-brand-${brand._id}`}>
                        <span data-testid={`text-brand-${brand._id}`}>{brand.name}</span>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Models */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Car className="h-5 w-5" /> Models
                  </CardTitle>
                  <Dialog open={modelDialog} onOpenChange={setModelDialog}>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline" data-testid="button-add-model">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Model</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Brand *</Label>
                          <Select value={modelForm.brandId} onValueChange={handleBrandChange}>
                            <SelectTrigger data-testid="select-model-brand">
                              <SelectValue placeholder="Select brand" />
                            </SelectTrigger>
                            <SelectContent>
                              {brands.map(brand => (
                                <SelectItem key={brand._id} value={brand._id}>{brand.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Model Name *</Label>
                          <Input
                            value={modelForm.name}
                            onChange={(e) => setModelForm({ ...modelForm, name: e.target.value })}
                            placeholder="e.g., Innova, i20"
                            data-testid="input-model-name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Description</Label>
                          <Textarea
                            value={modelForm.description}
                            onChange={(e) => setModelForm({ ...modelForm, description: e.target.value })}
                            data-testid="textarea-model-description"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={() => createModelMutation.mutate(modelForm)} data-testid="button-save-model">
                          Save
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {modelsLoading ? (
                    <Skeleton className="h-8 w-full" />
                  ) : models.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No models added</p>
                  ) : (
                    models.map(model => (
                      <div key={model._id} className="p-2 border rounded" data-testid={`item-model-${model._id}`}>
                        <div className="font-medium" data-testid={`text-model-${model._id}`}>{model.name}</div>
                        <div className="text-xs text-muted-foreground">{model.brandName}</div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Variants */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Layers className="h-5 w-5" /> Variants
                  </CardTitle>
                  <Dialog open={variantDialog} onOpenChange={setVariantDialog}>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline" data-testid="button-add-variant">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Variant</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Model *</Label>
                          <Select value={variantForm.modelId} onValueChange={handleModelChange}>
                            <SelectTrigger data-testid="select-variant-model">
                              <SelectValue placeholder="Select model" />
                            </SelectTrigger>
                            <SelectContent>
                              {models.map(model => (
                                <SelectItem key={model._id} value={model._id}>
                                  {model.brandName} - {model.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Variant Type *</Label>
                          <Select value={variantForm.name} onValueChange={(val) => setVariantForm({ ...variantForm, name: val })}>
                            <SelectTrigger data-testid="select-variant-type">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Base">Base</SelectItem>
                              <SelectItem value="Mid">Mid</SelectItem>
                              <SelectItem value="Top">Top</SelectItem>
                              <SelectItem value="Custom">Custom</SelectItem>
                              <SelectItem value="Standard">Standard</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={() => createVariantMutation.mutate(variantForm)} data-testid="button-save-variant">
                          Save
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {variantsLoading ? (
                    <Skeleton className="h-8 w-full" />
                  ) : variants.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No variants added</p>
                  ) : (
                    variants.map(variant => (
                      <div key={variant._id} className="p-2 border rounded" data-testid={`item-variant-${variant._id}`}>
                        <div className="font-medium" data-testid={`text-variant-${variant._id}`}>{variant.name}</div>
                        <div className="text-xs text-muted-foreground">{variant.brandName} {variant.modelName}</div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Categories */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Tag className="h-5 w-5" /> Categories
                  </CardTitle>
                  <Dialog open={categoryDialog} onOpenChange={setCategoryDialog}>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline" data-testid="button-add-category">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Category</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Category Name *</Label>
                          <Input
                            value={categoryForm.name}
                            onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                            placeholder="e.g., Seat Cover, Floor Mat"
                            data-testid="input-category-name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Description</Label>
                          <Textarea
                            value={categoryForm.description}
                            onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                            data-testid="textarea-category-description"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={() => createCategoryMutation.mutate(categoryForm)} data-testid="button-save-category">
                          Save
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {categoriesLoading ? (
                    <Skeleton className="h-8 w-full" />
                  ) : categories.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No categories added</p>
                  ) : (
                    categories.map(category => (
                      <div key={category._id} className="flex justify-between items-center p-2 border rounded" data-testid={`item-category-${category._id}`}>
                        <span data-testid={`text-category-${category._id}`}>{category.name}</span>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Product Ranges */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Layers className="h-5 w-5" /> Product Ranges
                  </CardTitle>
                  <Dialog open={rangeDialog} onOpenChange={setRangeDialog}>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline" data-testid="button-add-range">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Product Range</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Range Name *</Label>
                          <Input
                            value={rangeForm.name}
                            onChange={(e) => setRangeForm({ ...rangeForm, name: e.target.value })}
                            placeholder="e.g., Leather, Fabric, Premium"
                            data-testid="input-range-name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Description</Label>
                          <Textarea
                            value={rangeForm.description}
                            onChange={(e) => setRangeForm({ ...rangeForm, description: e.target.value })}
                            data-testid="textarea-range-description"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={() => createRangeMutation.mutate(rangeForm)} data-testid="button-save-range">
                          Save
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {rangesLoading ? (
                    <Skeleton className="h-8 w-full" />
                  ) : ranges.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No ranges added</p>
                  ) : (
                    ranges.map(range => (
                      <div key={range._id} className="flex justify-between items-center p-2 border rounded" data-testid={`item-range-${range._id}`}>
                        <span data-testid={`text-range-${range._id}`}>{range.name}</span>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Vendors Tab */}
        <TabsContent value="vendors" className="space-y-4">
          <div className="flex justify-end">
            <Dialog open={vendorDialog} onOpenChange={setVendorDialog}>
              <DialogTrigger asChild>
                <Button data-testid="button-add-vendor">
                  <Plus className="mr-2 h-4 w-4" /> Add Vendor
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Vendor</DialogTitle>
                  <DialogDescription>Add vendor details for inventory management</DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Vendor Name *</Label>
                    <Input
                      value={vendorForm.name}
                      onChange={(e) => setVendorForm({ ...vendorForm, name: e.target.value })}
                      data-testid="input-vendor-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Contact Person</Label>
                    <Input
                      value={vendorForm.contactPerson}
                      onChange={(e) => setVendorForm({ ...vendorForm, contactPerson: e.target.value })}
                      data-testid="input-vendor-contact"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Mobile Number *</Label>
                    <Input
                      value={vendorForm.mobileNumber}
                      onChange={(e) => setVendorForm({ ...vendorForm, mobileNumber: e.target.value })}
                      data-testid="input-vendor-mobile"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={vendorForm.email}
                      onChange={(e) => setVendorForm({ ...vendorForm, email: e.target.value })}
                      data-testid="input-vendor-email"
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label>Address</Label>
                    <Input
                      value={vendorForm.address}
                      onChange={(e) => setVendorForm({ ...vendorForm, address: e.target.value })}
                      data-testid="input-vendor-address"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>City</Label>
                    <Input
                      value={vendorForm.city}
                      onChange={(e) => setVendorForm({ ...vendorForm, city: e.target.value })}
                      data-testid="input-vendor-city"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>State</Label>
                    <Input
                      value={vendorForm.state}
                      onChange={(e) => setVendorForm({ ...vendorForm, state: e.target.value })}
                      data-testid="input-vendor-state"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Pin Code</Label>
                    <Input
                      value={vendorForm.pinCode}
                      onChange={(e) => setVendorForm({ ...vendorForm, pinCode: e.target.value })}
                      data-testid="input-vendor-pincode"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>GST Number</Label>
                    <Input
                      value={vendorForm.gstNumber}
                      onChange={(e) => setVendorForm({ ...vendorForm, gstNumber: e.target.value })}
                      data-testid="input-vendor-gst"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={() => createVendorMutation.mutate(vendorForm)} data-testid="button-save-vendor">
                    Create Vendor
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vendor Name</TableHead>
                    <TableHead>Contact Person</TableHead>
                    <TableHead>Mobile</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>City / State</TableHead>
                    <TableHead>GST Number</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vendorsLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                      </TableRow>
                    ))
                  ) : vendors.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground">
                        No vendors found
                      </TableCell>
                    </TableRow>
                  ) : (
                    vendors.map((vendor) => (
                      <TableRow key={vendor._id} data-testid={`row-vendor-${vendor._id}`}>
                        <TableCell className="font-medium" data-testid={`text-vendor-name-${vendor._id}`}>{vendor.name}</TableCell>
                        <TableCell data-testid={`text-vendor-contact-${vendor._id}`}>{vendor.contactPerson || '-'}</TableCell>
                        <TableCell data-testid={`text-vendor-mobile-${vendor._id}`}>{vendor.mobileNumber}</TableCell>
                        <TableCell data-testid={`text-vendor-email-${vendor._id}`}>{vendor.email || '-'}</TableCell>
                        <TableCell data-testid={`text-vendor-location-${vendor._id}`}>
                          {vendor.city && vendor.state ? `${vendor.city}, ${vendor.state}` : vendor.city || vendor.state || '-'}
                        </TableCell>
                        <TableCell data-testid={`text-vendor-gst-${vendor._id}`}>{vendor.gstNumber || '-'}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Low Stock Tab */}
        <TabsContent value="low-stock" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Low Stock Products
              </CardTitle>
              <CardDescription>Products that have reached or fallen below reorder level</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SKU</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Brand / Model</TableHead>
                    <TableHead>Current Stock</TableHead>
                    <TableHead>Reorder Level</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Vendor Contact</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lowStockProducts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground">
                        No low stock products
                      </TableCell>
                    </TableRow>
                  ) : (
                    lowStockProducts.map((product) => (
                      <TableRow key={product._id} data-testid={`row-low-stock-${product._id}`}>
                        <TableCell className="font-mono" data-testid={`text-low-sku-${product._id}`}>{product.sku}</TableCell>
                        <TableCell data-testid={`text-low-product-${product._id}`}>{product.productName}</TableCell>
                        <TableCell data-testid={`text-low-brand-${product._id}`}>{product.brandName} {product.modelName}</TableCell>
                        <TableCell className="text-orange-500 font-semibold" data-testid={`text-low-current-${product._id}`}>
                          {product.stockQty}
                        </TableCell>
                        <TableCell data-testid={`text-low-reorder-${product._id}`}>{product.reorderLevel}</TableCell>
                        <TableCell data-testid={`text-low-vendor-${product._id}`}>{product.vendorId?.name || '-'}</TableCell>
                        <TableCell data-testid={`text-low-contact-${product._id}`}>{product.vendorId?.mobileNumber || '-'}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Stock Movements Tab */}
        <TabsContent value="movements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Stock Movement History</CardTitle>
              <CardDescription>Track all inventory stock movements</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Change</TableHead>
                    <TableHead>Before</TableHead>
                    <TableHead>After</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead>Performed By</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {movements.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-muted-foreground">
                        No stock movements recorded
                      </TableCell>
                    </TableRow>
                  ) : (
                    movements.slice(0, 50).map((movement) => (
                      <TableRow key={movement._id} data-testid={`row-movement-${movement._id}`}>
                        <TableCell data-testid={`text-movement-date-${movement._id}`}>
                          {format(new Date(movement.transactionDate), "dd MMM yyyy HH:mm")}
                        </TableCell>
                        <TableCell data-testid={`text-movement-product-${movement._id}`}>{movement.productName}</TableCell>
                        <TableCell data-testid={`text-movement-type-${movement._id}`}>
                          <Badge variant={movement.type === 'sale' ? 'destructive' : 'default'}>
                            {movement.type}
                          </Badge>
                        </TableCell>
                        <TableCell data-testid={`text-movement-change-${movement._id}`}>
                          <span className={movement.quantityChange > 0 ? 'text-green-600' : 'text-red-600'}>
                            {movement.quantityChange > 0 ? '+' : ''}{movement.quantityChange}
                          </span>
                        </TableCell>
                        <TableCell data-testid={`text-movement-before-${movement._id}`}>{movement.quantityBefore}</TableCell>
                        <TableCell data-testid={`text-movement-after-${movement._id}`}>{movement.quantityAfter}</TableCell>
                        <TableCell data-testid={`text-movement-ref-${movement._id}`}>{movement.referenceNumber || '-'}</TableCell>
                        <TableCell data-testid={`text-movement-user-${movement._id}`}>{movement.performedByName}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
