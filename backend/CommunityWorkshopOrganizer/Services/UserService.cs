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

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(user.PasswordHash);

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
    }
}