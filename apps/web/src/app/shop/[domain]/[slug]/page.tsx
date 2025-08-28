// import { getPortfolios } from "@/actions/portfolio-action";
// import config from "@/config";
// import { Portfolio } from "@/types";
// import { allComponents } from "@repo/ui/features/index";

// import { Section } from "@repo/ui/type/index";

// type Props = {
//     params: Promise<{ slug: string }>;
// };

// // Function to fetch all available slugs for static generation
// export async function generateStaticParams() {
//     try {
//         const response = await getPortfolios();
//         console.log(response.data);
//         return response.data.map((layout: Portfolio) => ({
//             slug: layout.slug,
//         }));
//     } catch (error) {
//         console.error("Error fetching landing page layouts:", error);
//         return [];
//     }
// }

// async function getShopLayoutDetails(slug: string) {
//     try {
//         const response = await fetch(
//             `${config.serverUrl}/landingPageLayout/details/${slug}`,
//             {
//                 cache: "force-cache",
//             }
//         );

//         if (!response.ok) {
//             throw new Error("Failed to fetch shop layout details");
//         }

//         return response.json();
//     } catch (error) {
//         console.error("Error fetching shop layout details:", error);
//         return null;
//     }
// }

// // Changed to accept params directly without awaiting
// const PreviewPage = async ({ params }: Props) => {
//     const { slug } = await params;
//     const shopLayoutData = await getShopLayoutDetails(slug);

//     if (!shopLayoutData) {
//         return <div>Error loading preview data</div>;
//     }

//     return (
//         <section>
//             {shopLayoutData.data.section.map(
//                 (section: Section, index: number) => {
//                     const findComponent = allComponents.find(
//                         (single) => single.name === section.componentName
//                     );
//                     if (!findComponent)
//                         return <div key={index}>Component Not Found</div>;
//                     const Component = findComponent.component;
//                     return <Component key={index} data={section} />;
//                 }
//             )}
//         </section>
//     );
// };

// export default PreviewPage;

const page = () => {
    return <div>page</div>;
};

export default page;
