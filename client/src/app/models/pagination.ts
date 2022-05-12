export interface MetaData {
        currentPage: number;
        totalPages: number;
        pageSize: number;
        totalCount: number;
}

// Create a class that contains items of type T and metaData of tyep MetaData
export class PaginationResponse<T> {
    items: T;
    metaData: MetaData


    // create a constructor
    constructor(items: T, metaData: MetaData) {
        this.items = items;
        this.metaData = metaData;
    }
}