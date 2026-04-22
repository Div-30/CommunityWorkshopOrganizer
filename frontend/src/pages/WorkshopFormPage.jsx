import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Calendar, MapPin, User, Users, Clock, Send, Plus, Trash2, Link as LinkIcon, DollarSign } from 'lucide-react';
import { workshopAPI, resourceAPI } from '../services/api';

export function WorkshopFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { success, error: showError } = useToast();
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
    isPaid: false,
    price: '',
    resources: [{ title: '', url: '' }],
  });

  // Load existing workshop when editing
  useEffect(() => {
    if (!id) return;
    workshopAPI.getById(id)
      .then((data) => {
        if (!data) return;
        const dateObj = data.eventDate ? new Date(data.eventDate) : null;
        setFormData({
          title: data.title || '',
          description: data.description || '',
          date: dateObj ? dateObj.toISOString().split('T')[0] : '',
          time: dateObj ? dateObj.toTimeString().slice(0, 5) : '',
          location: data.location || '',
          speaker: data.speakerName || '',
          capacity: data.capacity ? String(data.capacity) : '',
          isPaid: data.isPaid || false,
          price: data.price ? String(data.price) : '',
          resources: data.resources?.length ? data.resources : [{ title: '', url: '' }],
        });
      })
      .catch(() => showError('Failed to load workshop for editing.'));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const update = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));
  const charCount = formData.description.length;
  const maxChars = 500;

  const addResource = () => update('resources', [...formData.resources, { title: '', url: '' }]);
  const removeResource = (index) => update('resources', formData.resources.filter((_, i) => i !== index));
  const updateResource = (index, field, value) => {
    const updated = [...formData.resources];
    updated[index] = { ...updated[index], [field]: value };
    update('resources', updated);
  };

  const validate = () => {
    const e = {};
    if (!formData.title.trim()) e.title = 'Give your workshop a catchy title';
    if (!formData.description.trim()) e.description = "Tell people what they'll learn";
    if (!formData.date) e.date = 'When is this happening?';
    if (!formData.time) e.time = 'What time should people arrive?';
    if (!formData.speaker.trim()) e.speaker = 'Who is leading this workshop?';
    if (!formData.capacity || Number(formData.capacity) < 1) e.capacity = 'How many people can join?';
    if (formData.isPaid && (!formData.price || Number(formData.price) < 1))
      e.price = 'Enter the registration fee in RWF';
    return e;
  };

  const handleSubmit = async () => {
    const v = validate();
    if (Object.keys(v).length > 0) { setErrors(v); return; }
    setErrors({});
    setLoading(true);

    try {
      const eventDate = new Date(`${formData.date}T${formData.time || '00:00'}`).toISOString();
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        speakerName: formData.speaker.trim(),
        eventDate,
        capacity: Number(formData.capacity),
        isPaid: formData.isPaid,
        price: formData.isPaid ? Number(formData.price) : 0,
      };

      if (id) {
        await workshopAPI.update(id, payload);
        success('Workshop updated!');
      } else {
        const created = await workshopAPI.create(payload);
        // Save resources if any are filled in
        const validResources = formData.resources.filter(r => r.title.trim() && r.url.trim());
        for (const r of validResources) {
          try {
            await resourceAPI.add(created.workshopId, r.title.trim(), r.url.trim());
          } catch {
            // Non-critical: don't fail the whole submit if one resource fails
          }
        }
        success('Submitted for review 🔍 The admin will be notified.');
      }
      navigate('/organizer');
    } catch (err) {
      showError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
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
              required
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
                required
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
              required
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
              required
            />
            <Input
              label="Time"
              type="time"
              value={formData.time}
              onChange={(e) => update('time', e.target.value)}
              error={errors.time}
              icon={Clock}
              required
            />
          </div>
          <div className="mt-4">
            <Input
              label="Location"
              hint="optional"
              placeholder="e.g., Room 204, Innovation Hub"
              value={formData.location}
              onChange={(e) => update('location', e.target.value)}
              error={errors.location}
              icon={MapPin}
            />
          </div>
        </Card>

        {/* Capacity */}
        <Card className="mb-5">
          <h2 className="text-[16px] font-semibold text-[var(--color-ink)] mb-4">Capacity</h2>
          <Input
            label="Maximum Attendees"
            type="number"
            placeholder="e.g., 30"
            value={formData.capacity}
            onChange={(e) => update('capacity', e.target.value)}
            error={errors.capacity}
            icon={Users}
            required
          />
        </Card>

        {/* Pricing */}
        <Card className="mb-5">
          <h2 className="text-[16px] font-semibold text-[var(--color-ink)] mb-4">Pricing</h2>
          <div className="flex gap-3 mb-4">
            {[
              { value: false, label: 'Free', desc: 'No registration fee' },
              { value: true, label: 'Paid', desc: 'Requires payment to attend' },
            ].map((option) => (
              <button
                key={String(option.value)}
                type="button"
                onClick={() => update('isPaid', option.value)}
                className={`
                  flex-1 rounded-xl border-2 px-4 py-3 text-center transition-all duration-150 cursor-pointer
                  ${formData.isPaid === option.value
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)]'
                    : 'border-[var(--color-border)] hover:border-[var(--color-ink-tertiary)]'
                  }
                `}
              >
                <p className={`text-[14px] font-semibold ${formData.isPaid === option.value ? 'text-[var(--color-primary)]' : 'text-[var(--color-ink)]'}`}>
                  {option.label}
                </p>
                <p className="mt-0.5 text-[11px] text-[var(--color-ink-tertiary)]">{option.desc}</p>
              </button>
            ))}
          </div>

          {formData.isPaid && (
            <div className="mt-2">
              <Input
                label="Registration Fee"
                type="number"
                placeholder="e.g., 5000"
                value={formData.price}
                onChange={(e) => update('price', e.target.value)}
                error={errors.price}
                icon={DollarSign}
                hint="RWF"
                required
              />
              <p className="text-[12px] text-[var(--color-ink-tertiary)] mt-1.5 px-1">
                Attendees will be required to complete payment before their spot is confirmed.
              </p>
            </div>
          )}
        </Card>

        {/* Resources */}
        <Card className="mb-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[16px] font-semibold text-[var(--color-ink)]">Resources <span className="text-[12px] font-normal text-[var(--color-ink-tertiary)]">optional</span></h2>
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

        {/* Action bar */}
        <div className="sticky bottom-0 bg-[var(--color-bg)]/95 backdrop-blur-sm border-t border-[var(--color-border)] py-4 -mx-6 px-6 flex gap-3">
          <Button variant="secondary" onClick={() => navigate('/organizer')} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSubmit} loading={loading} className="flex-1">
            <Send size={16} />
            {id ? 'Save Changes' : 'Submit for Review'}
          </Button>
        </div>
      </div>
    </PageWrapper>
  );
}
