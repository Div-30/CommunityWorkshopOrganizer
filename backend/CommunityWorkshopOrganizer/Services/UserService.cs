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
            // 1. Validation
            if (_context.Users.Any(u => u.Email == user.Email))
            {
                return (false, "A user with this email address already exists.", null);
            }

            // 2. Set the timestamp
            user.CreatedAt = DateTime.UtcNow;
            
            // 3. Save to database
            _context.Users.Add(user);
            _context.SaveChanges();

            return (true, "User created successfully.", user);
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