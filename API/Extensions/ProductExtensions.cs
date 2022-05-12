using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata.Ecma335;
using API.Entities;
using Microsoft.AspNetCore.Diagnostics;

namespace API.Extensions
{
    public static class ProductExtensions
    {
        // Create static extension IQueryable method of type Product that is going to 'SORT' query based on provided parameter.
        public static IQueryable<Product> Sort(this IQueryable<Product> query, string orderBy)
        {
            // Check if user provided some parameter.
            if (string.IsNullOrWhiteSpace(orderBy))
            {
                // sort by name (alfabetically)                 
                query.OrderBy(p => p.Name);
            }

            // Sort products by parsed 'orderBy' string that come from UI
            // Write switch that deterimine if the user want to orderBy 'product' in ASC or DESC 
            query = orderBy switch
            {
                "price" => query.OrderBy(p => p.Price),
                "priceDesc" => query.OrderByDescending(p => p.Price),
                // '_' is for default. By default it will be sorted in alfabetically order.
                _ => query.OrderBy(p => p.Name)
            };

            return query;

        }
        

        // Create static extension IQueryable method of type Product that is going to 'SEARCH' query based on provided term.
        public static IQueryable<Product> Search(this IQueryable<Product> query, string searchTerm)
        {
            // Check if user not provide any searchTerm
            if (string.IsNullOrWhiteSpace(searchTerm))
            {
                // So query expression is not going to change if I don't have anything to search for.
                return query;
            }

            // remove any white spaces and convert searchTerm to lowercase
            var lowerCaseSearchTerm = searchTerm.Trim().ToLower();

            return query.Where(p => p.Name.ToLower().Contains(lowerCaseSearchTerm));
        }
        

        // Create static extension IQueryable method of type Product that is going to 'Filter' producsts based on 'type' or 'brand'
        // It takes an array of types and an array of brands. Use can filter by multiple types and multiple brands.
        // OBS: This is going to be parsed to me as a comma separated list of string. i.g. brands: "Angular,VS Code,NetCore"
        public static IQueryable<Product> Filter(this IQueryable<Product> query, string brands, string types)
        {
            // Create two separated lists, and in this list will be stored brands and types when I separate values inside them
            var brandList = new  List<string>(); 
            var typeList = new  List<string>(); 

            // Check if brand is not nullOrEmpty. Split it on ',' into values.
            if(!string.IsNullOrEmpty(brands))
            {
                brandList.AddRange(brands.ToLower().Split(",").ToList());
            }

            if(!string.IsNullOrEmpty(types))
            {
                typeList.AddRange(types.ToLower().Split(",").ToList());
            }

            // this will do nothing if the first expression is true, and will look for the second expression
            // Second expression will look for all of the brands that match anything that's inside the brandList.
            query = query.Where(p => brandList.Count == 0 || brandList.Contains(p.Brand.ToLower()));

            // Do exact the same for the 'types'
            query = query.Where(p => typeList.Count == 0 || typeList.Contains(p.Type.ToLower()));


            // return query at the end
            return query;

        }
    }
}