import React, { useState } from 'react';
import { Button, Input } from '@/components/admin/common';
import { useCreateCertificate, useUpdateCertificate, useCertificateCategories } from '@/hooks/useResume';
import { X, Save } from 'lucide-react';
import type { Certificate } from '@/types/models';

interface CertificateFormDialogProps {
  item: Certificate | null;
  onClose: () => void;
}

export function CertificateFormDialog({ item, onClose }: CertificateFormDialogProps) {
  const { data: categories } = useCertificateCategories();
  const createCert = useCreateCertificate();
  const updateCert = useUpdateCertificate();
  
  const [formData, setFormData] = useState({
    name: item?.name || '',
    issuer: item?.issuer || '',
    issue_date: item?.issue_date || '',
    expiry_date: item?.expiry_date || '',
    credential_id: item?.credential_id || '',
    credential_url: item?.credential_url || '',
    category_id: item?.category_id || '',
  });
  
  const [image, setImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) fd.append(key, String(value));
      });
      if (image) fd.append('image', image);

      if (item) {
        await updateCert.mutateAsync({ id: item.id, formData: fd });
      } else {
        await createCert.mutateAsync(fd);
      }
      onClose();
    } catch (err) {
      console.error('Submit failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-background w-full max-w-lg rounded-lg shadow-lg">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold">{item ? 'Edit Certificate' : 'Add Certificate'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-md"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <Input label="Certificate Name" name="name" value={formData.name} onChange={handleChange} required />
          <Input label="Issuing Organization" name="issuer" value={formData.issuer} onChange={handleChange} required />
          <div>
            <label className="admin-form-label">Category</label>
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-md bg-background"
            >
              <option value="">Select Category</option>
              {categories?.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Issue Date" name="issue_date" type="date" value={formData.issue_date} onChange={handleChange} required />
            <Input label="Expiry Date" name="expiry_date" type="date" value={formData.expiry_date} onChange={handleChange} />
          </div>
          <Input label="Credential ID" name="credential_id" value={formData.credential_id} onChange={handleChange} />
          <Input label="Credential URL" name="credential_url" type="url" value={formData.credential_url} onChange={handleChange} />
          <div>
            <label className="admin-form-label">Certificate Image</label>
            <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} className="w-full text-sm" />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" isLoading={isSubmitting} leftIcon={<Save className="w-4 h-4" />}>
              {item ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
