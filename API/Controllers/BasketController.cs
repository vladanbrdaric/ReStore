using System;
using System.Linq;
using System.Net;
using System.Reflection.Metadata.Ecma335;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class BasketController : BaseApiController
    {
        private readonly StoreContext _context;
        public BasketController(StoreContext context)
        {
            _context = context;
        }


        // Get a basket using cookie. This method will give me access to user basket here on server side.
        [HttpGet(Name = "GetBasket")]
        public async Task<ActionResult<BasketDto>> GetBasket()
        {
            // try to get buyerId from the method GetBuyerId.
            var buyerId = GetBuyerId();

            var basket = await RetrieveBasket(buyerId);
            BasketDto output = new BasketDto();

            // Check if there is a basket.
            if (basket == null)
            {
                // if there is no basket return not found.
                return NotFound();
            }

            // Map BasketDto properties with Basket properties
            output = basket.MapBasketToDto();

            return output;
        }


        // Those two parameters will be added as query strings (via URL).
        // the url will look like this 'api/basket?productId=3&quantity=2'
        [HttpPost]
        public async Task<ActionResult<BasketDto>> AddItemToBasket(int productId, int quantity)
        {
            // try to get buyerId from the method GetBuyerId.
            var buyerId = GetBuyerId();

            // get basket || create basket (if the user don't have a basket, I have to create it first)
            Basket basket = await RetrieveBasket(buyerId);

            // Check if basket is null
            if(basket == null)
            {
                // Create basket
                basket = CreateBasket();
            }

            // === At this point I have a basket. It comes either from database or from this CreateBasket method. ===

            // get product related to the item that I'm going to be adding.
            var product = await _context.Products.FindAsync(productId);

            // Check if item is null. If so return NotFound.
            if(product == null)
            {
                return BadRequest(new ProblemDetails{Title= "Product Not Found"});
            }

            // att the item to the basket.Y
            basket.AddItem(product, quantity);

            // Save the changes. This will return an int with the number of changes that has been made in the database.
            // This result will be 'true' or 'false'
            var result = await _context.SaveChangesAsync() > 0;

            // It the result is less then 0 that means that I havent made any changes in the database. And return BadRequest().
            if(result == true)
            {
                BasketDto basketDto = new BasketDto();
                basketDto = basket.MapBasketToDto();
                return CreatedAtRoute("GetBasket", basketDto);
            }
            else
            {
                return BadRequest(new ProblemDetails{Title= "Problem saving items to basket"});
            }
        }



        // Remove item from basket
        [HttpDelete]
        public async Task<ActionResult> RemoveBasketItem(int productId, int quantity)
        {
            // try to get buyerId from the method GetBuyerId.
            var buyerId = GetBuyerId();

            // get basket - user should already have a basket created
            Basket basket = await RetrieveBasket(buyerId);

            // check if basket exist
            if(basket == null)
            {
                return NotFound();
            }

            // reduce quantity of remove item if quantity is 0.
            basket.RemoveItem(productId, quantity);

            // Save the changes. This will return an int with the number of changes that has been made in the database.
            // This result will be 'true' or 'false'
            var result = await _context.SaveChangesAsync() > 0;

            // It the result is less then 0 that means that I havent made any changes in the database. And return BadRequest().
            if(result == true)
            {
                return Ok();
            }
            else
            {
                return BadRequest(new ProblemDetails{Title= "Problem removing item from the basket"});
            }

            //return Ok();
        }

        private async Task<Basket> RetrieveBasket(string buyerId)
        {
            /*  When a user creates a basket on my server, I'm going to return him a BuyerId.
                which is going to be sent back to him as cookie and cookies are stored in user's browser in presistance storage.
                And for every request and response I used a cookie that goes backwards and forwards
                between the client and the server so I have access to the cookie. */

            // There is a four states that I have to think about when it comes to basket.
            // 1. If there is no basket either anonymous or with the user, simply return nothing (remove the cookie and return null). -> this function.
            // 2. It there is anonymous basket but no basket for the user, then anonymous basket transfers to the user. 
            // 3. If there is a user basket but no anonymous basket, then I simply return the user basket.
            // 4. There is anomymous basket and there's a basekt for the user. In that case I'm going to overwrite the user's basket with the anonymous basket.
            //    because that would be the latest basekt that's been updated.


            // Check if 'buyerId' is null or empty
            if(string.IsNullOrEmpty(buyerId))
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
                .FirstOrDefaultAsync(x => x.BuyerId == buyerId);

            // First of default return basket object or null because default valuer for any object is null.
            return basket;
        }


        // Create a private method to get buyer id which in this case is 'name' which comes from the 'identity' or 'cookie'
        private string GetBuyerId()
        {
            // ?? -> no conditional operator. (this meands that if first condition is null, execute whatever is on the right of this.
            // This 'Name' comes from Identity. It has a value when user is logged in.
            return User.Identity?.Name ?? Request.Cookies["buyerId"];
        }


        private Basket CreateBasket()
        {
            // So If the user is logged in and I create a basket, then I'm going to set the buyerId to their username. If the user is not loged in, then I'm going to set it to GUID because they're not logged in,
            // and they'll work with anonymous basket.
            
            // 3. If there is a user basket but no anonymous basket, then I simply return the user basket.

            // This 'Name' comes from Identity. It has a value when user is logged in.
            var buyerId = User.Identity?.Name;

            // Check if buyerId if null or empty
            if(string.IsNullOrEmpty(buyerId))
            {
                // 2. If there is anonymous basket but no basket for the user, then anonymous basket transfers to the user. 

                // if so create new guid that represent buyerId that will be stored inside cookie.
                // Create global unique identifier
                buyerId = Guid.NewGuid().ToString();

                // create cookie options
                var cookieOptions = new CookieOptions{
                                            // This cookie is essential  to the operation of out application. 
                                            IsEssential = true, 
                                            // Expires after 30 days.
                                            Expires = DateTime.Now.AddDays(30)
                                            };

                // Inside controller I have access to Response.
                Response.Cookies.Append("buyerId", buyerId, cookieOptions);
            }

            // Create basket and provide buyerId.
            var basket = new Basket{BuyerId = buyerId.ToLower()};

            // Add basket to the database so that EF can start tracking this entity. 
            _context.Baskets.Add(basket);

            return basket; 
        }
    }
}