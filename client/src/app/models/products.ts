export interface Product {
        id: number;
        name: string;
        description: string;
        price: number;
        pictureUrl: string;
        type: string;
        brand: string;
        quantityInStock: number;
}


// Those properties are for the query string that is going to be sent to the API.
// All of those have to match parameters that are send to (ProductsController.cs) -> GetProducts method.
export interface ProductParams {
        orderBy: string;
        pageNumber: number;
        pageSize: number;
        searchTerm?: string;
        brands: string[];
        types: string[];

}