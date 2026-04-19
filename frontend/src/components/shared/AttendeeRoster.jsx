import { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { CapacityBar } from '../ui/CapacityBar';
import { ConfirmDialog } from './ConfirmDialog';
import { Users, Mail, Calendar, Download, MessageSquare, Trash2 } from 'lucide-react';
import { MOCK_ATTENDEES } from '../../utils/mockData';

export function AttendeeRoster({ workshopId, workshopTitle, capacity = 30 }) {
  const [attendees] = useState(MOCK_ATTENDEES);
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, attendee: null });

  const handleExportCSV = () => {
    const csv = [
      'Name,Email,Registered At,Status',
      ...attendees.map(a => `${a.user.fullName},${a.user.email},${a.registeredAt},${a.status}`),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendees-workshop-${workshopId}.csv`;
    a.click();
  };

  return (
    <>
      <Card>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Users size={18} className="text-[var(--color-primary)]" />
            <h3 className="text-[18px] font-semibold text-[var(--color-ink)]">
              Attendees
            </h3>
            <Badge variant="default">{attendees.length}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleExportCSV}>
              <Download size={14} />
              <span className="hidden sm:inline">Export</span>
            </Button>
            <Button variant="ghost" size="sm">
              <MessageSquare size={14} />
              <span className="hidden sm:inline">Message All</span>
            </Button>
          </div>
        </div>

        <CapacityBar current={attendees.length} capacity={capacity} className="mb-5" />

        {attendees.length === 0 ? (
          <p className="py-8 text-center text-[15px] text-[var(--color-ink-tertiary)]">
            No attendees registered yet
          </p>
        ) : (
          <div className="space-y-2">
            {attendees.map((reg) => (
              <div
                key={reg.registrationId}
                className="flex items-center gap-4 rounded-xl px-4 py-3 transition-colors hover:bg-[var(--color-surface-hover)]"
              >
                {/* Avatar */}
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)] text-[13px] font-semibold">
                  {reg.user.fullName.charAt(0)}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-medium text-[var(--color-ink)]">
                    {reg.user.fullName}
                  </p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="flex items-center gap-1 text-[12px] text-[var(--color-ink-tertiary)]">
                      <Mail size={11} />
                      {reg.user.email}
                    </span>
                    <span className="flex items-center gap-1 text-[12px] text-[var(--color-ink-tertiary)]">
                      <Calendar size={11} />
                      {new Date(reg.registeredAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Status + Actions */}
                <Badge variant={reg.status === 'Confirmed' ? 'success' : 'warning'}>
                  {reg.status}
                </Badge>
                <button
                  onClick={() => setDeleteDialog({ isOpen: true, attendee: reg })}
                  className="rounded-lg p-1.5 text-[var(--color-ink-tertiary)] hover:text-[var(--color-danger)] hover:bg-[var(--color-danger-light)] transition-colors cursor-pointer"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, attendee: null })}
        onConfirm={() => setDeleteDialog({ isOpen: false, attendee: null })}
        title="Remove attendee?"
        message={`Are you sure you want to remove ${deleteDialog.attendee?.user?.fullName}? They'll be notified.`}
        confirmText="Remove"
        cancelText="Keep them"
      />
    </>
  );
}
