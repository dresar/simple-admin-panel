import React, { useState } from 'react';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { PageHeader, Card, CardHeader, Button, Input, EmptyState } from '@/components/admin/common';
import { PageLoader } from '@/components/admin/common/LoadingSpinner';
import { useBlockEntries, useCreateBlockEntry, useDeleteBlockEntry, useAIKeys, useAddAIKey, useDeleteAIKey, useTestAIKey } from '@/hooks/useSettings';
import { Shield, Ban, Key, Plus, Trash2, X, Save, CheckCircle, AlertCircle } from 'lucide-react';

export default function SecurityPage() {
  const { data: blockEntries, isLoading: blocksLoading } = useBlockEntries();
  const { data: aiKeys, isLoading: keysLoading } = useAIKeys();
  const createBlock = useCreateBlockEntry();
  const deleteBlock = useDeleteBlockEntry();
  const addKey = useAddAIKey();
  const deleteKey = useDeleteAIKey();
  const testKey = useTestAIKey();
  
  const [showBlockForm, setShowBlockForm] = useState(false);
  const [showKeyForm, setShowKeyForm] = useState(false);
  const [blockForm, setBlockForm] = useState({ type: 'ip' as 'ip' | 'domain', value: '', reason: '' });
  const [keyForm, setKeyForm] = useState({ provider: '', key: '' });
  const [testResults, setTestResults] = useState<Record<number, boolean | null>>({});

  const isLoading = blocksLoading || keysLoading;

  const handleAddBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    await createBlock.mutateAsync(blockForm);
    setBlockForm({ type: 'ip', value: '', reason: '' });
    setShowBlockForm(false);
  };

  const handleAddKey = async (e: React.FormEvent) => {
    e.preventDefault();
    await addKey.mutateAsync(keyForm);
    setKeyForm({ provider: '', key: '' });
    setShowKeyForm(false);
  };

  const handleTestKey = async (id: number) => {
    setTestResults(prev => ({ ...prev, [id]: null }));
    try {
      const result = await testKey.mutateAsync(id);
      setTestResults(prev => ({ ...prev, [id]: result.success }));
    } catch {
      setTestResults(prev => ({ ...prev, [id]: false }));
    }
  };

  return (
    <AdminLayout>
      <PageHeader title="Security" description="Security settings and access control" />

      {isLoading ? <PageLoader /> : (
        <div className="space-y-6">
          {/* Block List */}
          <Card>
            <CardHeader 
              title="Block List" 
              description="Block suspicious IP addresses and domains"
              action={<Button variant="outline" size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setShowBlockForm(true)}>Add</Button>}
            />
            {!blockEntries?.length ? (
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                <Ban className="w-5 h-5 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">No blocked IPs or domains</p>
              </div>
            ) : (
              <div className="space-y-2">
                {blockEntries.map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div>
                      <span className="text-xs px-2 py-0.5 bg-muted rounded mr-2">{entry.type.toUpperCase()}</span>
                      <span className="font-mono text-sm">{entry.value}</span>
                      {entry.reason && <p className="text-xs text-muted-foreground mt-1">{entry.reason}</p>}
                    </div>
                    <Button variant="ghost" size="sm" className="text-destructive" onClick={() => deleteBlock.mutate(entry.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* AI Keys */}
          <Card>
            <CardHeader 
              title="AI API Keys" 
              description="Manage API keys for AI providers"
              action={<Button variant="outline" size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setShowKeyForm(true)}>Add Key</Button>}
            />
            {!aiKeys?.length ? (
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                <Key className="w-5 h-5 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">No AI keys configured</p>
              </div>
            ) : (
              <div className="space-y-2">
                {aiKeys.map((key) => (
                  <div key={key.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Key className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{key.provider}</p>
                        <p className="text-xs text-muted-foreground font-mono">{key.key_preview}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {testResults[key.id] === true && <CheckCircle className="w-4 h-4 text-green-500" />}
                      {testResults[key.id] === false && <AlertCircle className="w-4 h-4 text-destructive" />}
                      <Button variant="ghost" size="sm" onClick={() => handleTestKey(key.id)}>Test</Button>
                      <Button variant="ghost" size="sm" className="text-destructive" onClick={() => deleteKey.mutate(key.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Block Form Dialog */}
      {showBlockForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-background w-full max-w-md rounded-lg shadow-lg">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-semibold">Add Block Entry</h2>
              <button onClick={() => setShowBlockForm(false)} className="p-2 hover:bg-muted rounded-md"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAddBlock} className="p-4 space-y-4">
              <div>
                <label className="admin-form-label">Type</label>
                <select value={blockForm.type} onChange={(e) => setBlockForm(p => ({ ...p, type: e.target.value as 'ip' | 'domain' }))} className="w-full px-3 py-2 border border-input rounded-md bg-background">
                  <option value="ip">IP Address</option>
                  <option value="domain">Domain</option>
                </select>
              </div>
              <Input label="Value" value={blockForm.value} onChange={(e) => setBlockForm(p => ({ ...p, value: e.target.value }))} required placeholder={blockForm.type === 'ip' ? '192.168.1.1' : 'spam.com'} />
              <Input label="Reason (optional)" value={blockForm.reason} onChange={(e) => setBlockForm(p => ({ ...p, reason: e.target.value }))} />
              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <Button type="button" variant="outline" onClick={() => setShowBlockForm(false)}>Cancel</Button>
                <Button type="submit" leftIcon={<Save className="w-4 h-4" />}>Add</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Key Form Dialog */}
      {showKeyForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-background w-full max-w-md rounded-lg shadow-lg">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-semibold">Add AI Key</h2>
              <button onClick={() => setShowKeyForm(false)} className="p-2 hover:bg-muted rounded-md"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAddKey} className="p-4 space-y-4">
              <div>
                <label className="admin-form-label">Provider</label>
                <select value={keyForm.provider} onChange={(e) => setKeyForm(p => ({ ...p, provider: e.target.value }))} className="w-full px-3 py-2 border border-input rounded-md bg-background" required>
                  <option value="">Select Provider</option>
                  <option value="openai">OpenAI</option>
                  <option value="anthropic">Anthropic</option>
                  <option value="gemini">Google Gemini</option>
                  <option value="groq">Groq</option>
                </select>
              </div>
              <Input label="API Key" type="password" value={keyForm.key} onChange={(e) => setKeyForm(p => ({ ...p, key: e.target.value }))} required placeholder="sk-..." />
              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <Button type="button" variant="outline" onClick={() => setShowKeyForm(false)}>Cancel</Button>
                <Button type="submit" leftIcon={<Save className="w-4 h-4" />}>Add Key</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
