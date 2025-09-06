import { getProducts } from "@/actions/product-actions";
import { ProductsPage } from "@/features/products/ProductsPage";

const page = async () => {
  const products = await getProducts({});
  if (!products?.data?.length) {
    return (
      <div className="text-center mt-20 text-gray-500">No products found.</div>
    );
  }
  return (
    <div>
      <ProductsPage products={products?.data} />
    </div>
  );
};

export default page;
