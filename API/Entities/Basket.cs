using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using Microsoft.AspNetCore.Components.Web.Virtualization;

namespace API.Entities
{
    public class Basket
    {
        // EF will create this Id for me.
        public int Id { get; set; }

        // Only propery that I need to create the value. Check BasketController.cs - CreateBasket.
        public string BuyerId { get; set; }

        // Whenever I create new instance of basket it will create a new empty list for the BasketItems.
        public List<BasketItem> Items { get; set; } = new();

        // New way of initializing a list
        //public List<BasketItem> Items2 { get; set; } = new();


        public void AddItem(Product product, int quantity)
        {
            // Get all products from Items, and check if 'product' is already in basket.
            if(Items.All(item => item.ProductId != product.Id))
            {  
                // Create new BasketItem object and provide that whole product and quantity as well to the basket.
                Items.Add(new BasketItem{Product = product, Quantity = quantity});
            }

            // OBS: At this point product should exist in the 'Items'.

            // Get that item that I just put in the basket. I know what the item is,
            // But I dont know the item quantity.
            var exstistingItem = Items.FirstOrDefault(item => item.ProductId == product.Id);

            // I dont understend this. Why I'm adding the same quantity to the product again.
            if(exstistingItem != null) 
            {
                exstistingItem.Quantity += quantity;
            }
        }

        public void RemoveItem(int productId, int quantity)
        {
            var item = Items.FirstOrDefault(item => item.ProductId == productId);
        
            if(item == null)
            {
                // just exist the method
                return;
            }
            
            // Otherwise anjust quantity 
            item.Quantity -= quantity;

            // check for the new quantity, If it's '0' remove it from the basket.
            if(item.Quantity == 0)
            {
                Items.Remove(item);
            }
        }

/*         public void RemoveItemFromBasket(Product product)
        {

            if(Items.All(item => item.ProductId == product.Id))
            {
                var item = new BasketItem{Product = product, Quantity = 0};
                Items.Remove(item);
            }
        } */
    }
}