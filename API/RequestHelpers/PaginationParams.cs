using Microsoft.AspNetCore.Mvc.TagHelpers;

namespace API.RequestHelpers
{
    public class PaginationParams
    {
        // Maxi page size is 50.
        private const int MaxPageSize = 50;

        // I will always start from the first page.
        public int PageNumber { get; set; } = 1;

        // by default it will be showed only 6 items per page.
        private int _pageSize = 6;

        // public property with getter and setter.
        public int PageSize 
        { 
            get
            {
                return _pageSize;
            } 
            set
            {
                if(value > MaxPageSize)
                {
                    value = MaxPageSize;
                }
                else
                {
                    value = _pageSize; 
                }
            }
        }

        // HIS propfull
//        public int PageSizeTeacher
//        {
//            get => _pageSize;
//            set => _pageSize = value > MaxPageSize ? MaxPageSize : value;
//        }
    }
}