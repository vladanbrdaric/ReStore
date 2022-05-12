import { Box, Typography, Pagination } from "@mui/material"
import { MetaData } from "../models/pagination"

interface Props {
    metaData: MetaData;
    onPageChange: (page: number) => void;
}

export default function AppPagination({metaData, onPageChange} : Props) {

    // So that I can extract properties from the object
    const {currentPage, totalCount, totalPages, pageSize} = metaData;

    return (
        // I'm using box to be able to lay out the left part of the page and the right part of the page.

        <Box display='flex' justifyContent='space-between' alignItems='center'>
            <Typography>
                Displaying {(currentPage - 1) * pageSize + 1}-
                    {/** second value */}
                    {currentPage * pageSize > totalCount ? totalCount : currentPage*pageSize} of {totalCount} items
            </Typography>
            <Pagination
                count={totalPages} 
                size="large"
                //page={currentPage > totalPages ? totalPages : currentPage}
                page={currentPage}
                variant="outlined"
                onChange={(e, page) => onPageChange(page)}
            /> 
        </Box>
    )
}