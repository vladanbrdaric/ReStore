using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    // Data annotation - Even if class name is BasketItem, in database table is goint to be BasketItems.
    [Table("BasketItems")]
    public class BasketItem
    {
        public int Id { get; set; }
        public int Quantity { get; set; }

        // Navigation properties. EF work this way. I'm see this Product inside, just the Productid
        // Check for 'Fully defined relationships
        // https://docs.microsoft.com/en-us/ef/core/modeling/relationships?tabs=fluent-api%2Cfluent-api-simple-key%2Csimple-key
        public int ProductId { get; set; }
        public Product Product { get; set; }


        public int BasketId { get; set; }
        public Basket Basket{ get; set; }
    }
}