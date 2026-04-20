import { useState } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Tabs } from '../components/ui/Tabs';
import { SearchBar } from '../components/ui/SearchBar';
import { DataTable } from '../components/ui/DataTable';
import { CapacityBar } from '../components/ui/CapacityBar';
import { BookOpen, Filter } from 'lucide-react';
import { MOCK_WORKSHOPS } from '../utils/mockData';

const STATUS_MAP = {
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
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');

  const tabs = [
    { id: 'all', label: 'All', icon: BookOpen, count: MOCK_WORKSHOPS.length },
    { id: 'pending', label: 'Pending', count: MOCK_WORKSHOPS.filter(w => w.status === 'Pending').length },
    { id: 'approved', label: 'Approved', count: MOCK_WORKSHOPS.filter(w => w.status === 'Approved').length },
    { id: 'rejected', label: 'Rejected', count: MOCK_WORKSHOPS.filter(w => w.status === 'Rejected').length },
  ];

  const filtered = MOCK_WORKSHOPS.filter((w) => {
    const matchesTab = activeTab === 'all' || w.status.toLowerCase() === activeTab;
    const matchesSearch =
      w.title.toLowerCase().includes(search.toLowerCase()) ||
      w.organizerName.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const columns = [
    {
      key: 'title',
      label: 'Workshop',
      render: (val, row) => (
        <div>
          <p className="font-medium text-[var(--color-ink)]">{row.title}</p>
          <p className="text-[12px] text-[var(--color-ink-tertiary)]">by {row.organizerName}</p>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      width: '140px',
      render: (val) => (
        <Badge variant={STATUS_MAP[val] || 'default'}>
          {STATUS_LABEL[val] || val}
        </Badge>
      ),
    },
    {
      key: 'capacity',
      label: 'Capacity',
      width: '180px',
      render: (val, row) => (
        <CapacityBar current={row.currentAttendees} capacity={row.capacity} showLabel={false} />
      ),
    },
    {
      key: 'date',
      label: 'Date',
      width: '120px',
      render: (val) => (
        <span className="text-[var(--color-ink-secondary)]">
          {new Date(val).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
      ),
    },
  ];

  return (
    <PageWrapper
      role="manager"
      title="All Workshops"
      subtitle="Overview of all workshops on the platform"
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
          <DataTable
            columns={columns}
            data={filtered}
            emptyMessage="No workshops match your filter"
          />
        </div>
      </Card>
    </PageWrapper>
  );
}
