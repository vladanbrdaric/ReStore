using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using API.Data;
using API.Entities;
using API.Extensions;
using API.RequestHelpers;
using Microsoft.AspNetCore.Http;
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
        
        // Inject "database connection" into this class
        public ProductsController(StoreContext context)
        {
            _context = context;
        }

        // Return all product
        [HttpGet]
        // [FromQuery] tells the controller where to look for the parameters (properties inside 'productParams' object)
        public async Task<ActionResult<PagedList<Product>>> GetProducts([FromQuery]ProductParams productParams)
        //public async Task<ActionResult<List<Product>>> GetProducts(ProductParams productParams)
        //public async Task<ActionResult<List<Product>>> GetProducts(string orderBy, string searchTerm, string brands, string types)
        {
            // This is OLD code where I return list of products.
            // return await _context.Products.ToListAsync();

            // NEW Code. I'm not yet interacting with DB. 
            var query = _context.Products
                // this sort is extension method that I created in 'ProductExtensions.cs'
                .Sort(productParams.OrderBy)
                // this Search is extension method that I created in '...'
                .Search(productParams.SearchTerm)
                .Filter(productParams.Brands, productParams.Types)
                .AsQueryable();

            // When the query has been build, then it will execute this against database insede this method 'ToPagedList'
            //return await query.ToListAsync();
            var products = await PagedList<Product>.ToPagedList(query, productParams.PageNumber, productParams.PageSize);

            // MetaData (products.MetaData) will be returned in response headers to the client. 
            // 'Client' will get access to pagination information in header.
            // 'Pagination' is a key and json object with all the information is the value.
            // This is an Extension method that I created.
            Response.AddPaginationHeader(products.MetaData);

            // While products itself will be returnd in the response body.
            return products;
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


        // This endpoint is going to return a list of types and brands that are available inside my products table.
        // When using IActionResult I can craete a custom response as a return.
        // This endpoint will be calld when user inside filter want to choose between available brands
        [HttpGet("filters")]
        public async Task<IActionResult> GetFilters()
        {
            // Distinct to get unique values
            var brands = await _context.Products.Select(p => p.Brand).Distinct().ToListAsync();
            var types = await _context.Products.Select(p => p.Type).Distinct().ToListAsync();

            return  Ok(new {brands, types});
        }
    }
}