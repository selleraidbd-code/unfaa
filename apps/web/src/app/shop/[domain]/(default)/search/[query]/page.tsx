import { getProducts } from "@/actions/product-actions";
import { SearchResultsPage } from "@/features/products/SearchResultsPage";

const page = async ({
    params,
}: {
    params: Promise<{ query: string; domain: string }>;
}) => {
    const { query } = await params;
    const decodedQuery = decodeURIComponent(query);
    const products = await getProducts({ searchTerm: decodedQuery });

    return (
        <div>
            <SearchResultsPage
                products={products?.data || []}
                searchQuery={decodedQuery}
            />
        </div>
    );
};

export default page;
