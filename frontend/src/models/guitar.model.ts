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
    photos: Array<{
        _links: {
            large_crop: { href: string };
            small_crop: { href: string };
            thumbnail: { href: string };
            full: { href: string };
        };
    }>;
    _links: { web: { href: string } };
}

export type ListingSource = 'reverb' | 'ebay' | 'etsy';

export interface IListing {
    id: string;
    source: ListingSource;
    title: string;
    price: { amount: string; currency: string };
    condition: string;
    imageUrl: string;
    url: string;
}

export const SOURCE_LABELS: Record<ListingSource, string> = {
    reverb: 'Reverb',
    ebay: 'eBay',
    etsy: 'Etsy',
};
