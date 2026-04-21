import { useState } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { EmptyState } from '../components/shared/EmptyState';
import { useToast } from '../context/ToastContext';
import {
  Check, X, ChevronDown, ChevronUp, Calendar, Users, MapPin, User, ClipboardCheck,
} from 'lucide-react';


export function WorkshopReviewPage() {
  const { success } = useToast();
  const [workshops, setWorkshops] = useState(
    [].filter(w => w.status === 'Pending')
  );
  const [expandedId, setExpandedId] = useState(null);
  const [rejectModal, setRejectModal] = useState({ isOpen: false, id: null });
  const [rejectReason, setRejectReason] = useState('');

  const handleApprove = (id) => {
    setWorkshops(workshops.filter(w => w.id !== id));
    success("Workshop approved! The organizer has been notified. ✅");
  };

  const handleReject = () => {
    setWorkshops(workshops.filter(w => w.id !== rejectModal.id));
    setRejectModal({ isOpen: false, id: null });
    setRejectReason('');
    success("Feedback sent to the organizer.");
  };

  return (
    <PageWrapper
      role="manager"
      title="Workshop Review Queue"
      subtitle={`${workshops.length} workshop${workshops.length !== 1 ? 's' : ''} pending your review`}
    >
      {workshops.length === 0 ? (
        <EmptyState
          icon={ClipboardCheck}
          title="All clear! 🎉"
          description="No workshops pending review. Great job staying on top of things!"
        />
      ) : (
        <div className="space-y-3">
          {workshops.map((workshop) => {
            const isExpanded = expandedId === workshop.id;
            return (
              <Card key={workshop.id} padding={false}>
                {/* Summary row */}
                <div
                  className="flex items-center gap-4 px-6 py-4 cursor-pointer hover:bg-[var(--color-surface-hover)] transition-colors rounded-t-2xl"
                  onClick={() => setExpandedId(isExpanded ? null : workshop.id)}
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[15px] font-semibold text-[var(--color-ink)]">
                      {workshop.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 mt-1">
                      <span className="flex items-center gap-1 text-[13px] text-[var(--color-ink-secondary)]">
                        <User size={13} />
                        {workshop.organizerName}
                      </span>
                      <span className="flex items-center gap-1 text-[13px] text-[var(--color-ink-secondary)]">
                        <Calendar size={13} />
                        {new Date(workshop.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                      <span className="flex items-center gap-1 text-[13px] text-[var(--color-ink-secondary)]">
                        <Users size={13} />
                        {workshop.capacity} spots
                      </span>
                    </div>
                    <div className="flex gap-1.5 mt-2">
                      {workshop.tags?.map(tag => (
                        <Badge key={tag} variant="info">{tag}</Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-[var(--color-success)] hover:bg-[var(--color-success-light)]"
                      onClick={(e) => { e.stopPropagation(); handleApprove(workshop.id); }}
                    >
                      <Check size={16} />
                      Approve
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-[var(--color-danger)] hover:bg-[var(--color-danger-light)]"
                      onClick={(e) => { e.stopPropagation(); setRejectModal({ isOpen: true, id: workshop.id }); }}
                    >
                      <X size={16} />
                      Reject
                    </Button>
                    {isExpanded ? <ChevronUp size={16} className="text-[var(--color-ink-tertiary)]" /> : <ChevronDown size={16} className="text-[var(--color-ink-tertiary)]" />}
                  </div>
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="border-t border-[var(--color-border)] px-6 py-5 bg-[var(--color-surface-hover)] rounded-b-2xl">
                    <p className="text-[14px] text-[var(--color-ink-secondary)] leading-relaxed mb-4">
                      {workshop.description}
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div>
                        <p className="text-[11px] font-medium uppercase tracking-wider text-[var(--color-ink-tertiary)]">Speaker</p>
                        <p className="mt-1 text-[14px] font-medium text-[var(--color-ink)]">{workshop.speaker}</p>
                      </div>
                      <div>
                        <p className="text-[11px] font-medium uppercase tracking-wider text-[var(--color-ink-tertiary)]">Date</p>
                        <p className="mt-1 text-[14px] font-medium text-[var(--color-ink)]">
                          {new Date(workshop.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] font-medium uppercase tracking-wider text-[var(--color-ink-tertiary)]">Location</p>
                        <p className="mt-1 text-[14px] font-medium text-[var(--color-ink)]">{workshop.location}</p>
                      </div>
                      <div>
                        <p className="text-[11px] font-medium uppercase tracking-wider text-[var(--color-ink-tertiary)]">Capacity</p>
                        <p className="mt-1 text-[14px] font-medium text-[var(--color-ink)]">{workshop.capacity} seats</p>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Reject modal */}
      <Modal
        isOpen={rejectModal.isOpen}
        onClose={() => { setRejectModal({ isOpen: false, id: null }); setRejectReason(''); }}
        title="Provide feedback"
        description="Let the organizer know what needs to change before this can be approved."
        danger
      >
        <div className="space-y-4">
          <Input
            as="textarea"
            label="What needs to change?"
            placeholder="e.g., Please add more detail to the description and include prerequisites..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            rows={4}
          />
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => { setRejectModal({ isOpen: false, id: null }); setRejectReason(''); }}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleReject} disabled={!rejectReason.trim()}>
              Send Feedback
            </Button>
          </div>
        </div>
      </Modal>
    </PageWrapper>
  );
}
