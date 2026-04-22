using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace CommunityWorkshopOrganizer.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IConfiguration config, ILogger<EmailService> logger)
        {
            _config = config;
            _logger = logger;
        }

        public async Task SendAsync(string toEmail, string toName, string subject, string body)
        {
            try
            {
                var smtpHost = _config["Email:SmtpHost"];
                var smtpPortStr = _config["Email:SmtpPort"];
                var smtpUser = _config["Email:Username"];
                var smtpPass = _config["Email:Password"];
                var fromName = _config["Email:FromName"] ?? "Community Workshop";
                var fromEmail = _config["Email:FromEmail"] ?? smtpUser;

                // If email is not configured, just log and skip — don't crash the app
                if (string.IsNullOrWhiteSpace(smtpHost) || string.IsNullOrWhiteSpace(smtpUser))
                {
                    _logger.LogWarning("Email not configured. Skipping email to {ToEmail}: {Subject}", toEmail, subject);
                    return;
                }

                var message = new MimeMessage();
                message.From.Add(new MailboxAddress(fromName, fromEmail ?? smtpUser ?? string.Empty));
                message.To.Add(new MailboxAddress(toName, toEmail));
                message.Subject = subject;

                message.Body = new TextPart("html") { Text = body };

                using var client = new SmtpClient();
                var port = int.TryParse(smtpPortStr, out var p) ? p : 587;
                await client.ConnectAsync(smtpHost, port, SecureSocketOptions.StartTls);
                await client.AuthenticateAsync(smtpUser ?? string.Empty, smtpPass ?? string.Empty);
                await client.SendAsync(message);
                await client.DisconnectAsync(true);

                _logger.LogInformation("Email sent to {ToEmail}: {Subject}", toEmail, subject);
            }
            catch (Exception ex)
            {
                // Never crash the main flow because of email failure — just log it
                _logger.LogError(ex, "Failed to send email to {ToEmail}", toEmail);
            }
        }
    }
}
