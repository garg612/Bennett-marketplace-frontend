import { useState } from "react";

export const useFilters = () => {
    const [filters, setFilters] = useState(
        {
        searchQuery: '',
        categories: [], // Array of selected categories
        conditions: [], // Array of selected conditions
        minPrice: '',
        maxPrice: '',
        sortBy: 'newest' // Default sort
        }
    );

    const updateFilter = (filterName, value) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            [filterName]: value
        }));
    };
    const clearFilters = () => {
        setFilters({
            searchQuery: '',
            categories: [],
            conditions: [],
            minPrice: '',
            maxPrice: '',
            sortBy: 'newest'
        });
    }
    
    return { filters, updateFilter, clearFilters };

}