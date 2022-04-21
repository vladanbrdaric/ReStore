using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    // OBS: I dont need this 2 lines of code because I inherit from BaseApiController that has 
    // Those 2 lines of code inside its body.
    
    //[ApiController]
    //[Route("api/[controller]")]
    public class ProductsController : BaseApiController
    {
        private readonly StoreContext _context;
        public ProductsController(StoreContext context)
        {
            _context = context;
        }

        // Return all product
        [HttpGet]
        public async Task<ActionResult<List<Product>>> GetProducts()
        {
            return await _context.Products.ToListAsync();
        }


        // Return product by specified id
        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProductById(int id)
        {
            var product = await _context.Products.FindAsync(id);

            if(product != null)
            {
                return product;
            }
            else
            {
                return NotFound();
            }
        }
    }
}