namespace Kamran_Portfolio.Models
{
    public class UserInfo
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string? PhoneNumber { get; set; }
        public DateTime BirthDate { get; set; }
        public string? AddressLine1 { get; set; }
        public string? AddressLine2 { get; set; }
        public string? City { get; set; }
        public string? Province { get; set; }
        public string? Country { get; set; }
        public string? PostalCode { get; set; }

        public UserInfo() { }

        public UserInfo(int id, string name)
        {
            Id = id;
            Name = name;
            Email = "email@email.com";
            Password = "password";
            BirthDate = new DateTime();
        }
    }
}
