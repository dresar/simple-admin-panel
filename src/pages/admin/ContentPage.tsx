import React, { useState } from 'react';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { PageHeader, Card, CardHeader, Button, Input, EmptyState } from '@/components/admin/common';
import { PageLoader } from '@/components/admin/common/LoadingSpinner';
import { useHomeContent, useUpdateHomeContent, useAboutContent, useUpdateAboutContent } from '@/hooks/useSettings';
import { Home, User, Save, Edit } from 'lucide-react';

type ContentTab = 'home' | 'about';

export default function ContentPage() {
  const { data: homeContent, isLoading: homeLoading } = useHomeContent();
  const { data: aboutContent, isLoading: aboutLoading } = useAboutContent();
  const updateHome = useUpdateHomeContent();
  const updateAbout = useUpdateAboutContent();
  
  const [activeTab, setActiveTab] = useState<ContentTab>('home');
  const [isEditing, setIsEditing] = useState(false);
  
  const [homeForm, setHomeForm] = useState({
    hero_title: '',
    hero_subtitle: '',
    hero_description: '',
    cta_text: '',
    cta_link: '',
  });
  
  const [aboutForm, setAboutForm] = useState({
    title: '',
    content: '',
  });
  
  const [heroImage, setHeroImage] = useState<File | null>(null);
  const [aboutImage, setAboutImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isLoading = homeLoading || aboutLoading;

  const handleEditHome = () => {
    if (homeContent) {
      setHomeForm({
        hero_title: homeContent.hero_title || '',
        hero_subtitle: homeContent.hero_subtitle || '',
        hero_description: homeContent.hero_description || '',
        cta_text: homeContent.cta_text || '',
        cta_link: homeContent.cta_link || '',
      });
    }
    setIsEditing(true);
  };

  const handleEditAbout = () => {
    if (aboutContent) {
      setAboutForm({
        title: aboutContent.title || '',
        content: aboutContent.content || '',
      });
    }
    setIsEditing(true);
  };

  const handleSaveHome = async () => {
    setIsSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(homeForm).forEach(([key, value]) => {
        fd.append(key, value);
      });
      if (heroImage) fd.append('hero_image', heroImage);
      await updateHome.mutateAsync(fd);
      setIsEditing(false);
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveAbout = async () => {
    setIsSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(aboutForm).forEach(([key, value]) => {
        fd.append(key, value);
      });
      if (aboutImage) fd.append('image', aboutImage);
      await updateAbout.mutateAsync(fd);
      setIsEditing(false);
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <PageHeader
        title="Page Content"
        description="Manage content for public pages"
      />

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => { setActiveTab('home'); setIsEditing(false); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
            activeTab === 'home' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
          }`}
        >
          <Home className="w-4 h-4" /> Home
        </button>
        <button
          onClick={() => { setActiveTab('about'); setIsEditing(false); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
            activeTab === 'about' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
          }`}
        >
          <User className="w-4 h-4" /> About
        </button>
      </div>

      {isLoading ? (
        <PageLoader />
      ) : (
        <>
          {/* Home Content */}
          {activeTab === 'home' && (
            <Card>
              <CardHeader
                title="Home Page Content"
                description="Hero section and featured content"
                action={
                  !isEditing ? (
                    <Button variant="outline" size="sm" leftIcon={<Edit className="w-4 h-4" />} onClick={handleEditHome}>
                      Edit
                    </Button>
                  ) : null
                }
              />
              
              {isEditing ? (
                <div className="space-y-4">
                  <Input
                    label="Hero Title"
                    value={homeForm.hero_title}
                    onChange={(e) => setHomeForm(prev => ({ ...prev, hero_title: e.target.value }))}
                  />
                  <Input
                    label="Hero Subtitle"
                    value={homeForm.hero_subtitle}
                    onChange={(e) => setHomeForm(prev => ({ ...prev, hero_subtitle: e.target.value }))}
                  />
                  <div>
                    <label className="admin-form-label">Hero Description</label>
                    <textarea
                      value={homeForm.hero_description}
                      onChange={(e) => setHomeForm(prev => ({ ...prev, hero_description: e.target.value }))}
                      rows={4}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background resize-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="CTA Text"
                      value={homeForm.cta_text}
                      onChange={(e) => setHomeForm(prev => ({ ...prev, cta_text: e.target.value }))}
                    />
                    <Input
                      label="CTA Link"
                      value={homeForm.cta_link}
                      onChange={(e) => setHomeForm(prev => ({ ...prev, cta_link: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="admin-form-label">Hero Image</label>
                    <input type="file" accept="image/*" onChange={(e) => setHeroImage(e.target.files?.[0] || null)} className="w-full text-sm" />
                    {homeContent?.hero_image && <img src={homeContent.hero_image} alt="Hero" className="mt-2 h-24 object-cover rounded" />}
                  </div>
                  <div className="flex justify-end gap-3 pt-4 border-t border-border">
                    <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                    <Button onClick={handleSaveHome} isLoading={isSubmitting} leftIcon={<Save className="w-4 h-4" />}>Save</Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div><span className="text-sm text-muted-foreground">Title:</span> <span className="font-medium">{homeContent?.hero_title || '-'}</span></div>
                  <div><span className="text-sm text-muted-foreground">Subtitle:</span> <span>{homeContent?.hero_subtitle || '-'}</span></div>
                  <div><span className="text-sm text-muted-foreground">Description:</span> <p className="text-sm mt-1">{homeContent?.hero_description || '-'}</p></div>
                  {homeContent?.hero_image && <img src={homeContent.hero_image} alt="Hero" className="h-32 object-cover rounded" />}
                </div>
              )}
            </Card>
          )}

          {/* About Content */}
          {activeTab === 'about' && (
            <Card>
              <CardHeader
                title="About Page Content"
                description="Your bio and personal information"
                action={
                  !isEditing ? (
                    <Button variant="outline" size="sm" leftIcon={<Edit className="w-4 h-4" />} onClick={handleEditAbout}>
                      Edit
                    </Button>
                  ) : null
                }
              />
              
              {isEditing ? (
                <div className="space-y-4">
                  <Input
                    label="Title"
                    value={aboutForm.title}
                    onChange={(e) => setAboutForm(prev => ({ ...prev, title: e.target.value }))}
                  />
                  <div>
                    <label className="admin-form-label">Content</label>
                    <textarea
                      value={aboutForm.content}
                      onChange={(e) => setAboutForm(prev => ({ ...prev, content: e.target.value }))}
                      rows={8}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background resize-none"
                    />
                  </div>
                  <div>
                    <label className="admin-form-label">About Image</label>
                    <input type="file" accept="image/*" onChange={(e) => setAboutImage(e.target.files?.[0] || null)} className="w-full text-sm" />
                    {aboutContent?.image && <img src={aboutContent.image} alt="About" className="mt-2 h-24 object-cover rounded" />}
                  </div>
                  <div className="flex justify-end gap-3 pt-4 border-t border-border">
                    <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                    <Button onClick={handleSaveAbout} isLoading={isSubmitting} leftIcon={<Save className="w-4 h-4" />}>Save</Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div><span className="text-sm text-muted-foreground">Title:</span> <span className="font-medium">{aboutContent?.title || '-'}</span></div>
                  <div><span className="text-sm text-muted-foreground">Content:</span> <p className="text-sm mt-1 whitespace-pre-wrap">{aboutContent?.content || '-'}</p></div>
                  {aboutContent?.image && <img src={aboutContent.image} alt="About" className="h-32 object-cover rounded" />}
                </div>
              )}
            </Card>
          )}
        </>
      )}
    </AdminLayout>
  );
}
