using CommunityWorkshopOrganizer.Models;
using CommunityWorkshopOrganizer.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CommunityWorkshopOrganizer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ResourceController : ControllerBase
    {
        private readonly IResourceService _resourceService;

        public ResourceController(IResourceService resourceService)
        {
            _resourceService = resourceService;
        }

        // GET /api/resource/workshop/{workshopId}
        // — any authenticated user, but access is enforced by registration status in the service
        [HttpGet("workshop/{workshopId}")]
        [Authorize]
        public IActionResult GetResourcesByWorkshop(int workshopId)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var userRole = User.FindFirstValue(ClaimTypes.Role)!;
            var result = _resourceService.GetResourcesByWorkshop(workshopId, userId, userRole);

            if (result.Status == ResourceResultStatus.NotFound)
                return NotFound(result.Message);

            if (result.Status == ResourceResultStatus.Forbidden)
                return StatusCode(403, result.Message);

            return Ok(result.Data);
        }

        // POST /api/resource — Organiser only; can only add to their own workshop
        [HttpPost]
        [Authorize(Roles = "Organiser")]
        public IActionResult AddResource([FromBody] Resource resource)
        {
            var organizerId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var result = _resourceService.AddResource(resource, organizerId);

            if (result.Status == ResourceResultStatus.ValidationError)
                return BadRequest(result.Message);

            if (result.Status == ResourceResultStatus.NotFound)
                return NotFound(result.Message);

            if (result.Status == ResourceResultStatus.Forbidden)
                return StatusCode(403, result.Message);

            return CreatedAtAction(nameof(GetResourcesByWorkshop),
                new { workshopId = result.Data!.WorkshopId }, result.Data);
        }

        // DELETE /api/resource/{id} — Organiser only; can only delete from their own workshop
        [HttpDelete("{id}")]
        [Authorize(Roles = "Organiser")]
        public IActionResult DeleteResource(int id)
        {
            var organizerId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var result = _resourceService.DeleteResource(id, organizerId);

            if (result.Status == ResourceResultStatus.NotFound)
                return NotFound(result.Message);

            if (result.Status == ResourceResultStatus.Forbidden)
                return StatusCode(403, result.Message);

            return Ok(new { Message = result.Message });
        }
    }
}
