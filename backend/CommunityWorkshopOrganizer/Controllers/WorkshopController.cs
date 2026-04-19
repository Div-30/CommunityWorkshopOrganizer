using CommunityWorkshopOrganizer.Models;
using CommunityWorkshopOrganizer.Services;
using Microsoft.AspNetCore.Mvc;

namespace CommunityWorkshopOrganizer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WorkshopController : ControllerBase
    {
        private readonly IWorkshopService _workshopService;

        public WorkshopController(IWorkshopService workshopService)
        {
            _workshopService = workshopService;
        }

        [HttpPost]
        public ActionResult<Workshop> CreateWorkshop([FromBody] Workshop workshop)
        {
            var result = _workshopService.CreateWorkshop(workshop);
            
            if (result.Status == WorkshopResultStatus.ValidationError)
            {
                return BadRequest(result.Message);
            }
            if (result.Status == WorkshopResultStatus.NotFound)
            {
                return NotFound(result.Message);
            }

            return CreatedAtAction(nameof(GetWorkshopById), new { id = result.Data!.WorkshopId }, result.Data);
        }

        [HttpGet]
        public ActionResult<IEnumerable<Workshop>> GetAllWorkshops()
        {
            var result = _workshopService.GetAllWorkshops();
            return Ok(result.Data);
        }

        [HttpGet("{id}")]
        public ActionResult<Workshop> GetWorkshopById(int id)
        {
            var result = _workshopService.GetWorkshopById(id);

            if (result.Status == WorkshopResultStatus.NotFound)
            {
                return NotFound(result.Message);
            }

            return Ok(result.Data);
        }
    }
}