using CommunityWorkshopOrganizer.Models;
using CommunityWorkshopOrganizer.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CommunityWorkshopOrganizer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        // POST /api/user — public: self-registration (Attendee role only)
        [HttpPost]
        public ActionResult<User> CreateUser([FromBody] User user)
        {
            var result = _userService.CreateUser(user);

            if (result.Status == UserResultStatus.ValidationError || result.Status == UserResultStatus.Duplicate)
                return BadRequest(result.Message);

            return CreatedAtAction(nameof(GetUserById), new { id = result.Data!.UserId }, result.Data);
        }

        // GET /api/user — Admin/Manager: view all users
        [HttpGet]
        [Authorize(Roles = "Admin,Manager")]
        public ActionResult<IEnumerable<User>> GetAllUsers()
        {
            var result = _userService.GetAllUsers();
            return Ok(result.Data);
        }

        // GET /api/user/profile — Any authenticated user: view own profile
        [HttpGet("profile")]
        [Authorize]
        public ActionResult<User> GetMyProfile()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var result = _userService.GetUserProfile(userId);

            if (result.Status == UserResultStatus.NotFound)
                return NotFound(result.Message);

            return Ok(result.Data);
        }

        public class UpdateProfileRequest
        {
            public string? FullName { get; set; }
            public string? Password { get; set; }
        }

        // PUT /api/user/profile — Any authenticated user: update own profile
        [HttpPut("profile")]
        [Authorize]
        public ActionResult<User> UpdateMyProfile([FromBody] UpdateProfileRequest request)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var result = _userService.UpdateProfile(userId, request.FullName, request.Password);

            if (result.Status == UserResultStatus.NotFound)
                return NotFound(result.Message);

            return Ok(result.Data);
        }

        // DELETE /api/user/profile — Any authenticated user: delete own account
        [HttpDelete("profile")]
        [Authorize]
        public IActionResult DeleteMyProfile()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var result = _userService.DeleteUser(userId);

            if (result.Status == UserResultStatus.NotFound)
                return NotFound(result.Message);

            return Ok(new { Message = result.Message });
        }

        // GET /api/user/{id} — any authenticated user
        [HttpGet("{id}")]
        [Authorize]
        public ActionResult<User> GetUserById(int id)
        {
            var result = _userService.GetUserById(id);

            if (result.Status == UserResultStatus.NotFound)
                return NotFound(result.Message);

            return Ok(result.Data);
        }

        // DELETE /api/user/{id} — Admin only: delete any user
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public IActionResult DeleteUser(int id)
        {
            var result = _userService.DeleteUser(id);

            if (result.Status == UserResultStatus.NotFound)
                return NotFound(result.Message);

            return Ok(new { Message = result.Message });
        }
    }
}