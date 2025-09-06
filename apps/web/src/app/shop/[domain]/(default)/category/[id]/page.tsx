import { getProducts } from "@/actions/product-actions";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const products = getProducts({ categoryId: id });
  console.log("products :>> ", products);
  return (
    <div className="">
      {/* <ProductCard categories={categories} /> */}

      {JSON.stringify(products)}
    </div>
  );
};

export default page;
