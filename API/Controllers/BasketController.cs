using System;
using System.Linq;
using System.Net;
using System.Reflection.Metadata.Ecma335;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
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
            var basket = await RetrieveBasket();
            BasketDto output = new BasketDto();

            // Check if there is a basket.
            if (basket == null)
            {
                // if there is no basket return not found.
                return NotFound();
            }

            // Map BasketDto properties with Basket properties
            output = MapBasketToDto(basket);

            return output;
        }


        // Those two parameters will be added as query strings (via URL).
        // the url will look like this 'api/basket?productId=3&quantity=2'
        [HttpPost]
        public async Task<ActionResult<BasketDto>> AddItemToBasket(int productId, int quantity)
        {
            // get basket || create basket (if the user don't have a basket, I have to create it first)
            Basket basket = await RetrieveBasket();

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
                basketDto = MapBasketToDto(basket);
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
            // get basket - user should already have a basket created
            Basket basket = await RetrieveBasket();

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

        private async Task<Basket> RetrieveBasket()
        {
            /*  When a user creates a basket on my server, I'm going to return him a BuyerId.
                which is going to be sent back to him a cookie and cookies are stored in user's browser in presistance storage.
                And for every request and response I used a cookie that goes backwards and forwards
                between the client and the server so I have access to the cookie. */

            var basket = await _context.Baskets
                // I have to explicit say that I will BasketItems to be included in cookie.
                .Include(i => i.Items)
                // BasketItem contain Product so I have to include that as well.
                .ThenInclude(p => p.Product)
                // BuyerId comes from database, and 'buyerId comes from request from client.
                .FirstOrDefaultAsync(x => x.BuyerId == Request.Cookies["buyerId"]);

            // First of default return basket object or null because default valuer for any object is null.
            return basket;
        }


        private Basket CreateBasket()
        {
            // Create global unique identifier
            var buyerId = Guid.NewGuid().ToString();

            // create cookie options
            var cookieOptions = new CookieOptions{
                                            // This cookie is essential  to the operation of out application. 
                                            IsEssential = true, 
                                            // Expires after 30 days.
                                            Expires = DateTime.Now.AddDays(30)
                                            };

            // Inside controller I have access to Response.
            Response.Cookies.Append("buyerId", buyerId, cookieOptions);

            // Create basket and provide buyerId.
            var basket = new Basket{BuyerId = buyerId};

            // Add basket to the database so that EF can start tracking this entity. 
            _context.Baskets.Add(basket);

            return basket; 
        }

        private static BasketDto MapBasketToDto(Basket basket)
        {
            // Map BasketDto properties with Basket properties,
            // And take only properties that I'm interasted in.
            BasketDto basketDto = new BasketDto
            {
                Id = basket.Id,
                BuyerId = basket.BuyerId,
                // I want to project BasketItem into BasketItemDto
                // I think that each 'item' in Items will be matched with ... NOT REALY UNDERSTAND.
                Items = basket.Items.Select(item => new BasketItemDto
                {
                    ProductId = item.ProductId,
                    Name = item.Product.Name,
                    Price = item.Product.Price,
                    PictureUrl = item.Product.PictureUrl,
                    Type = item.Product.Type,
                    Brand = item.Product.Brand,
                    Quantity = item.Quantity
                }).ToList()
            };

            return basketDto;
        }
    }
}