export interface Brand {
    id: string;
    imgURL: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}

export interface UpdateBrand {
    id: string;
    payload: {
        name: string;
        imgURL: string;
    };
}

export interface CreateBrand {
    name: string;
    imgURL: string;
    shopId: string;
}
