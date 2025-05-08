// Parent image interface
interface BaseImage {
    file?: File | null;
    uid?: string;
    image?: File | string;
    type?: string;
    created_at?: string;
    updated_at?: string;
    is_deleted?: boolean;
    previewImage?: string;
}

export type{BaseImage}

