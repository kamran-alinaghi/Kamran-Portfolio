using Kamran_Portfolio.Data;
using Kamran_Portfolio.Models;
using Microsoft.AspNetCore.Mvc;

namespace Kamran_Portfolio.Controllers
{
    public class UserController : Controller
    {
        private LoginContext ctext = new LoginContext();
        private IHttpContextAccessor _contex;

        public UserController(IHttpContextAccessor contex)
        {
            _contex = contex;
        }

        public IActionResult Index()
        {
            UserInfo? user = GetUserFromDB(GetUserIdFromSession());
            if (user != null && user.Id > 0) { return RedirectToAction("Dashboard", "User"); }
            else { return RedirectToAction("Login", "User"); }
        }

        public IActionResult IndexRedirect()
        {
            UserInfo? user = GetUserFromDB(GetUserIdFromSession());
            if (user != null && user.Id > 0)
            {
                RedirectOptions redirectOptions = GetRedirectSession();
                AddUserIdIntoSession(user.Id);
                return RedirectToAction(redirectOptions.View, redirectOptions.Controller);
            }
            else
            {
                return RedirectToAction("Login", "User");
            }
        }

        [HttpPost]
        public IActionResult IndexPost(string username, string password)
        {
            UserInfo user = GetUserFromDB(username, password);
            if (user != null && user.Id > 0)
            {
                RedirectOptions redirectOptions = GetRedirectSession();
                _contex.HttpContext.Session.SetString("Id", user.Id.ToString());
                return RedirectToAction(redirectOptions.View, redirectOptions.Controller);
            }
            else { 
                return RedirectToAction("Login", "User"); 
            }
        }

        public IActionResult Dashboard()
        {
            UserInfo? user = GetUserFromDB(GetUserIdFromSession());
            if (user != null && user.Id > 0)
            {
                AddUserIdIntoSession(user.Id);
                return View(user);
            }
            else
            {
                SetRedirectSession("Dashboard", "User");
                return RedirectToAction("IndexRedirect", "User");
            }
        }

        public IActionResult Login()
        {
            RedirectOptions redirectOptions = GetRedirectSession();
            UserInfo? user = GetUserFromDB(GetUserIdFromSession());
            if (user != null && user.Id > 0) {
                AddUserIdIntoSession(user.Id);
                return RedirectToAction(redirectOptions.View, redirectOptions.Controller); 
            }
            else { return View(); }
        }







        private void SetRedirectSession(string view, string controller)
        {
            _contex.HttpContext.Session.SetString("view", view);
            _contex.HttpContext.Session.SetString("controller", controller);
        }

        private RedirectOptions GetRedirectSession()
        {
            string? v =_contex.HttpContext.Session.GetString("view");
            string? c =_contex.HttpContext.Session.GetString("controller");
            if(v == null || v.Length < 1) { v = "Dashboard"; }
            if (c == null || c.Length < 1) { c = "User"; }
            return new RedirectOptions(v, c);
        }

        private void AddUserIdIntoSession(int Id)
        {
            _contex.HttpContext.Session.SetString("Id", Id.ToString());
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

        private UserInfo? GetUserFromDB(string _username, string _password)
        {
            List<UserInfo> users = new List<UserInfo>();

            var res = from l in ctext.UserInfo
                      where l.Email == _username && l.Password == _password
                      select l;

            foreach (var item in res)
            {
                users.Add(item);
            }

            if (users.Count > 0 && users.Count < 2)
            {
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
