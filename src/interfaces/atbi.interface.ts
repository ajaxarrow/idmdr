// interfaces/atbi.interface.ts
import {CustomUserData} from "./member.interface.ts";

interface ATBI {
    technology?: string,
    uuid?: string;
    name: string;
    description?: string;
    logo?: string;
    owners?: string;
    ownerData?: CustomUserData[];
    mobile?: string;
    email?: string;
    facebook?: string;
    additional_info?: string;
    is_deleted?: boolean;
    is_active?: boolean;
    image_urls?: AtbiImage[];
    // facilities?: Facility[];
    // products?: Product[];
}

interface AtbiImage {
    uuid?: string;
    file?: File | null;
    image?: File | string;
    atbi?: string;
    type?: string;
    previewImage?: string;
}



interface Product {
    uid?: string;
    name: string;
    description?: string;
    price?: number;
    unit?: string;
}

interface Facility {
    name: string;
    capacity?: string;
    description?: string;
}

export type { ATBI, AtbiImage, Product, Facility };