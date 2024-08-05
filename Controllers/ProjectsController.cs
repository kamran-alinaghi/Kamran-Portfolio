using Kamran_Portfolio.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Kamran_Portfolio.Data.DataContexts;
using Kamran_Portfolio.Data.OtherData;
using MongoDB.Bson;
using MongoDB.Driver;
using NuGet.Configuration;

namespace Kamran_Portfolio.Controllers
{
    public class ProjectsController : Controller
    {
        private LoginContext ctext = new LoginContext();
        private IHttpContextAccessor _contex;

        public ProjectsController(IHttpContextAccessor contex)
        {
            _contex = contex;
        }
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Categorizing()
        {
            UserInfo? user = GetUserInSession();
            if (user == null || user.Id < 1)
            {
                SetRedirectSession(new RedirectOptions("Categorizing", "Projects"));
                return RedirectToAction("IndexRedirect", "User");
            }
            return View(user);
        }

        public IActionResult TableTest()
        {
            return View();
        }








        private void SetUserInSession(UserInfo user)
        {
            if (user != null && user.Id > 0)
            {
                string jsonUser = JsonConvert.SerializeObject(user);
                _contex.HttpContext.Session.SetString("user", jsonUser);
            }
        }

        private UserInfo? GetUserInSession()
        {
            if (String.Equals(Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT"), "Development"))
            {
                return new UserInfo(3, "testUser");
            }
            string? jsonUser = _contex.HttpContext.Session.GetString("user");
            if (jsonUser != null && jsonUser.Length > 0)
            {
                return JsonConvert.DeserializeObject<UserInfo>(jsonUser);
            }
            else { return null; }
        }

        private void SetRedirectSession(RedirectOptions redirectOptions)
        {
            _contex.HttpContext.Session.SetString("redirectOptions", JsonConvert.SerializeObject(redirectOptions));
        }

        private RedirectOptions GetRedirectSession()
        {
            string? redirectStr = _contex.HttpContext.Session.GetString("redirectOptions");
            if (redirectStr != null && redirectStr.Length > 0) { return JsonConvert.DeserializeObject<RedirectOptions>(redirectStr); }
            else { return new RedirectOptions("Dashboard", "User"); }
        }
    }
}
