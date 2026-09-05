import React from 'react';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { PageHeader, Card, CardHeader, Input, Button } from '@/components/admin/common';
import { Settings, Globe, Wrench, Bot } from 'lucide-react';

export default function SettingsPage() {
  return (
    <AdminLayout>
      <PageHeader
        title="Settings"
        description="Global application settings"
      />
      
      <div className="space-y-6 max-w-2xl">
        {/* SEO Settings */}
        <Card>
          <CardHeader 
            title="SEO Settings"
            action={<Globe className="w-5 h-5 text-muted-foreground" />}
          />
          <form className="admin-form">
            <Input
              label="Site Title"
              placeholder="Your Portfolio Name"
              helperText="This appears in browser tabs and search results"
            />
            <Input
              label="Meta Description"
              placeholder="A brief description of your portfolio"
            />
            <Input
              label="Keywords"
              placeholder="portfolio, developer, web"
              helperText="Comma-separated keywords"
            />
            <Button type="submit">Save SEO Settings</Button>
          </form>
        </Card>

        {/* Maintenance Mode */}
        <Card>
          <CardHeader 
            title="Maintenance Mode"
            action={<Wrench className="w-5 h-5 text-muted-foreground" />}
          />
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div>
              <p className="text-sm font-medium">Enable Maintenance Mode</p>
              <p className="text-xs text-muted-foreground">
                Visitors will see a maintenance page
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-muted-foreground/30 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-ring rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </Card>

        {/* AI Provider */}
        <Card>
          <CardHeader 
            title="AI Provider"
            action={<Bot className="w-5 h-5 text-muted-foreground" />}
          />
          <div className="space-y-3">
            <label className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-muted/50">
              <input type="radio" name="ai-provider" className="text-primary" defaultChecked />
              <div>
                <p className="text-sm font-medium">Google Gemini</p>
                <p className="text-xs text-muted-foreground">Use Google's Gemini AI</p>
              </div>
            </label>
            <label className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-muted/50">
              <input type="radio" name="ai-provider" className="text-primary" />
              <div>
                <p className="text-sm font-medium">Groq</p>
                <p className="text-xs text-muted-foreground">Use Groq's fast inference</p>
              </div>
            </label>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
