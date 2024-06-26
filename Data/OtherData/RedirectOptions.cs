namespace Kamran_Portfolio.Data.OtherData
{
    public class RedirectOptions
    {
        public string Controller { get; set; }
        public string View { get; set; }

        public RedirectOptions()
        {
            Controller = "User";
            View = "Dashboard";
        }

        public RedirectOptions(string view, string controller)
        {
            Controller = controller;
            View = view;
        }
    }
}
