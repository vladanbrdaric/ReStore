using Microsoft.AspNetCore.Mvc.TagHelpers;

namespace API.RequestHelpers
{
    // This class will contain all the parameters that i'm passing in in 
    // File ProductController.cs -> [HttpGet] GetProducts
    
    // I'm deriving from PaginationParams which mean that ProductParams have access to all properties inside PaginationParams.
    public class ProductParams : PaginationParams
    {
        public string OrderBy { get; set; }
        public string SearchTerm{ get; set; }
        public string Brands{ get; set; }
        public string Types { get; set; }
    }
}