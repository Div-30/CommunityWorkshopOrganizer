namespace CommunityWorkshopOrganizer.Services
{
    /// <summary>
    /// Generates consistent, branded HTML email bodies.
    /// </summary>
    public static class EmailTemplates
    {
        private static string Wrap(string content) => $@"
<!DOCTYPE html>
<html>
<head><meta charset='utf-8'></head>
<body style='margin:0;padding:0;background:#f4f4f5;font-family:Inter,sans-serif;'>
  <div style='max-width:600px;margin:32px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);'>
    <div style='background:linear-gradient(135deg,#4f46e5,#7c3aed);padding:28px 32px;'>
      <h1 style='margin:0;color:#ffffff;font-size:20px;font-weight:700;'>🎓 Community Workshop Organizer</h1>
    </div>
    <div style='padding:32px;'>
      {content}
    </div>
    <div style='background:#f9fafb;padding:16px 32px;border-top:1px solid #e5e7eb;'>
      <p style='margin:0;font-size:12px;color:#9ca3af;'>This is an automated message from Community Workshop Organizer. Please do not reply.</p>
    </div>
  </div>
</body>
</html>";

        public static string RegistrationConfirmed(string userName, string workshopTitle, string eventDate) =>
            Wrap($@"
              <h2 style='margin:0 0 8px;color:#111827;font-size:22px;'>You're registered! 🎉</h2>
              <p style='color:#6b7280;margin:0 0 24px;'>Hi {userName}, your spot has been confirmed.</p>
              <div style='background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:20px;margin-bottom:24px;'>
                <p style='margin:0 0 4px;font-weight:600;color:#15803d;font-size:16px;'>{workshopTitle}</p>
                <p style='margin:0;color:#166534;font-size:14px;'>📅 {eventDate}</p>
              </div>
              <p style='color:#374151;font-size:14px;'>See you there! You can manage your registrations from your schedule page.</p>");

        public static string RegistrationCancelled(string userName, string workshopTitle) =>
            Wrap($@"
              <h2 style='margin:0 0 8px;color:#111827;font-size:22px;'>Registration Cancelled</h2>
              <p style='color:#6b7280;margin:0 0 24px;'>Hi {userName}, your registration for <strong>{workshopTitle}</strong> has been cancelled.</p>
              <p style='color:#374151;font-size:14px;'>If this was a mistake, you can re-register as long as spots are still available.</p>");

        public static string WorkshopApproved(string organizerName, string workshopTitle) =>
            Wrap($@"
              <h2 style='margin:0 0 8px;color:#111827;font-size:22px;'>Workshop Approved ✅</h2>
              <p style='color:#6b7280;margin:0 0 24px;'>Hi {organizerName}, great news!</p>
              <div style='background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:20px;margin-bottom:24px;'>
                <p style='margin:0;font-weight:600;color:#15803d;font-size:16px;'>{workshopTitle}</p>
                <p style='margin:4px 0 0;color:#166534;font-size:14px;'>Status: Live — attendees can now register</p>
              </div>
              <p style='color:#374151;font-size:14px;'>Your workshop is now visible to all attendees on the platform. Good luck!</p>");

        public static string WorkshopRejected(string organizerName, string workshopTitle, string reason) =>
            Wrap($@"
              <h2 style='margin:0 0 8px;color:#111827;font-size:22px;'>Workshop Needs Changes</h2>
              <p style='color:#6b7280;margin:0 0 24px;'>Hi {organizerName}, your workshop requires some updates before it can be approved.</p>
              <div style='background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:20px;margin-bottom:24px;'>
                <p style='margin:0 0 8px;font-weight:600;color:#991b1b;'>{workshopTitle}</p>
                <p style='margin:0;color:#7f1d1d;font-size:14px;'><strong>Feedback:</strong> {reason}</p>
              </div>
              <p style='color:#374151;font-size:14px;'>Please update your workshop based on the feedback above and resubmit.</p>");

        public static string OrganizerRequestApproved(string userName) =>
            Wrap($@"
              <h2 style='margin:0 0 8px;color:#111827;font-size:22px;'>You're now an Organizer! 🚀</h2>
              <p style='color:#6b7280;margin:0 0 24px;'>Hi {userName}, your organizer application has been approved.</p>
              <div style='background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:20px;margin-bottom:24px;'>
                <p style='margin:0;color:#1e40af;font-size:14px;'>You can now create and manage workshops on the platform. Log in and head to your Organizer Dashboard to get started.</p>
              </div>");

        public static string OrganizerRequestRejected(string userName, string reason) =>
            Wrap($@"
              <h2 style='margin:0 0 8px;color:#111827;font-size:22px;'>Organizer Application Update</h2>
              <p style='color:#6b7280;margin:0 0 24px;'>Hi {userName}, thank you for applying to become an organizer.</p>
              <div style='background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:20px;margin-bottom:24px;'>
                <p style='margin:0;color:#7f1d1d;font-size:14px;'><strong>Feedback:</strong> {reason}</p>
              </div>
              <p style='color:#374151;font-size:14px;'>You are welcome to apply again once you've addressed the feedback above.</p>");
    }
}
