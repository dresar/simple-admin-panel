import React, { useState } from 'react';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { PageHeader, Card, CardHeader, Button, EmptyState } from '@/components/admin/common';
import { PageLoader } from '@/components/admin/common/LoadingSpinner';
import { useExperience, useEducation, useSkills, useCertificates, useDeleteExperience, useDeleteEducation, useDeleteSkill, useDeleteCertificate } from '@/hooks/useResume';
import { Plus, Briefcase, GraduationCap, Wrench, Award, Edit2, Trash2 } from 'lucide-react';
import { ExperienceFormDialog } from '@/components/admin/resume/ExperienceFormDialog';
import { EducationFormDialog } from '@/components/admin/resume/EducationFormDialog';
import { SkillFormDialog } from '@/components/admin/resume/SkillFormDialog';
import { CertificateFormDialog } from '@/components/admin/resume/CertificateFormDialog';

type Section = 'experience' | 'education' | 'skills' | 'certificates';

export default function ResumePage() {
  const { data: experience, isLoading: expLoading } = useExperience();
  const { data: education, isLoading: eduLoading } = useEducation();
  const { data: skills, isLoading: skillsLoading } = useSkills();
  const { data: certificates, isLoading: certsLoading } = useCertificates();
  
  const deleteExp = useDeleteExperience();
  const deleteEdu = useDeleteEducation();
  const deleteSkill = useDeleteSkill();
  const deleteCert = useDeleteCertificate();
  
  const [activeSection, setActiveSection] = useState<Section>('experience');
  const [showForm, setShowForm] = useState<Section | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);

  const isLoading = expLoading || eduLoading || skillsLoading || certsLoading;

  const handleCreate = (section: Section) => {
    setEditingItem(null);
    setShowForm(section);
  };

  const handleEdit = (section: Section, item: any) => {
    setEditingItem(item);
    setShowForm(section);
  };

  const handleCloseForm = () => {
    setShowForm(null);
    setEditingItem(null);
  };

  const sections = [
    { key: 'experience' as Section, title: 'Experience', icon: Briefcase, data: experience, onDelete: deleteExp },
    { key: 'education' as Section, title: 'Education', icon: GraduationCap, data: education, onDelete: deleteEdu },
    { key: 'skills' as Section, title: 'Skills', icon: Wrench, data: skills, onDelete: deleteSkill },
    { key: 'certificates' as Section, title: 'Certificates', icon: Award, data: certificates, onDelete: deleteCert },
  ];

  const activeData = sections.find(s => s.key === activeSection);

  return (
    <AdminLayout>
      <PageHeader
        title="Resume"
        description="Manage your professional resume sections"
      />

      {/* Section Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {sections.map((section) => (
          <button
            key={section.key}
            onClick={() => setActiveSection(section.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md whitespace-nowrap transition-colors ${
              activeSection === section.key
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80'
            }`}
          >
            <section.icon className="w-4 h-4" />
            {section.title}
            <span className="text-xs px-1.5 py-0.5 rounded-full bg-background/20">
              {section.data?.length || 0}
            </span>
          </button>
        ))}
      </div>

      {isLoading ? (
        <PageLoader />
      ) : (
        <Card>
          <CardHeader
            title={activeData?.title || ''}
            action={
              <Button size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => handleCreate(activeSection)}>
                Add {activeData?.title.slice(0, -1)}
              </Button>
            }
          />

          {!activeData?.data?.length ? (
            <EmptyState
              icon={activeData?.icon || Briefcase}
              title={`No ${activeData?.title.toLowerCase()} yet`}
              description={`Add your first ${activeData?.title.toLowerCase().slice(0, -1)}`}
            />
          ) : (
            <div className="space-y-3">
              {activeSection === 'experience' && experience?.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <p className="font-medium">{item.position}</p>
                    <p className="text-sm text-muted-foreground">{item.company}</p>
                    <p className="text-xs text-muted-foreground">{item.start_date} - {item.is_current ? 'Present' : item.end_date}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit('experience', item)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive" onClick={() => deleteExp.mutate(item.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {activeSection === 'education' && education?.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <p className="font-medium">{item.degree} in {item.field_of_study}</p>
                    <p className="text-sm text-muted-foreground">{item.institution}</p>
                    <p className="text-xs text-muted-foreground">{item.start_date} - {item.is_current ? 'Present' : item.end_date}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit('education', item)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive" onClick={() => deleteEdu.mutate(item.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {activeSection === 'skills' && skills?.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{item.name}</p>
                      {item.category && <span className="text-xs px-2 py-0.5 bg-muted rounded">{item.category.name}</span>}
                    </div>
                    <div className="mt-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${item.level}%` }} />
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit('skills', item)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive" onClick={() => deleteSkill.mutate(item.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {activeSection === 'certificates' && certificates?.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">{item.issuer}</p>
                    <p className="text-xs text-muted-foreground">Issued: {item.issue_date}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit('certificates', item)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive" onClick={() => deleteCert.mutate(item.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {showForm === 'experience' && (
        <ExperienceFormDialog item={editingItem} onClose={handleCloseForm} />
      )}
      {showForm === 'education' && (
        <EducationFormDialog item={editingItem} onClose={handleCloseForm} />
      )}
      {showForm === 'skills' && (
        <SkillFormDialog item={editingItem} onClose={handleCloseForm} />
      )}
      {showForm === 'certificates' && (
        <CertificateFormDialog item={editingItem} onClose={handleCloseForm} />
      )}
    </AdminLayout>
  );
}
