import React, { useState } from 'react';
import { Button, Input } from '@/components/admin/common';
import { useCreateSkill, useUpdateSkill, useSkillCategories } from '@/hooks/useResume';
import { X, Save } from 'lucide-react';
import type { Skill } from '@/types/models';

interface SkillFormDialogProps {
  item: Skill | null;
  onClose: () => void;
}

export function SkillFormDialog({ item, onClose }: SkillFormDialogProps) {
  const { data: categories } = useSkillCategories();
  const createSkill = useCreateSkill();
  const updateSkill = useUpdateSkill();
  
  const [formData, setFormData] = useState({
    name: item?.name || '',
    level: item?.level || 80,
    category_id: item?.category_id || '',
    icon: item?.icon || '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'range' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const data = {
        name: formData.name,
        level: formData.level,
        category_id: formData.category_id ? Number(formData.category_id) : undefined,
        icon: formData.icon || undefined,
      };

      if (item) {
        await updateSkill.mutateAsync({ id: item.id, data });
      } else {
        await createSkill.mutateAsync(data);
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
      <div className="bg-background w-full max-w-md rounded-lg shadow-lg">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold">{item ? 'Edit Skill' : 'Add Skill'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-md"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <Input label="Skill Name" name="name" value={formData.name} onChange={handleChange} required />
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
          <div>
            <label className="admin-form-label">Proficiency Level: {formData.level}%</label>
            <input
              type="range"
              name="level"
              min="0"
              max="100"
              value={formData.level}
              onChange={handleChange}
              className="w-full"
            />
            <div className="h-2 bg-muted rounded-full overflow-hidden mt-2">
              <div className="h-full bg-primary rounded-full" style={{ width: `${formData.level}%` }} />
            </div>
          </div>
          <Input label="Icon (optional)" name="icon" value={formData.icon} onChange={handleChange} placeholder="fa-react or icon URL" />
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
