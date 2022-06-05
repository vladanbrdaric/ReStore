namespace API.DTOs
{
    // This will be returned to the user when it login successfully.
    public class UserDto
    {
        public string Email { get; set; }
        public string Token { get; set; }

        public BasketDto Basket { get; set; }
    }
}
