using CommunityWorkshopOrganizer.Data;
using CommunityWorkshopOrganizer.Models;

namespace CommunityWorkshopOrganizer.Services
{
    public class UserService : IUserService
    {
        private readonly ApiContext _context;

        public UserService(ApiContext context)
        {
            _context = context;
        }

        public (UserResultStatus Status, string Message, User? Data) CreateUser(User user)
        {
            if (string.IsNullOrWhiteSpace(user.Email) || string.IsNullOrWhiteSpace(user.FullName))
            {
                return (UserResultStatus.ValidationError, "Email and Full Name are required.", null);
            }

            if (_context.Users.Any(u => u.Email == user.Email))
            {
                return (UserResultStatus.Duplicate, "A user with this email address already exists.", null);
            }

            if (string.IsNullOrWhiteSpace(user.Password))
            {
                return (UserResultStatus.ValidationError, "Password is required.", null);
            }

            // Only "Attendee" is permitted via self-registration.
            // "Organizer" and "Admin" roles must be assigned by an Admin.
            if (user.UserRole != "Attendee")
            {
                return (UserResultStatus.ValidationError, "Only 'Attendee' role is allowed for self-registration.", null);
            }

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(user.Password);

            user.CreatedAt = DateTime.UtcNow;
            
            _context.Users.Add(user);
            _context.SaveChanges();

            return (UserResultStatus.Success, "User created successfully.", user);
        }

        public (UserResultStatus Status, string Message, IEnumerable<User>? Data) GetAllUsers()
        {
            var users = _context.Users.ToList();
            return (UserResultStatus.Success, "Users retrieved successfully.", users);
        }

        public (UserResultStatus Status, string Message, User? Data) GetUserById(int userId)
        {
            var user = _context.Users.Find(userId);
            
            if (user == null)
            {
                return (UserResultStatus.NotFound, "User not found.", null);
            }

            return (UserResultStatus.Success, "User found.", user);
        }

        public (UserResultStatus Status, string Message, User? Data) GetUserProfile(int userId)
        {
            // Same as GetUserById but explicitly meant for the token owner querying themselves.
            var user = _context.Users.Find(userId);
            if (user == null)
            {
                return (UserResultStatus.NotFound, "User not found.", null);
            }
            return (UserResultStatus.Success, "Profile retrieved successfully.", user);
        }

        public (UserResultStatus Status, string Message, User? Data) UpdateProfile(int userId, string? fullName, string? password)
        {
            var user = _context.Users.Find(userId);
            if (user == null)
            {
                return (UserResultStatus.NotFound, "User not found.", null);
            }

            if (!string.IsNullOrWhiteSpace(fullName))
            {
                user.FullName = fullName;
            }

            if (!string.IsNullOrWhiteSpace(password))
            {
                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(password);
            }

            _context.SaveChanges();
            return (UserResultStatus.Success, "Profile updated successfully.", user);
        }

        public (UserResultStatus Status, string Message) DeleteUser(int userId)
        {
            var user = _context.Users.Find(userId);
            if (user == null)
            {
                return (UserResultStatus.NotFound, "User not found.");
            }

            // By removing the user, EF Core cascade delete will handle their registrations and created workshops
            _context.Users.Remove(user);
            _context.SaveChanges();

            return (UserResultStatus.Success, "User deleted successfully.");
        }
    }
}