using System.Text.Json;
using API.RequestHelpers;
using Microsoft.AspNetCore.Http;

namespace API.Extensions
{
    public static class HttpExtensions
    {
        public static void AddPaginationHeader(this HttpResponse response, MetaData metaData)
        {
            // This line will take care of naming policy of the json object that store in the header.
            var options = new JsonSerializerOptions{PropertyNamingPolicy = JsonNamingPolicy.CamelCase};

            response.Headers.Add("Pagination", JsonSerializer.Serialize(metaData, options));


            // VERY IMPORTANT: Specifically allow this header 'Pagination'
            // because this is a custom header that i'm creating.
            // Otherwise it will be blocked by the client.
            response.Headers.Add("Access-Control-Expose-Headers", "Pagination");
        }
    }
}