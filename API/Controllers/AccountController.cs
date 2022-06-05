using API.DTOs;
using API.Entities;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using API.Data;
using Microsoft.EntityFrameworkCore;
using API.Extensions;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly UserManager<User> _userManager;
        private readonly TokenService _tokenService;
        private readonly StoreContext _context;

        public AccountController(UserManager<User> userManager, TokenService tokenService, StoreContext context)
        {
            _userManager = userManager;
            _tokenService = tokenService;
            _context = context;
        }


        // Endpoint for user to login.
        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            // check if user exist. It will return the 'user' or null.
            var user = await _userManager.FindByNameAsync(loginDto.UserName);

            // if user doesnt exist or the password from the database don't match provided one, don't allow user to login.
            if (user == null || !await _userManager.CheckPasswordAsync(user, loginDto.Password))
            {
                // return not authorized
                return Unauthorized();
            }

            // Get User basket. It is going to be null if the user does not have a basket in my database assigned to their username.
            var userBasket = await RetrieveBasket(loginDto.UserName);

            // get anonymous basket from the cookie.
            var anonymousBasket = await RetrieveBasket(Request.Cookies["buyerId"]);

            // 4. There is anomymous basket and there's a basekt for the user. In that case I'm going to overwrite the user's basket with the anonymous basket.
            //    because that would be the latest basekt that's been updated.

            // Check if there is a anonymous basket, because if I do have a basket and then I log in, then I need to transfer this basket to my user.
            if (anonymousBasket != null)
            {
                // check if user have an 'old' basket
                if (userBasket != null)
                {
                    // if user has a basket. then remove It and
                    _context.Baskets.Remove(userBasket);

                }

                // replace it with the anonymous basket.
                anonymousBasket.BuyerId = user.UserName.ToLower();

                // remote 'buyerId' from the cookie
                Response.Cookies.Delete("buyerId");

                // save changes
                await _context.SaveChangesAsync();
            }

            return new UserDto()
            {
                Email = user.Email,
                Token = await _tokenService.GenerateToken(user),

                // Set 'Basket' to 'anonymousBasket' it the 'anonymousBasket' is not null otherwise set Basket to 'userBasket'.
                // Extension methods -> lession 143. ca 12 minuta.
                Basket = anonymousBasket != null ? anonymousBasket.MapBasketToDto() : userBasket?.MapBasketToDto()
            };
        }


        // Endpoint to user to register new account.
        [HttpPost("register")]
        public async Task<ActionResult> Register(RegisterDto registerDto)
        {
            // Match provided user information with the properties that User class has.
            var newUser = new User { UserName = registerDto.UserName, Email = registerDto.Email };


            // ASP.NET Identity will take care of duplicate userName, Email or if the password doesnt meet complexity requirements.
            var result = await _userManager.CreateAsync(newUser, registerDto.Password);

            // if adding new user fails
            if (!result.Succeeded)
            {
                // it will return an array of fails depending on how many things got wrong. so i have to loop through all of the errors.
                foreach (var error in result.Errors)
                {
                    // this is a dictorionary where i add 'code' as key and description as 'value'
                    ModelState.AddModelError(error.Code, error.Description);
                }

                // at the end return validation problem
                return ValidationProblem();
            }


            // == if adding new user succeded. ==

            // Give the newUser a default role as a member.
            await _userManager.AddToRoleAsync(newUser, "Member");

            // return 201 - succedded
            return StatusCode(201);
        }

        // This endpoint will give me information about logedin user. Like "Hi vladan@brdaric.se" in the right up corner. 
        [Authorize]
        [HttpGet("currentUser")]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            // this code "User.Identity.Name" will get a user name form the name claim from the token.
            var user = await _userManager.FindByNameAsync(User.Identity.Name);

            // Get User basket. It is going to be null if the user does not have a basket in my database assigned to their username.
            var userBasket = await RetrieveBasket(User.Identity.Name);

            return new UserDto()
            {
                Email = user.Email,
                Token = await _tokenService.GenerateToken(user),
                Basket = userBasket?.MapBasketToDto()
            };
        }


        // This method is the same as in the 'BasketController'. I'm using it here because I want to try to get a basket for the loggedin user based upon users username.
        private async Task<Basket> RetrieveBasket(string buyerId)
        {
            /*  When a user creates a basket on my server, I'm going to return him a BuyerId.
                which is going to be sent back to him as cookie and cookies are stored in user's browser in presistance storage.
                And for every request and response I used a cookie that goes backwards and forwards
                between the client and the server so I have access to the cookie. */

            // Check if 'buyerId' is null or empty
            if (string.IsNullOrEmpty(buyerId))
            {
                // If so, delete cookie.
                Response.Cookies.Delete("buyerId");
                return null;
            }

            var basket = await _context.Baskets
                // I have to explicit say that I will BasketItems to be included in cookie.
                .Include(i => i.Items)
                // BasketItem contain Product so I have to include that as well.
                .ThenInclude(p => p.Product)
                // BuyerId comes from database, and 'buyerId comes from request from client.
                .FirstOrDefaultAsync(x => x.BuyerId == buyerId.ToLower());

            // First of default return basket object or null because default valuer for any object is null.
            return basket;
        }

    }
}
