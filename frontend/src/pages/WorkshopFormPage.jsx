import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { TagSelector } from '../components/ui/TagSelector';
import { Calendar, MapPin, User, Users, Clock, Save, Send, Plus, Trash2, Link as LinkIcon } from 'lucide-react';
import { WORKSHOP_TAGS } from '../utils/constants';

export function WorkshopFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { success, error } = useToast();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    speaker: '',
    capacity: '',
    tags: [],
    resources: [{ title: '', url: '' }],
  });

  const update = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));
  const charCount = formData.description.length;
  const maxChars = 500;

  const addResource = () => {
    update('resources', [...formData.resources, { title: '', url: '' }]);
  };

  const removeResource = (index) => {
    update('resources', formData.resources.filter((_, i) => i !== index));
  };

  const updateResource = (index, field, value) => {
    const updated = [...formData.resources];
    updated[index] = { ...updated[index], [field]: value };
    update('resources', updated);
  };

  const validate = () => {
    const e = {};
    if (!formData.title) e.title = 'Give your workshop a catchy title';
    if (!formData.description) e.description = 'Tell people what they\'ll learn';
    if (!formData.date) e.date = 'When is this happening?';
    if (!formData.time) e.time = 'What time should people arrive?';
    if (!formData.location) e.location = 'Where will this take place?';
    if (!formData.speaker) e.speaker = 'Who is leading this workshop?';
    if (!formData.capacity || formData.capacity < 1) e.capacity = 'How many people can join?';
    return e;
  };

  const handleSubmit = (isDraft = false) => {
    if (!isDraft) {
      const v = validate();
      if (Object.keys(v).length > 0) { setErrors(v); return; }
    }
    setErrors({});
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      success(isDraft ? 'Draft saved!' : id ? 'Workshop updated!' : 'Submitted for review 🔍');
      navigate('/organizer');
    }, 800);
  };

  return (
    <PageWrapper
      role="organizer"
      title={id ? 'Edit your workshop' : 'Create a new workshop'}
      subtitle={id ? 'Update the details below' : 'Share your knowledge with the community'}
    >
      <div className="max-w-2xl">
        {/* Basic Info */}
        <Card className="mb-5">
          <h2 className="text-[16px] font-semibold text-[var(--color-ink)] mb-4">Basic Info</h2>
          <div className="space-y-4">
            <Input
              label="Workshop Title"
              placeholder="e.g., Building Accessible React Components"
              value={formData.title}
              onChange={(e) => update('title', e.target.value)}
              error={errors.title}
            />

            <div>
              <Input
                label="Description"
                as="textarea"
                placeholder="What will participants learn? What should they bring?"
                value={formData.description}
                onChange={(e) => {
                  if (e.target.value.length <= maxChars) update('description', e.target.value);
                }}
                error={errors.description}
                rows={4}
              />
              <p className={`text-right text-[11px] mt-1 ${charCount > maxChars * 0.9 ? 'text-[var(--color-warning)]' : 'text-[var(--color-ink-tertiary)]'}`}>
                {charCount}/{maxChars}
              </p>
            </div>

            <Input
              label="Speaker / Instructor"
              placeholder="Your name or the speaker's name"
              value={formData.speaker}
              onChange={(e) => update('speaker', e.target.value)}
              error={errors.speaker}
              icon={User}
            />
          </div>
        </Card>

        {/* Date & Time */}
        <Card className="mb-5">
          <h2 className="text-[16px] font-semibold text-[var(--color-ink)] mb-4">Date & Time</h2>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Date"
              type="date"
              value={formData.date}
              onChange={(e) => update('date', e.target.value)}
              error={errors.date}
              icon={Calendar}
            />
            <Input
              label="Time"
              type="time"
              value={formData.time}
              onChange={(e) => update('time', e.target.value)}
              error={errors.time}
              icon={Clock}
            />
          </div>
          <div className="mt-4">
            <Input
              label="Location"
              placeholder="e.g., Room 204, Innovation Hub"
              value={formData.location}
              onChange={(e) => update('location', e.target.value)}
              error={errors.location}
              icon={MapPin}
            />
          </div>
        </Card>

        {/* Capacity & Tags */}
        <Card className="mb-5">
          <h2 className="text-[16px] font-semibold text-[var(--color-ink)] mb-4">Capacity & Tags</h2>
          <Input
            label="Maximum Capacity"
            type="number"
            placeholder="e.g., 30"
            value={formData.capacity}
            onChange={(e) => update('capacity', e.target.value)}
            error={errors.capacity}
            icon={Users}
          />
          <div className="mt-4">
            <label className="block text-[13px] font-medium text-[var(--color-ink)] mb-2">
              Tags
              <span className="ml-2 font-normal text-[var(--color-ink-tertiary)]">Select relevant topics</span>
            </label>
            <TagSelector
              selected={formData.tags}
              onChange={(tags) => update('tags', tags)}
              tags={WORKSHOP_TAGS}
            />
          </div>
        </Card>

        {/* Resources */}
        <Card className="mb-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[16px] font-semibold text-[var(--color-ink)]">Resources</h2>
            <Button variant="ghost" size="sm" onClick={addResource}>
              <Plus size={14} />
              Add Link
            </Button>
          </div>
          <div className="space-y-3">
            {formData.resources.map((resource, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className="flex-1 grid grid-cols-2 gap-3">
                  <Input
                    placeholder="Title"
                    value={resource.title}
                    onChange={(e) => updateResource(i, 'title', e.target.value)}
                  />
                  <Input
                    placeholder="https://..."
                    value={resource.url}
                    onChange={(e) => updateResource(i, 'url', e.target.value)}
                    icon={LinkIcon}
                  />
                </div>
                {formData.resources.length > 1 && (
                  <button
                    onClick={() => removeResource(i)}
                    className="mt-1 rounded-lg p-2 text-[var(--color-ink-tertiary)] hover:text-[var(--color-danger)] hover:bg-[var(--color-danger-light)] transition-colors cursor-pointer"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Sticky action bar */}
        <div className="sticky bottom-0 bg-[var(--color-bg)]/95 backdrop-blur-sm border-t border-[var(--color-border)] py-4 -mx-6 px-6 flex gap-3">
          <Button
            variant="secondary"
            onClick={() => handleSubmit(true)}
            className="flex-1"
          >
            <Save size={16} />
            Save Draft
          </Button>
          <Button
            onClick={() => handleSubmit(false)}
            loading={loading}
            className="flex-1"
          >
            <Send size={16} />
            Submit for Review
          </Button>
        </div>
      </div>
    </PageWrapper>
  );
}
