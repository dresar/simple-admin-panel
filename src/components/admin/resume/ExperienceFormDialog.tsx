import React, { useState } from 'react';
import { Button, Input } from '@/components/admin/common';
import { useCreateExperience, useUpdateExperience } from '@/hooks/useResume';
import { X, Save } from 'lucide-react';
import type { Experience } from '@/types/models';

interface ExperienceFormDialogProps {
  item: Experience | null;
  onClose: () => void;
}

export function ExperienceFormDialog({ item, onClose }: ExperienceFormDialogProps) {
  const createExp = useCreateExperience();
  const updateExp = useUpdateExperience();
  
  const [formData, setFormData] = useState({
    company: item?.company || '',
    position: item?.position || '',
    description: item?.description || '',
    start_date: item?.start_date || '',
    end_date: item?.end_date || '',
    is_current: item?.is_current || false,
    location: item?.location || '',
  });
  
  const [logo, setLogo] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        fd.append(key, String(value));
      });
      if (logo) fd.append('logo', logo);

      if (item) {
        await updateExp.mutateAsync({ id: item.id, formData: fd });
      } else {
        await createExp.mutateAsync(fd);
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
          <h2 className="text-lg font-semibold">{item ? 'Edit Experience' : 'Add Experience'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-md"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <Input label="Company" name="company" value={formData.company} onChange={handleChange} required />
          <Input label="Position" name="position" value={formData.position} onChange={handleChange} required />
          <Input label="Location" name="location" value={formData.location} onChange={handleChange} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Start Date" name="start_date" type="date" value={formData.start_date} onChange={handleChange} required />
            <Input label="End Date" name="end_date" type="date" value={formData.end_date} onChange={handleChange} disabled={formData.is_current} />
          </div>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="is_current" checked={formData.is_current} onChange={handleChange} className="rounded border-input" />
            <span className="text-sm">Currently working here</span>
          </label>
          <div>
            <label className="admin-form-label">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full px-3 py-2 border border-input rounded-md bg-background resize-none" />
          </div>
          <div>
            <label className="admin-form-label">Company Logo</label>
            <input type="file" accept="image/*" onChange={(e) => setLogo(e.target.files?.[0] || null)} className="w-full text-sm" />
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
