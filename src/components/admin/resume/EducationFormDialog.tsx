import React, { useState } from 'react';
import { Button, Input } from '@/components/admin/common';
import { useCreateEducation, useUpdateEducation } from '@/hooks/useResume';
import { X, Save } from 'lucide-react';
import type { Education } from '@/types/models';

interface EducationFormDialogProps {
  item: Education | null;
  onClose: () => void;
}

export function EducationFormDialog({ item, onClose }: EducationFormDialogProps) {
  const createEdu = useCreateEducation();
  const updateEdu = useUpdateEducation();
  
  const [formData, setFormData] = useState({
    institution: item?.institution || '',
    degree: item?.degree || '',
    field_of_study: item?.field_of_study || '',
    description: item?.description || '',
    start_date: item?.start_date || '',
    end_date: item?.end_date || '',
    is_current: item?.is_current || false,
    gpa: item?.gpa || '',
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
        await updateEdu.mutateAsync({ id: item.id, formData: fd });
      } else {
        await createEdu.mutateAsync(fd);
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
          <h2 className="text-lg font-semibold">{item ? 'Edit Education' : 'Add Education'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-md"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <Input label="Institution" name="institution" value={formData.institution} onChange={handleChange} required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Degree" name="degree" value={formData.degree} onChange={handleChange} required />
            <Input label="Field of Study" name="field_of_study" value={formData.field_of_study} onChange={handleChange} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Start Date" name="start_date" type="date" value={formData.start_date} onChange={handleChange} required />
            <Input label="End Date" name="end_date" type="date" value={formData.end_date} onChange={handleChange} disabled={formData.is_current} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center gap-2">
              <input type="checkbox" name="is_current" checked={formData.is_current} onChange={handleChange} className="rounded border-input" />
              <span className="text-sm">Currently studying</span>
            </label>
            <Input label="GPA" name="gpa" value={formData.gpa} onChange={handleChange} placeholder="3.8/4.0" />
          </div>
          <div>
            <label className="admin-form-label">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full px-3 py-2 border border-input rounded-md bg-background resize-none" />
          </div>
          <div>
            <label className="admin-form-label">Institution Logo</label>
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
