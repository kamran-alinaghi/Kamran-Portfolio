using Kamran_Portfolio.Models;
using Kamran_Portfolio.Data;
using Microsoft.AspNetCore.Mvc;

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
            UserInfo? user = GetUserFromDB(GetUserIdFromSession());
            if (user == null || user.Id < 1)
            {
                SetRedirectSession("Categorizing", "Projects");
                return RedirectToAction("IndexRedirect", "User");
            }
            return View(user);
        }




        private void SetRedirectSession(string view,string controller)
        {
            _contex.HttpContext.Session.SetString("view", view);
            _contex.HttpContext.Session.SetString("controller", controller);
        }
        private UserInfo? GetUserFromDB(int id)
        {
            List<UserInfo> users = new List<UserInfo>();
            var res = from l in ctext.UserInfo
                      where l.Id == id
                      select l;

            foreach (var item in res)
            {
                users.Add(item);
            }

            if (users.Count > 0 && users.Count < 2)
            {
                //_contex.HttpContext.Session.SetString("Id", users[0].Id.ToString());
                return users[0];
            }
            else { return null; }
        }

        private int GetUserIdFromSession()
        {
            int tempId;
            string _idStr = _contex.HttpContext.Session.GetString("Id");
            try { tempId = Int32.Parse(_idStr); }
            catch { tempId = -1; }
            return tempId;
        }
    }
}
