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
        (UserResultStatus Status, string Message, User? Data) GetUserProfile(int userId);
        (UserResultStatus Status, string Message, User? Data) UpdateProfile(int userId, string? fullName, string? password);
        (UserResultStatus Status, string Message) DeleteUser(int userId);
    }
}