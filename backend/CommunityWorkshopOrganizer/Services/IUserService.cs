using CommunityWorkshopOrganizer.Models;

namespace CommunityWorkshopOrganizer.Services
{
    public enum UserResultStatus
    {
        Success,
        NotFound,
        Duplicate,
        ValidationError
    }

    public interface IUserService
    {
        (UserResultStatus Status, string Message, User? Data) CreateUser(User user);
        (UserResultStatus Status, string Message, IEnumerable<User>? Data) GetAllUsers();
        (UserResultStatus Status, string Message, User? Data) GetUserById(int userId);
    }
}