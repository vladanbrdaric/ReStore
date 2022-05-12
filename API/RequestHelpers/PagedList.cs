using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Threading;
using System.Threading.Tasks;
using System.Threading.Tasks.Dataflow;
using Microsoft.AspNetCore.Mvc.TagHelpers;
using Microsoft.AspNetCore.Razor.TagHelpers;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace API.RequestHelpers
{
    // So this PagedList class will have all of the functionality as 'List' class from dotnet
    // because I'm deriving from the 'List'
    // I'm extending my class with generic 'List' from dotnet
    public class PagedList<T> : List<T>
    {
         // MetaData including all of the inforamtion about paging
         public MetaData MetaData{ get; set; } = new MetaData();
         

        // List<Products> items
        // count -> number of 'items'
        // pageNumber
        // pageSize
        public PagedList(List<T> items, int count, int pageNumber, int pageSize)
        {
//            // His Way Of Doing This down bellow.
//            MetaData = new MetaData()
//            {
//                TotalCount = count,
//                CurrentPage = pageNumber,
//                PageSize = pageSize
//            };
//            AddRange(items);


            MetaData.TotalCount = count;
            MetaData.CurrentPage = pageNumber;
            MetaData.PageSize = pageSize;

            // This 'Ceiling' will count number of pages and if there is 18 items, with 5 items on each page.
            // It will count that I will have 4 pages.

            MetaData.TotalPages = (int)Math.Ceiling(count / (double)pageSize);

            //if(MetaData.CurrentPage > MetaData.TotalPages)
            //{
            //    MetaData.CurrentPage = MetaData.TotalPages;
            //}

            // It will store items. 
            AddRange(items);
        }

        // Method
        public static async Task<PagedList<T>> ToPagedList(IQueryable<T> query, int pageNumber, int pageSize)
        {

            // IQueryable<T> query -> is a query that is located in the ProductController.cs/GetProducts file/method.
            // It wil be passed to this method.
            
            var count = await query.CountAsync(); // It going to execute this against the database to get the total number of items available.


            // pageSize = 6
            // count = 4
            // There will only be one page

            //if (pageSize > count)
            //{
            //    pageNumber = 1;
            //}


            // Here I'm going to take some amount of items on database and skip some amont, just to fit number items per page.
            // Skip -> amount to be skipped.
            // In order to get first 10 item (lets pretend 10items/pageSize), I have to skip 0 items, and take only that amount that fit one page.
            // Round two would be (pageNumber(2) - 1) * 10), so I will skip first 10 items and take rest of the items.
            var items = await query.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
            
            // At the end return a new object of type PagedList parsing this parametes.
            // Those will be passed in the constructor first. Make sure you follow the order when parsing parametes in this method.
            return new PagedList<T>(items, count, pageNumber, pageSize);
        }
    }
}