// interfaces/atbi.interface.ts
interface ATBI {
    uid?: string;
    name: string;
    description?: string;
    owner?: string[];
    mobile?: string;
    email?: string;
    facebook?: string;
    additionalInfo?: string;
    facilities?: Facility[];
    products?: Product[];
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

export type { ATBI, Product, Facility };