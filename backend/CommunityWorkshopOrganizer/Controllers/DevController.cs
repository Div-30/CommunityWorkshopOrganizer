using CommunityWorkshopOrganizer.Data;
using Microsoft.AspNetCore.Mvc;

namespace CommunityWorkshopOrganizer.Controllers
{
    /// <summary>
    /// Development-only helper endpoints. These are ONLY active when the app runs
    /// in Development mode (i.e., local "dotnet run"). They are completely
    /// inaccessible in Production.
    /// </summary>
    [Route("api/dev")]
    [ApiController]
    public class DevController : ControllerBase
    {
        private readonly ApiContext _context;
        private readonly IWebHostEnvironment _env;

        public DevController(ApiContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // GET /api/dev/users — list all users with their roles
        [HttpGet("users")]
        public IActionResult GetUsers()
        {
            if (!_env.IsDevelopment()) return NotFound();

            var users = _context.Users.Select(u => new
            {
                u.UserId,
                u.FullName,
                u.Email,
                u.UserRole,
                u.CreatedAt
            }).ToList();

            return Ok(users);
        }

        // POST /api/dev/promote/{userId}?role=Admin|Organizer|Attendee
        [HttpPost("promote/{userId}")]
        public IActionResult PromoteUser(int userId, [FromQuery] string role)
        {
            if (!_env.IsDevelopment()) return NotFound();

            var allowed = new[] { "Admin", "Organizer", "Attendee" };
            if (!allowed.Contains(role))
                return BadRequest($"Role must be one of: {string.Join(", ", allowed)}");

            var user = _context.Users.Find(userId);
            if (user == null) return NotFound($"User {userId} not found.");

            var oldRole = user.UserRole;
            user.UserRole = role;
            _context.SaveChanges();

            return Ok(new
            {
                Message = $"✅ {user.Email} promoted from '{oldRole}' → '{role}'",
                user.UserId,
                user.Email,
                user.UserRole
            });
        }
    }
}
