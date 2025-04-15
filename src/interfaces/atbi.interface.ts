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
    tech_name?: string;
    tech_image?: string;
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

interface AtbiSubEntity{
    atbi?: string,
    uuid?: string;
    name: string;
    description?: string;
    price?: number;
    logo?: string;
    quantity?: number;
    unit?: string;
    entity_type?: string;
    images?: AtbiSubEntityImage[];
}

interface AtbiSubEntityImage {
    uuid?: string;
    file?: File | null;
    entity?: string;
    image?: File | string;
    type?: string;
    previewImage?: string;
    created_at?: string;
    is_deleted?: boolean;
    is_active?: boolean;
}



export type { ATBI, AtbiImage, AtbiSubEntityImage, AtbiSubEntity};