using CommunityWorkshopOrganizer.Data;
using CommunityWorkshopOrganizer.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CommunityWorkshopOrganizer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WorkshopController : ControllerBase
    {
        private readonly ApiContext context;
        public WorkshopController(ApiContext apiContext)
        {
            context = apiContext;
        }

        [HttpPut]
        public ActionResult<IEnumerable<Workshop>> createWorkShop([FromBody] Workshop workshop)
        {
            context.Workshops.Add(workshop);
            context.SaveChanges();
            return Ok(workshop);

        }

    }
}
