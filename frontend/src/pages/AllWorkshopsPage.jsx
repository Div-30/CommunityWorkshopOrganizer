import { useState, useEffect } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Tabs } from '../components/ui/Tabs';
import { SearchBar } from '../components/ui/SearchBar';
import { DataTable } from '../components/ui/DataTable';
import { CapacityBar } from '../components/ui/CapacityBar';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { useToast } from '../context/ToastContext';
import { workshopAPI } from '../services/api';
import { BookOpen, Check, X, RefreshCw } from 'lucide-react';


const STATUS_VARIANT = {
  Approved: 'approved',
  Pending: 'pending',
  Rejected: 'rejected',
};

const STATUS_LABEL = {
  Approved: 'Live',
  Pending: 'Under review 🔍',
  Rejected: 'Needs changes',
};

export function AllWorkshopsPage() {
  const { success, error: showError } = useToast();
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [rejectModal, setRejectModal] = useState({ isOpen: false, id: null });
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchWorkshops = async () => {
    try {
      setLoading(true);
      const data = await workshopAPI.getAll();
      setWorkshops(Array.isArray(data) ? data : []);
    } catch (err) {
      showError('Failed to load workshops: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkshops();
  }, []);

  const tabs = [
    { id: 'all', label: 'All', icon: BookOpen, count: workshops.length },
    { id: 'pending', label: 'Pending', count: workshops.filter(w => w.status === 'Pending').length },
    { id: 'approved', label: 'Approved', count: workshops.filter(w => w.status === 'Approved').length },
    { id: 'rejected', label: 'Rejected', count: workshops.filter(w => w.status === 'Rejected').length },
  ];

  const filtered = workshops.filter((w) => {
    const matchesTab = activeTab === 'all' || (w.status || '').toLowerCase() === activeTab;
    const organizerName = w.organizer?.fullName || '';
    const matchesSearch =
      (w.title || '').toLowerCase().includes(search.toLowerCase()) ||
      organizerName.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleApprove = async (id) => {
    setActionLoading(true);
    try {
      await workshopAPI.approve(id);
      setWorkshops(prev => prev.map(w =>
        w.workshopId === id ? { ...w, status: 'Approved' } : w
      ));
      success('Workshop approved and is now live! ✅');
    } catch (err) {
      showError(err.message || 'Failed to approve workshop.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) return;
    setActionLoading(true);
    try {
      await workshopAPI.reject(rejectModal.id, rejectReason);
      setWorkshops(prev => prev.map(w =>
        w.workshopId === rejectModal.id ? { ...w, status: 'Rejected' } : w
      ));
      setRejectModal({ isOpen: false, id: null });
      setRejectReason('');
      success('Feedback sent to the organizer.');
    } catch (err) {
      showError(err.message || 'Failed to reject workshop.');
    } finally {
      setActionLoading(false);
    }
  };

  const columns = [
    {
      key: 'title',
      label: 'Workshop',
      render: (val, row) => (
        <div>
          <p className="font-medium text-[var(--color-ink)]">{row.title}</p>
          <p className="text-[12px] text-[var(--color-ink-tertiary)]">
            by {row.organizer?.fullName || `Organizer #${row.organizerId}`}
          </p>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      width: '140px',
      render: (val) => (
        <Badge variant={STATUS_VARIANT[val] || 'default'}>
          {STATUS_LABEL[val] || val}
        </Badge>
      ),
    },
    {
      key: 'registrations',
      label: 'Capacity',
      width: '180px',
      render: (val, row) => (
        <CapacityBar
          current={Array.isArray(row.registrations) ? row.registrations.length : 0}
          capacity={row.capacity}
          showLabel={false}
        />
      ),
    },
    {
      key: 'eventDate',
      label: 'Date',
      width: '120px',
      render: (val) => (
        <span className="text-[var(--color-ink-secondary)]">
          {val ? new Date(val).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: '',
      width: '160px',
      render: (_, row) => row.status === 'Pending' ? (
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="text-[var(--color-success)] hover:bg-[var(--color-success-light)]"
            onClick={() => handleApprove(row.workshopId)}
            loading={actionLoading}
          >
            <Check size={14} />
            Approve
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-[var(--color-danger)] hover:bg-[var(--color-danger-light)]"
            onClick={() => setRejectModal({ isOpen: true, id: row.workshopId })}
          >
            <X size={14} />
            Reject
          </Button>
        </div>
      ) : null,
    },
  ];

  return (
    <PageWrapper
      role="manager"
      title="All Workshops"
      subtitle="Overview of all workshops on the platform"
      action={
        <Button variant="secondary" size="sm" onClick={fetchWorkshops} loading={loading}>
          <RefreshCw size={14} />
          Refresh
        </Button>
      }
    >
      <div className="space-y-4 mb-6">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search by title or organizer..."
        />
      </div>

      <Card padding={false}>
        <div className="p-2">
          {loading ? (
            <div className="py-12 text-center">
              <p className="text-[15px] text-[var(--color-ink-secondary)]">Loading workshops…</p>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={filtered}
              emptyMessage="No workshops match your filter"
            />
          )}
        </div>
      </Card>

      {/* Reject modal */}
      <Modal
        isOpen={rejectModal.isOpen}
        onClose={() => { setRejectModal({ isOpen: false, id: null }); setRejectReason(''); }}
        title="Reject Workshop"
        description="Provide feedback so the organizer can improve their submission."
        danger
      >
        <div className="space-y-4">
          <Input
            as="textarea"
            label="Reason for rejection"
            placeholder="e.g., Please add more detail to the description and include prerequisites..."
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
