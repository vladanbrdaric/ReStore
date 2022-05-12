namespace API.RequestHelpers
{
    // This class will contain data about pagination.
    // And an object of this class will be returned to the client. Alongside with the request dvs data the client asked for.
    public class MetaData
    {
        // I wanna suply the cliend with the current page that I'm returning.
        public int CurrentPage { get; set; }   

        // Information about how many pages are there in total.
        public int TotalPages { get; set; }

        public int PageSize { get; set; }

        // This property will contain information about how many 'items' that are available in the list 
        // for the (asked) query before I did pagination.
        public int TotalCount { get; set; }
    }
}