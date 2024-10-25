using Kamran_Portfolio.Models;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace Kamran_Portfolio.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        public IActionResult About()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        public string Table()
        {
            string res = "none";
            return res;
        }

        public ActionResult Images(string id)
        {
            return base.File("~/Images/"+id, "image/jpeg");
        }

        //public ActionResult css(string id)
        //{
        //    return base.File("~/" + id, "WOFF/WOFF2");
        //}
    }
}