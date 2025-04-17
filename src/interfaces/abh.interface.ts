interface ABH{
    technology?: string,
    uuid?: string;
    images?: AbhImage[];
    tech_name?: string;
    tech_image?: string;
    technology_assessment?: string;
    business_model_development?: string;
    business_plan_preparation?: string;
    market_research?: string;
    technology_registration_assistance?: string;
    feasibility?: string;
    partnership_and_networking?: string;
    is_deleted?: boolean;
    is_active?: boolean;
}

interface AbhImage {
    uuid?: string;
    file?: File | null;
    image?: File | string;
    abh?: string;
    type?: string;
    previewImage?: string;
}

export type {ABH, AbhImage};
