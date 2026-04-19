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

        public (bool Success, string Message, User? Data) CreateUser(User user)
        {
           if (string.IsNullOrWhiteSpace(user.Email) || string.IsNullOrWhiteSpace(user.FullName))
            {
                return (UserResultStatus.ValidationError, "Email and Full Name are required.", null);
            }

            user.CreatedAt = DateTime.UtcNow;
            
            _context.Users.Add(user);
            _context.SaveChanges();

            return (UserResultStatus.Success, "User created successfully.", user);
        }

        public (bool Success, string Message, IEnumerable<User>? Data) GetAllUsers()
        {
            var users = _context.Users.ToList();
            return (true, "Users retrieved successfully.", users);
        }

        public (bool Success, string Message, User? Data) GetUserById(int userId)
        {
            var user = _context.Users.Find(userId);
            
            if (user == null)
            {
                return (false, "User not found.", null);
            }

            return (true, "User found.", user);
        }
    }
}