import { useState, useEffect } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { EmptyState } from '../components/shared/EmptyState';
import { useToast } from '../context/ToastContext';
import { organizerRequestAPI } from '../services/api';
import {
  Check, X, ChevronDown, ChevronUp, ClipboardCheck, User, Clock,
} from 'lucide-react';


export function WorkshopReviewPage() {
  const { success, error: showError } = useToast();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [rejectModal, setRejectModal] = useState({ isOpen: false, id: null });
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await organizerRequestAPI.getAll('Pending');
      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      showError('Failed to load pending requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (id) => {
    setActionLoading(true);
    try {
      await organizerRequestAPI.approve(id);
      setRequests(prev => prev.filter(r => r.requestId !== id));
      success('Organizer request approved! The user has been promoted. ✅');
    } catch (err) {
      showError(err.message || 'Failed to approve request.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) return;
    setActionLoading(true);
    try {
      await organizerRequestAPI.reject(rejectModal.id, rejectReason);
      setRequests(prev => prev.filter(r => r.requestId !== rejectModal.id));
      setRejectModal({ isOpen: false, id: null });
      setRejectReason('');
      success('Feedback sent to the applicant.');
    } catch (err) {
      showError(err.message || 'Failed to reject request.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <PageWrapper
      role="manager"
      title="Organizer Request Queue"
      subtitle={loading ? 'Loading…' : `${requests.length} request${requests.length !== 1 ? 's' : ''} pending your review`}
    >
      {loading ? (
        <div className="py-16 text-center">
          <p className="text-[15px] text-[var(--color-ink-secondary)]">Loading requests…</p>
        </div>
      ) : requests.length === 0 ? (
        <EmptyState
          icon={ClipboardCheck}
          title="All clear! 🎉"
          description="No organizer requests pending review. Great job staying on top of things!"
        />
      ) : (
        <div className="space-y-3">
          {requests.map((req) => {
            const isExpanded = expandedId === req.requestId;
            return (
              <Card key={req.requestId} padding={false}>
                {/* Summary row */}
                <div
                  className="flex items-center gap-4 px-6 py-4 cursor-pointer hover:bg-[var(--color-surface-hover)] transition-colors rounded-t-2xl"
                  onClick={() => setExpandedId(isExpanded ? null : req.requestId)}
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--color-warning-light)]">
                    <Clock size={16} className="text-[var(--color-warning)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[15px] font-semibold text-[var(--color-ink)]">
                      {req.user?.fullName || `User #${req.userId}`}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 mt-1">
                      <span className="flex items-center gap-1 text-[13px] text-[var(--color-ink-secondary)]">
                        <User size={13} />
                        {req.user?.email}
                      </span>
                      <span className="text-[12px] text-[var(--color-ink-tertiary)]">
                        Submitted {new Date(req.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-[var(--color-success)] hover:bg-[var(--color-success-light)]"
                      onClick={(e) => { e.stopPropagation(); handleApprove(req.requestId); }}
                      loading={actionLoading}
                    >
                      <Check size={16} />
                      Approve
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-[var(--color-danger)] hover:bg-[var(--color-danger-light)]"
                      onClick={(e) => { e.stopPropagation(); setRejectModal({ isOpen: true, id: req.requestId }); }}
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
                    <p className="text-[12px] font-medium uppercase tracking-wider text-[var(--color-ink-tertiary)] mb-2">Application Message</p>
                    <p className="text-[14px] text-[var(--color-ink-secondary)] leading-relaxed">
                      {req.message || 'No message provided.'}
                    </p>
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
        description="Let the applicant know why their request was not approved."
        danger
      >
        <div className="space-y-4">
          <Input
            as="textarea"
            label="What needs to change?"
            placeholder="e.g., Please provide more information about your experience and what topics you plan to teach..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            rows={4}
          />
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => { setRejectModal({ isOpen: false, id: null }); setRejectReason(''); }}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleReject} disabled={!rejectReason.trim()} loading={actionLoading}>
              Send Feedback
            </Button>
          </div>
        </div>
      </Modal>
    </PageWrapper>
  );
}
