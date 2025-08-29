// "use client";

// import { useParams, useRouter } from "next/navigation";

// import AddSectionComponent from "@/features/builder/components/AddSectionComponent";
// import { ShowSelectedSection } from "@/features/builder/components/ShowSelectedSection";
// import {
//     useCreatePortfolioMutation,
//     useGetPortfolioQuery,
// } from "@/redux/api/site-api";
// import {
//     clearLandingPage,
//     setEditing,
//     setLandingPageCategory,
//     setLandingPageKeyword,
//     setLandingPageName,
//     setLandingPageSection,
// } from "@/redux/slices/builder-slice";
// import { useAppDispatch, useAppSelector } from "@/redux/store/hook";
// import { toast } from "sonner";

// import { useThemeContext } from "@/components/theme/theme-data-provider";
// import { useGetCategoriesQuery } from "@/redux/api/site-category-api";
// import { useGetComponentsQuery } from "@/redux/api/component-api";
// import { EPortfolioType } from "@/types/site-type";
// import CustomInput from "@repo/ui/components/CustomInput";
// import { CustomSelect } from "@repo/ui/components/CustomSelect";
// import CustomTextarea from "@repo/ui/components/CustomTextarea";
// import { Button } from "@repo/ui/components/ui/button";
// import { Switch } from "@repo/ui/components/ui/switch";
// import { getSlug } from "@repo/ui/lib/getSlug";
// import { useTheme } from "next-themes";
// import { useEffect } from "react";

// const CreateTemplate = () => {
//     const router = useRouter();
//     const { slug } = useParams();
//     const dispatch = useAppDispatch();
//     const { theme } = useTheme();
//     const { themeColor } = useThemeContext();

//     const landingSection = useAppSelector(
//         (state) => state.builder.landingSection
//     );
//     const isEditing = useAppSelector((state) => state.builder.isEditing);
//     const portfolioName = useAppSelector((state) => state.builder.name);
//     const portfolioKeyword = useAppSelector((state) => state.builder.keyword);
//     const portfolioCategory = useAppSelector((state) => state.builder.category);

//     const { data: categoryData } = useGetCategoriesQuery({
//         limit: 200,
//     });
//     const { data: portfolio, isLoading: isPortfolioLoading } =
//         useGetPortfolioQuery({ slug });
//     const { data: components, isFetching: isComponentsFetching } =
//         useGetComponentsQuery({
//             limit: 200,
//         });

//     const [addPortfolio, { isLoading }] = useCreatePortfolioMutation();

//     const handleSave = () => {
//         if (isLoading || !portfolioName) {
//             toast.error("Please fill Name and Slug");
//             return;
//         }
//         const section = landingSection.map((single, i) => ({
//             ...single.componentData,
//             componentName: single.componentInfo.name,
//             sectionType: single.componentInfo.type,
//             index: i,
//         }));

//         const slug = getSlug(portfolioName);

//         const data = {
//             section,
//             name: portfolioName,
//             slug,
//             keyword: portfolioKeyword,
//             category: "portfolio",
//             theme: `${themeColor}-${theme}`,
//             landingPageType: EPortfolioType.TEMPLATE,
//         };

//         console.log("save", section);
//         addPortfolio(data)
//             .unwrap()
//             .then((res) => {
//                 if (res.data) {
//                     dispatch(clearLandingPage());
//                     toast.success("Template created successfully");
//                     router.push(`/templates`);
//                 }
//             })
//             .catch((err) => {
//                 toast.error(err?.data?.message || "Something went wrong");
//             });
//     };

//     const categoryOptions = categoryData?.data.map((category) => ({
//         value: category.id,
//         label: category?.name,
//     }));

//     useEffect(() => {
//         if (portfolio && components) {
//             const section = portfolio.data.section.map((section) => {
//                 const component = components.data.find(
//                     (component) => component?.name === section.componentName
//                 );
//                 return {
//                     componentData: section,
//                     componentInfo: component,
//                 };
//             });
//             dispatch(setLandingPageSection(section));
//             dispatch(setLandingPageCategory(portfolio.data.categoryId));
//             dispatch(setLandingPageName(portfolio.data.name));
//             dispatch(setLandingPageKeyword(portfolio.data.keyword));
//         }
//     }, [portfolio, components, isPortfolioLoading, isComponentsFetching]);

//     if (isPortfolioLoading || isComponentsFetching) {
//         return <div>Loading...</div>;
//     }

//     return (
//         <div className="grid gap-6">
//             <div className="flex items-center gap-4">
//                 <h1 className="flex-1 shrink-0 text-xl font-semibold tracking-tight whitespace-nowrap sm:grow-0">
//                     Template Builder
//                 </h1>
//                 <div className="hidden items-center gap-2 md:ml-auto md:flex">
//                     <div className="flex items-center gap-2">
//                         <span className="text-sm font-bold">Editing</span>
//                         <Switch
//                             checked={isEditing}
//                             onCheckedChange={(value) => {
//                                 console.log({ value });
//                                 dispatch(setEditing(Boolean(value)));
//                             }}
//                         ></Switch>
//                     </div>
//                     <Button variant="outline" size="sm">
//                         Discard
//                     </Button>
//                     <Button type="button" onClick={handleSave} size="sm">
//                         Save Portfolio
//                     </Button>
//                 </div>
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//                 <CustomInput
//                     label="Template Name"
//                     placeholder="Template Name"
//                     value={portfolioName}
//                     onChange={(value) =>
//                         dispatch(setLandingPageName(String(value)))
//                     }
//                 />

//                 <CustomSelect
//                     label="Template Category"
//                     placeholder="Select Category"
//                     options={categoryOptions || []}
//                     value={portfolioCategory}
//                     onChange={(value: string) =>
//                         dispatch(setLandingPageCategory(String(value)))
//                     }
//                 />

//                 <CustomTextarea
//                     className="col-span-2"
//                     label="Template Keyword"
//                     placeholder="Template Keyword"
//                     value={portfolioKeyword}
//                     onChange={(value) =>
//                         dispatch(setLandingPageKeyword(String(value)))
//                     }
//                 />
//             </div>

//             {landingSection.map((single, i) => (
//                 <ShowSelectedSection
//                     index={i}
//                     key={i}
//                     componentData={single.componentData}
//                     componentInfo={single.componentInfo}
//                 />
//             ))}

//             {isEditing && <AddSectionComponent />}

//             <div className="flex items-center justify-end gap-2 md:hidden">
//                 <Button variant="outline" size="sm">
//                     Discard
//                 </Button>
//                 <Button size="sm" onClick={handleSave}>
//                     Save Portfolio
//                 </Button>
//             </div>
//         </div>
//     );
// };

// export default CreateTemplate;

const TemplatePage = () => {
    return <div>TemplatePage</div>;
};

export default TemplatePage;
