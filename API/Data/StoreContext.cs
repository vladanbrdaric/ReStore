using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class StoreContext : DbContext
    {
        public StoreContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Product> Products { get; set; }

        // Add basket as new db context - It will create a new table for Basket in db
        // Table name will be 'Basket' in the db and it will have all the properties that Basket class has.
        
        // OBS: When you add new item here, dont forget to update the database.
        public DbSet<Basket> Baskets { get; set; }
    }
}