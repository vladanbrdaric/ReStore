using API.DTOs;
using API.Entities;
using System.Linq;

namespace API.Extensions
{
    public static class BasketExtensions
    {
        public static BasketDto MapBasketToDto(this Basket basket)
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
