using CommunityWorkshopOrganizer.Models;

namespace CommunityWorkshopOrganizer.Services
{
    public interface IUserService
    {
        (bool Success, string Message, User? Data) CreateUser(User user);
        (bool Success, string Message, IEnumerable<User>? Data) GetAllUsers();
        (bool Success, string Message, User? Data) GetUserById(int userId);
    }
}