export const shopTypes = [
    {
        label: "Clothing & Apparel",
        value: "clothing_apparel",
    },
    {
        label: "Shoes & Footwear",
        value: "shoes_footwear",
    },
    {
        label: "Accessories & Jewelry",
        value: "accessories_jewelry",
    },
    {
        label: "Beauty & Cosmetics",
        value: "beauty_cosmetics",
    },
    {
        label: "Electronics & Gadgets",
        value: "electronics_gadgets",
    },
    {
        label: "Health & Wellness",
        value: "health_wellness",
    },
    {
        label: "Home & Furniture",
        value: "home_furniture",
    },
    {
        label: "Books & Media",
        value: "books_media",
    },
    {
        label: "Toys & Games",
        value: "toys_games",
    },
    {
        label: "Sports & Outdoors",
        value: "sports_outdoors",
    },
    {
        label: "Food & Beverages",
        value: "food_beverages",
    },
    {
        label: "Pet Supplies & Equipment",
        value: "pet_supplies_equipment",
    },
    {
        label: "Groceries & Household",
        value: "groceries_household",
    },
    {
        label: "Variety Store",
        value: "other",
    },
];

export enum ShopTypeEnum {
    CLOTHING_APPAREL = "clothing_apparel",
    SHOES_FOOTWEAR = "shoes_footwear",
    ACCESSORIES_JEWELRY = "accessories_jewelry",
    BEAUTY_COSMETICS = "beauty_cosmetics",
    ELECTRONICS_GADGETS = "electronics_gadgets",
    HEALTH_WELLNESS = "health_wellness",
    HOME_FURNITURE = "home_furniture",
    BOOKS_MEDIA = "books_media",
    TOYS_GAMES = "toys_games",
    SPORTS_OUTDOORS = "sports_outdoors",
    FOOD_BEVERAGES = "food_beverages",
    PET_SUPPLIES_EQUIPMENT = "pet_supplies_equipment",
    GROCERIES_HOUSEHOLD = "groceries_household",
    OTHER = "other",
}

export const getShopIdToClone = (shopType: ShopTypeEnum) => {
    switch (shopType) {
        case ShopTypeEnum.CLOTHING_APPAREL:
            return "6d0474d3-3cb4-4d87-acc7-60d99896e4d2";
        case ShopTypeEnum.SHOES_FOOTWEAR:
            return "408c1253-ff38-40e9-b34b-69a8ff3e66cb";
        case ShopTypeEnum.ACCESSORIES_JEWELRY:
            return "7035bb85-e5d2-4a8e-a219-6765047b2791";
        case ShopTypeEnum.BEAUTY_COSMETICS:
            return "82f419e1-14e3-4d8d-bc53-6c2c17253b76";
        case ShopTypeEnum.ELECTRONICS_GADGETS:
            return "05a11446-e578-412e-8b89-3ff359c208bb";
        case ShopTypeEnum.HEALTH_WELLNESS:
            return "56096d89-07a8-46a7-8da0-8e4c9dd1ec55";
        case ShopTypeEnum.HOME_FURNITURE:
            return "ef136761-5ef8-4225-be36-390eeee00466";
        case ShopTypeEnum.BOOKS_MEDIA:
            return "d4ecb777-381c-4244-8bb0-a6db3b473b51";
        case ShopTypeEnum.TOYS_GAMES:
            return "6d08a280-0a8d-4750-b751-e34a78d2b415";
        case ShopTypeEnum.SPORTS_OUTDOORS:
            return "33ac66de-adcc-408e-adda-bca6c00ec710";
        case ShopTypeEnum.FOOD_BEVERAGES:
            return "11bd733d-cc7d-4f82-9a71-04837797e7da";
        case ShopTypeEnum.PET_SUPPLIES_EQUIPMENT:
            return "03c1fcf5-1ec2-4181-9bbf-4c0d2b25bb14";
        case ShopTypeEnum.GROCERIES_HOUSEHOLD:
            return "79016487-2f6b-41d5-aca0-349c017aae2d";
        case ShopTypeEnum.OTHER:
            return "089d2e6e-0693-4d0d-9bac-8af35687ab5a";
    }
};
