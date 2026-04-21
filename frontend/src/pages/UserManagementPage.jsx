import { useState } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Tabs } from '../components/ui/Tabs';
import { SearchBar } from '../components/ui/SearchBar';
import { DataTable } from '../components/ui/DataTable';
import { Button } from '../components/ui/Button';
import { useToast } from '../context/ToastContext';
import { Users, Shield, ShieldOff } from 'lucide-react';


const ROLE_VARIANT = {
  Attendee: 'info',
  Organizer: 'warning',
  Manager: 'danger',
};

export function UserManagementPage() {
  const { success } = useToast();
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');

  const tabs = [
    { id: 'all', label: 'All', icon: Users, count: users.length },
    { id: 'attendee', label: 'Attendees', count: users.filter(u => u.role === 'Attendee').length },
    { id: 'organizer', label: 'Organizers', count: users.filter(u => u.role === 'Organizer').length },
    { id: 'manager', label: 'Managers', count: users.filter(u => u.role === 'Manager').length },
  ];

  const filtered = users.filter((u) => {
    const matchesTab = activeTab === 'all' || u.role.toLowerCase() === activeTab;
    const matchesSearch =
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const toggleStatus = (userId) => {
    setUsers(users.map(u => {
      if (u.id === userId) {
        const newStatus = u.status === 'Active' ? 'Suspended' : 'Active';
        success(newStatus === 'Active' ? 'User reactivated' : 'User suspended');
        return { ...u, status: newStatus };
      }
      return u;
    }));
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
      key: 'role',
      label: 'Role',
      width: '110px',
      render: (val) => <Badge variant={ROLE_VARIANT[val] || 'default'}>{val}</Badge>,
    },
    {
      key: 'joinedAt',
      label: 'Joined',
      width: '110px',
      render: (val) => (
        <span className="text-[var(--color-ink-secondary)]">
          {new Date(val).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      width: '100px',
      render: (val) => (
        <Badge variant={val === 'Active' ? 'success' : 'danger'}>
          {val}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: '',
      width: '100px',
      render: (_, row) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => toggleStatus(row.id)}
          className={row.status === 'Active'
            ? 'text-[var(--color-danger)] hover:bg-[var(--color-danger-light)]'
            : 'text-[var(--color-success)] hover:bg-[var(--color-success-light)]'
          }
        >
          {row.status === 'Active' ? <ShieldOff size={14} /> : <Shield size={14} />}
          {row.status === 'Active' ? 'Suspend' : 'Activate'}
        </Button>
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
    </PageWrapper>
  );
}
