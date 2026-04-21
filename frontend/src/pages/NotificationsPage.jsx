import { PageWrapper } from '../components/layout/PageWrapper';
import { Card } from '../components/ui/Card';
import { NotificationFeed } from '../components/shared/NotificationFeed';


export function NotificationsPage() {
  const unreadCount = [].filter(n => !n.read).length;

  return (
    <PageWrapper
      role="attendee"
      title="Notifications"
      subtitle={unreadCount > 0 ? `You have ${unreadCount} unread notifications` : 'All caught up!'}
    >
      <Card padding={false}>
        <div className="p-2">
          <NotificationFeed notifications={[]} />
        </div>
      </Card>
    </PageWrapper>
  );
}
