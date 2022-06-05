using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    //public class StoreContext : DbContext    => OLD code before adding Identity

    // Adding Identity to my app. New setup to be able to override OnModelCreateing method and add some roles.
    public class StoreContext : IdentityDbContext<User>
    {
        public StoreContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Product> Products { get; set; }

        // Add basket as new db context - It will create a new table for Basket in db
        // Table name will be 'Basket' in the db and it will have all the properties that Basket class has.
        
        // OBS: When you add new item here, dont forget to update the database.
        public DbSet<Basket> Baskets { get; set; }


        // Override IdentityDbContext method
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // I want to add some data in the database when I create a migration.
            // So I'm adding all of the roles. 
            builder.Entity<IdentityRole>()
                .HasData(
                    new IdentityRole { Name = "Member", NormalizedName = "MEMBER"},
                    new IdentityRole { Name = "Admin", NormalizedName = "ADMIN"}
                );
        }
    }
}