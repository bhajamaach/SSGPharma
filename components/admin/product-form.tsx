'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type ProductFormData = {
  name: string;
  slug: string;
  categoryId: string;
  manufacturer: string;
  isActive: boolean;
  pricePaise: number;
  mrpPaise: number;
  dosage: string;
  packSize: string;
  salts: string;
  description: string;
  keyBenefits: string;
  goodToKnow: string;
  dietType: string;
  productForm: string;
  allergiesInformation: string;
  directionForUse: string;
  safetyInformation: string;
  schema: string;
  specialBenefitSchemes: string;
  faqs: string;
  imageUrl1: string;
  imageUrl2: string;
  imageUrl3: string;
};

type ProductImageKey = 'imageUrl1' | 'imageUrl2' | 'imageUrl3';

type CategoryOption = {
  id: string;
  name: string;
};

interface ProductFormProps {
  productId?: string;
  onSave: (data: ProductFormData) => Promise<void>;
  onCancel: () => void;
}

export function ProductForm({ productId, onSave, onCancel }: ProductFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    slug: '',
    categoryId: '',
    manufacturer: '',
    isActive: true,
    pricePaise: 0,
    mrpPaise: 0,
    dosage: '',
    packSize: '',
    salts: '',
    description: '',
    keyBenefits: '',
    goodToKnow: '',
    dietType: '',
    productForm: '',
    allergiesInformation: '',
    directionForUse: '',
    safetyInformation: '',
    schema: '',
    specialBenefitSchemes: '',
    faqs: '',
    imageUrl1: '',
    imageUrl2: '',
    imageUrl3: '',
  });
  const [categories, setCategories] = useState<CategoryOption[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/admin/categories');
        if (res.ok) setCategories((await res.json()) as CategoryOption[]);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };

    const fetchProductData = async () => {
      if (!productId) return;

      try {
        const res = await fetch(`/api/admin/products/${productId}`);
        if (res.ok) {
          const product = (await res.json()) as ProductFormData;
          setFormData(product);
        }
      } catch (err) {
        console.error('Failed to fetch product:', err);
      }
    };

    void fetchCategories();
    void fetchProductData();
  }, [productId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.currentTarget;
    const { name } = target;
    const nextValue = target instanceof HTMLInputElement && target.type === 'checkbox' ? target.checked : target.value;
    setFormData(prev => ({
      ...prev,
      [name]: nextValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(formData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <fieldset className="border p-4 rounded-lg space-y-4">
        <legend className="font-bold">Basic Information</legend>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" name="slug" value={formData.slug} onChange={handleChange} required />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="categoryId">Category</Label>
            <select
              id="categoryId"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="manufacturer">Manufacturer</Label>
            <Input id="manufacturer" name="manufacturer" value={formData.manufacturer} onChange={handleChange} />
          </div>
        </div>
        <div>
          <Label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
            />
            Is Active
          </Label>
        </div>
      </fieldset>

      {/* Pricing and Packaging */}
      <fieldset className="border p-4 rounded-lg space-y-4">
        <legend className="font-bold">Pricing and Packaging</legend>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="pricePaise">Price (in paise)</Label>
            <Input
              id="pricePaise"
              name="pricePaise"
              type="number"
              value={formData.pricePaise}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="mrpPaise">MRP (in paise)</Label>
            <Input
              id="mrpPaise"
              name="mrpPaise"
              type="number"
              value={formData.mrpPaise}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="dosage">Dosage</Label>
            <Input id="dosage" name="dosage" value={formData.dosage} onChange={handleChange} placeholder="e.g. 100mg" />
          </div>
          <div>
            <Label htmlFor="packSize">Pack Size</Label>
            <Input id="packSize" name="packSize" value={formData.packSize} onChange={handleChange} placeholder="e.g. 30 tablets" />
          </div>
        </div>
        <div>
          <Label htmlFor="salts">Salt</Label>
          <Input id="salts" name="salts" value={formData.salts} onChange={handleChange} />
        </div>
      </fieldset>

      {/* Product Details */}
      <fieldset className="border p-4 rounded-lg space-y-4">
        <legend className="font-bold">Product Details</legend>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" value={formData.description} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="keyBenefits">Key Benefits</Label>
          <Textarea id="keyBenefits" name="keyBenefits" value={formData.keyBenefits} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="goodToKnow">Good to Know</Label>
          <Textarea id="goodToKnow" name="goodToKnow" value={formData.goodToKnow} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="dietType">Diet Type</Label>
          <Input id="dietType" name="dietType" value={formData.dietType} onChange={handleChange} placeholder="e.g. Vegetarian, Vegan, Non-Vegetarian" />
        </div>
        <div>
          <Label htmlFor="productForm">Product Form</Label>
          <Input id="productForm" name="productForm" value={formData.productForm} onChange={handleChange} placeholder="e.g. Tablet, Capsule, Powder, Liquid" />
        </div>
        <div>
          <Label htmlFor="allergiesInformation">Allergies Information</Label>
          <Textarea id="allergiesInformation" name="allergiesInformation" value={formData.allergiesInformation} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="directionForUse">Direction for Use</Label>
          <Textarea id="directionForUse" name="directionForUse" value={formData.directionForUse} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="safetyInformation">Safety Information</Label>
          <Textarea id="safetyInformation" name="safetyInformation" value={formData.safetyInformation} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="schema">Schema</Label>
          <Textarea id="schema" name="schema" value={formData.schema} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="specialBenefitSchemes">Special Patient Benefits Schemes</Label>
          <Textarea
            id="specialBenefitSchemes"
            name="specialBenefitSchemes"
            value={formData.specialBenefitSchemes}
            onChange={handleChange}
            placeholder="Enter each scheme on a new line (e.g. 1+1 Free vial Scheme)"
          />
        </div>
        <div>
          <Label htmlFor="faqs">FAQs</Label>
          <Textarea id="faqs" name="faqs" value={formData.faqs} onChange={handleChange} />
        </div>
      </fieldset>

      {/* Images */}
      <fieldset className="border p-4 rounded-lg space-y-4">
        <legend className="font-bold">Images</legend>
        <p className="text-sm text-gray-600">Upload up to three images of the product</p>
        {[1, 2, 3].map((num) => (
          <div key={num}>
            {(() => {
              const imageKey = `imageUrl${num}` as ProductImageKey;
              const imageUrl = formData[imageKey];

              return (
                <>
            <Label htmlFor={`imageUrl${num}`}>Image {num}</Label>
            {imageUrl && (
              <div className="mb-2">
                <p className="text-sm">Currently: <a href={imageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View</a></p>
                <Button variant="outline" size="sm" onClick={() => setFormData(prev => ({ ...prev, [imageKey]: '' }))}>
                  Clear
                </Button>
              </div>
            )}
            <Input
              id={`imageUrl${num}`}
              name={`imageUrl${num}`}
              type="url"
              value={imageUrl}
              onChange={handleChange}
              placeholder="Image URL"
            />
                </>
              );
            })()}
          </div>
        ))}
      </fieldset>

      {/* Timestamps */}
      <div className="border p-4 rounded-lg">
        <p className="text-sm text-gray-600">Created at: {productId ? new Date().toLocaleString() : 'N/A'}</p>
      </div>

      {/* Form Actions */}
      <div className="flex gap-2">
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
