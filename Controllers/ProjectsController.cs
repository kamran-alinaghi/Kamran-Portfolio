using Microsoft.AspNetCore.Mvc;

namespace Kamran_Portfolio.Controllers
{
    public class ProjectsController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Categorizing()
        {
            return View();
        }
    }
}
