import React, { useState } from 'react';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { PageHeader, Card, CardHeader, Button, Input, EmptyState } from '@/components/admin/common';
import { PageLoader } from '@/components/admin/common/LoadingSpinner';
import { useSubscribers, useDeleteSubscriber, useCreateSubscriber } from '@/hooks/useInbox';
import { Mail, Download, Plus, Trash2, UserCheck, UserX, X, Save } from 'lucide-react';
import type { Subscriber } from '@/types/models';

export default function SubscribersPage() {
  const { data: subscribers, isLoading } = useSubscribers();
  const deleteSubscriber = useDeleteSubscriber();
  const createSubscriber = useCreateSubscriber();
  
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ email: '', name: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleExportCSV = () => {
    if (!subscribers?.length) return;
    const csv = [
      'Email,Name,Status,Subscribed At',
      ...subscribers.map(s => 
        `${s.email},${s.name || ''},${s.is_active ? 'Active' : 'Inactive'},${s.created_at}`
      )
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subscribers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Remove this subscriber?')) {
      await deleteSubscriber.mutateAsync(id);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createSubscriber.mutateAsync(formData);
      setFormData({ email: '', name: '' });
      setShowForm(false);
    } catch (err) {
      console.error('Failed to add subscriber:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeCount = subscribers?.filter(s => s.is_active).length || 0;

  return (
    <AdminLayout>
      <PageHeader
        title="Subscribers"
        description={`${activeCount} active subscriber${activeCount !== 1 ? 's' : ''}`}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" leftIcon={<Download className="w-4 h-4" />} onClick={handleExportCSV} disabled={!subscribers?.length}>
              Export CSV
            </Button>
            <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => setShowForm(true)}>
              Add Subscriber
            </Button>
          </div>
        }
      />

      {isLoading ? (
        <PageLoader />
      ) : !subscribers?.length ? (
        <Card>
          <EmptyState
            icon={Mail}
            title="No subscribers yet"
            description="Subscribers will appear here when visitors sign up"
          />
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Email</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Name</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Subscribed</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((sub) => (
                  <tr key={sub.id} className="border-b border-border last:border-0">
                    <td className="py-3 px-4">
                      <span className="text-sm">{sub.email}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-muted-foreground">{sub.name || '-'}</span>
                    </td>
                    <td className="py-3 px-4">
                      {sub.is_active ? (
                        <span className="inline-flex items-center gap-1 text-xs text-green-600">
                          <UserCheck className="w-3 h-3" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <UserX className="w-3 h-3" /> Inactive
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-muted-foreground">
                        {new Date(sub.created_at).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(sub.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Add Subscriber Dialog */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-background w-full max-w-md rounded-lg shadow-lg">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-semibold">Add Subscriber</h2>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-muted rounded-md">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
              />
              <Input
                label="Name (optional)"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                <Button type="submit" isLoading={isSubmitting} leftIcon={<Save className="w-4 h-4" />}>
                  Add
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
