export const formatFriendlyDate = (value) =>
  new Date(value).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

export const formatFriendlyTime = (value) =>
  new Date(value).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

export const getFirstName = (fullName) => String(fullName || 'there').trim().split(' ')[0];

export const getCapacityLabel = (currentAttendees, capacity) =>
  `${currentAttendees || 0}/${capacity} seats filled`;
