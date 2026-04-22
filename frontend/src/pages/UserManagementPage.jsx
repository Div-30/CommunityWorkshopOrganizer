import { useState, useEffect } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Tabs } from '../components/ui/Tabs';
import { SearchBar } from '../components/ui/SearchBar';
import { DataTable } from '../components/ui/DataTable';
import { Button } from '../components/ui/Button';
import { useToast } from '../context/ToastContext';
import { userAPI } from '../services/api';
import { ConfirmDialog } from '../components/shared/ConfirmDialog';
import { Users, Shield, ShieldOff, Trash2 } from 'lucide-react';


const ROLE_VARIANT = {
  Attendee: 'info',
  Organizer: 'warning',
  Manager: 'danger',
};

export function UserManagementPage() {
  const { success, error: showError } = useToast();
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, id: null });

  useEffect(() => {
    userAPI.getAll()
      .then(data => setUsers(Array.isArray(data) ? data : []))
      .catch(err => showError('Failed to load users: ' + err.message));
  }, []);

  const tabs = [
    { id: 'all', label: 'All', icon: Users, count: users.length },
    { id: 'attendee', label: 'Attendees', count: users.filter(u => u.userRole === 'Attendee').length },
    { id: 'organizer', label: 'Organizers', count: users.filter(u => u.userRole === 'Organizer').length },
    { id: 'manager', label: 'Managers', count: users.filter(u => u.userRole === 'Manager').length },
  ];

  const filtered = users.filter((u) => {
    const matchesTab = activeTab === 'all' || (u.userRole || '').toLowerCase() === activeTab;
    const matchesSearch =
      (u.fullName || '').toLowerCase().includes(search.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // Status toggling is UI-only for now (no backend suspend endpoint yet)
  const toggleStatus = (userId) => {
    setUsers(users.map(u => {
      if (u.userId === userId) {
        const newStatus = u._uiStatus === 'Suspended' ? 'Active' : 'Suspended';
        success(newStatus === 'Active' ? 'User reactivated' : 'User suspended');
        return { ...u, _uiStatus: newStatus };
      }
      return u;
    }));
  };

  const handleDelete = async () => {
    try {
      await userAPI.deleteUser(deleteDialog.id);
      setUsers(prev => prev.filter(u => u.userId !== deleteDialog.id));
      setDeleteDialog({ isOpen: false, id: null });
      success('User deleted successfully.');
    } catch (err) {
      showError(err.message || 'Failed to delete user.');
    }
  };

  const columns = [
    {
      key: 'fullName',
      label: 'User',
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)] text-[12px] font-semibold">
            {row.fullName.charAt(0)}
          </div>
          <div>
            <p className="font-medium text-[var(--color-ink)]">{row.fullName}</p>
            <p className="text-[12px] text-[var(--color-ink-tertiary)]">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'userRole',
      label: 'Role',
      width: '110px',
      render: (val) => <Badge variant={ROLE_VARIANT[val] || 'default'}>{val}</Badge>,
    },
    {
      key: 'createdAt',
      label: 'Joined',
      width: '110px',
      render: (val) => (
        <span className="text-[var(--color-ink-secondary)]">
          {val ? new Date(val).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
        </span>
      ),
    },
    {
      key: '_uiStatus',
      label: 'Status',
      width: '100px',
      render: (val) => (
        <Badge variant={!val || val === 'Active' ? 'success' : 'danger'}>
          {val || 'Active'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: '',
      width: '160px',
      render: (_, row) => (
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleStatus(row.userId)}
            className={row._uiStatus === 'Suspended'
              ? 'text-[var(--color-success)] hover:bg-[var(--color-success-light)]'
              : 'text-[var(--color-danger)] hover:bg-[var(--color-danger-light)]'
            }
          >
            {row._uiStatus === 'Suspended' ? <Shield size={14} /> : <ShieldOff size={14} />}
            {row._uiStatus === 'Suspended' ? 'Activate' : 'Suspend'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-[var(--color-danger)] hover:bg-[var(--color-danger-light)]"
            onClick={() => setDeleteDialog({ isOpen: true, id: row.userId })}
          >
            <Trash2 size={14} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <PageWrapper
      role="manager"
      title="User Management"
      subtitle="Manage all users on the platform"
    >
      <div className="space-y-4 mb-6">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search by name or email..."
        />
      </div>

      <Card padding={false}>
        <div className="p-2">
          <DataTable
            columns={columns}
            data={filtered}
            emptyMessage="No users match your filter"
          />
        </div>
      </Card>

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, id: null })}
        onConfirm={handleDelete}
        title="Delete this user?"
        message="This will permanently delete the user and all their data. This cannot be undone."
        confirmText="Yes, delete"
        cancelText="Cancel"
      />
    </PageWrapper>
  );
}
