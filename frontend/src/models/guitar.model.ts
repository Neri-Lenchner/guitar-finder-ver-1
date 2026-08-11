export interface IGuitarModel {
    name: string;
    type: 'Electric' | 'Acoustic' | 'Bass' | 'Semi-Hollow' | 'Classical';
}

export interface IBrand {
    id: string;
    name: string;
    country: string;
    founded: number;
    models: IGuitarModel[];
}

export interface IReverbListing {
    id: string;
    title: string;
    price: { amount: string; currency: string };
    condition: { display_name: string };
    photos: Array<{ href: string }>;
    _links: { web: { href: string } };
}
