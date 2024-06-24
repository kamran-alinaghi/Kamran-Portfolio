using Kamran_Portfolio.Data;
using Kamran_Portfolio.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

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
            UserInfo? user = GetUserInSession();
            if (user != null && user.Id > 0) { return RedirectToAction("Dashboard", "User"); }
            else { return RedirectToAction("Login", "User"); }
        }

        public IActionResult IndexRedirect()
        {
            UserInfo? user = GetUserInSession();
            if (user != null && user.Id > 0)
            {
                RedirectOptions redirectOptions = GetRedirectSession();
                SetUserInSession(user);
                return RedirectToAction(redirectOptions.View, redirectOptions.Controller);
            }
            else
            {
                return RedirectToAction("Login", "User");
            }
        }

        [HttpPost]
        public IActionResult Index(string username, string password)
        {
            UserInfo user = GetUserFromDB(username, password);
            if (user != null && user.Id > 0)
            {
                RedirectOptions redirectOptions = GetRedirectSession();
                SetUserInSession(user);
                return RedirectToAction(redirectOptions.View, redirectOptions.Controller);
            }
            else
            {
                return RedirectToAction("Login", "User");
            }
        }

        public IActionResult Dashboard()
        {
            UserInfo? user = GetUserInSession();
            if (user != null && user.Id > 0)
            {
                SetUserInSession(user);
                return View(user);
            }
            else
            {
                SetRedirectSession(new RedirectOptions("Dashboard", "User"));
                return RedirectToAction("IndexRedirect", "User");
            }
        }

        public IActionResult Login()
        {
            RedirectOptions redirectOptions = GetRedirectSession();
            UserInfo? user = GetUserInSession();
            if (user != null && user.Id > 0)
            {
                SetUserInSession(user);
                return RedirectToAction(redirectOptions.View, redirectOptions.Controller);
            }
            else { return View(); }
        }

        public IActionResult Register()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Register(string name, string username, string password, string DOB)
        {
            int InjectID = GetLastID();
            bool canAdd = DoesMatch(username);
            if (canAdd)
            {
                UserInfo user = new UserInfo();
                user.Id = InjectID + 1;
                user.Name = name;
                user.Password = password;
                user.Email = username;
                user.BirthDate = DateTime.Parse(DOB);
                ctext.Add(user);
                await ctext.SaveChangesAsync();
                SetUserInSession(user);
            }
            RedirectOptions redirectOptions = GetRedirectSession();
            return RedirectToAction(redirectOptions.View, redirectOptions.Controller);
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
            string? jsonUser = _contex.HttpContext.Session.GetString("user");
            if (jsonUser != null && jsonUser.Length > 0)
            {
                return JsonConvert.DeserializeObject<UserInfo>(jsonUser);
            }
            else { return null; }
        }

        private bool DoesMatch(string userName)
        {
            List<UserInfo> users = new List<UserInfo>();
            var res = from l in ctext.UserInfo
                      where l.Email == userName
                      select l;
            return !res.Any();
        }

        private int GetLastID()
        {
            List<UserInfo> users = new List<UserInfo>();
            var res = from l in ctext.UserInfo
                      select l.Id;
            return res.Max();
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
    }
}
