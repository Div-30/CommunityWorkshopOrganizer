using CommunityWorkshopOrganizer.Models;
using CommunityWorkshopOrganizer.Services;
using Microsoft.AspNetCore.Mvc;

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

        [HttpPost]
        public ActionResult<User> CreateUser([FromBody] User user)
        {
            var result = _userService.CreateUser(user);
            
            if (!result.Success)
            {
                return BadRequest(result.Message);
            }

            return CreatedAtAction(nameof(GetUserById), new { id = result.Data!.UserId }, result.Data);
        }

        [HttpGet]
        public ActionResult<IEnumerable<User>> GetAllUsers()
        {
            var result = _userService.GetAllUsers();
            return Ok(result.Data);
        }

        [HttpGet("{id}")]
        public ActionResult<User> GetUserById(int id)
        {
            var result = _userService.GetUserById(id);

            if (!result.Success)
            {
                return NotFound(result.Message);
            }

            return Ok(result.Data);
        }
    }
}