import { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { FileText, Link as LinkIcon, Trash2, Plus, ExternalLink } from 'lucide-react';

export function ResourceManager({ workshopId, isOrganizer = false }) {
  const [resources, setResources] = useState([
    { id: 1, title: 'Presentation Slides', resourceUrl: 'https://slides.example.com/react-a11y' },
    { id: 2, title: 'Starter Code Repository', resourceUrl: 'https://github.com/example/starter' },
    { id: 3, title: 'Additional Reading', resourceUrl: 'https://web.dev/accessibility' },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [newResource, setNewResource] = useState({ title: '', resourceUrl: '' });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newResource.title || !newResource.resourceUrl) return;
    setResources([...resources, { id: Date.now(), ...newResource }]);
    setNewResource({ title: '', resourceUrl: '' });
    setShowForm(false);
  };

  const handleDelete = (id) => {
    setResources(resources.filter(r => r.id !== id));
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <FileText size={18} className="text-[var(--color-primary)]" />
          <h3 className="text-[18px] font-semibold text-[var(--color-ink)]">Resources</h3>
        </div>
        {isOrganizer && (
          <Button variant="ghost" size="sm" onClick={() => setShowForm(!showForm)}>
            <Plus size={14} />
            Add
          </Button>
        )}
      </div>

      {showForm && isOrganizer && (
        <form onSubmit={handleAdd} className="mb-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-hover)] p-4 space-y-3">
          <Input
            label="Title"
            placeholder="e.g., Presentation Slides"
            value={newResource.title}
            onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
          />
          <Input
            label="URL"
            placeholder="https://..."
            value={newResource.resourceUrl}
            onChange={(e) => setNewResource({ ...newResource, resourceUrl: e.target.value })}
          />
          <div className="flex gap-2">
            <Button type="submit" size="sm">Save</Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </form>
      )}

      {resources.length === 0 ? (
        <p className="py-8 text-center text-[15px] text-[var(--color-ink-tertiary)]">
          No resources available yet
        </p>
      ) : (
        <div className="space-y-1">
          {resources.map((resource) => (
            <div
              key={resource.id}
              className="flex items-center gap-3 rounded-xl px-4 py-3 transition-colors hover:bg-[var(--color-surface-hover)]"
            >
              <LinkIcon size={15} className="shrink-0 text-[var(--color-primary)]" />
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-medium text-[var(--color-ink)]">{resource.title}</p>
                <a
                  href={resource.resourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[12px] text-[var(--color-primary)] hover:underline"
                >
                  {resource.resourceUrl}
                  <ExternalLink size={10} />
                </a>
              </div>
              {isOrganizer && (
                <button
                  onClick={() => handleDelete(resource.id)}
                  className="shrink-0 rounded-lg p-1.5 text-[var(--color-ink-tertiary)] hover:text-[var(--color-danger)] hover:bg-[var(--color-danger-light)] transition-colors cursor-pointer"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
