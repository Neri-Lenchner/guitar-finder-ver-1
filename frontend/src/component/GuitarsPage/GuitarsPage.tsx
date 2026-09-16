import { JSX, useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { IBrand, IGuitarModel, IListing } from '../../models/guitar.model';
import { reverbService } from '../../services/reverb.service';
import { ebayService } from '../../services/ebay.service';
import { followedService } from '../../services/followed.service';
import { authService } from '../../services/auth.service';
import guitarsData from '../../data/guitars.json';
import superGuitar from '../../assets/super-guitar.png';
import guitarGod from '../../assets/guitar-god.png';
import Spinner from '../Spinner/Spinner';
import Pagination from '../Pagination/Pagination';
import './GuitarsPage.css';

const brands: IBrand[] = guitarsData as IBrand[];

const TYPE_COLORS: Record<string, string> = {
    Electric: '#60a5fa',
    Acoustic: '#4ade80',
    Bass: '#f472b6',
    'Semi-Hollow': '#fbbf24',
    Classical: '#a78bfa',
};

const SOURCE_LABELS: Record<string, string> = {
    reverb: 'Reverb',
    ebay: 'eBay',
};

async function fetchAllListings(brand: string, model: string): Promise<IListing[]> {
    const results = await Promise.allSettled([
        reverbService.searchListings(brand, model),
        ebayService.searchListings(brand, model),
    ]);
    return results.flatMap(r => (r.status === 'fulfilled' ? r.value : []));
}

function GuitarsPage(): JSX.Element {
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('search')?.toLowerCase().trim() ?? '';

    const filteredBrands = searchQuery
        ? brands.filter(b =>
            b.name.toLowerCase().includes(searchQuery) ||
            b.models.some(m => m.name.toLowerCase().includes(searchQuery))
          )
        : brands;

    const [selectedBrand, setSelectedBrand] = useState<IBrand | null>(null);
    const [selectedModel, setSelectedModel] = useState<IGuitarModel | null>(null);
    const [listings, setListings] = useState<IListing[]>([]);
    const [loadingListings, setLoadingListings] = useState(false);
    const [modelImages, setModelImages] = useState<Record<string, string>>({});
    const [loadingImages, setLoadingImages] = useState<Record<string, boolean>>({});
    const [followedIds, setFollowedIds] = useState<Set<string>>(new Set());
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;
    const reverbSectionRef = useRef<HTMLDivElement>(null);
    const modelsSectionRef = useRef<HTMLDivElement>(null);
    const user = authService.getLoggedInUser();

    const visibleModels = selectedBrand
        ? (searchQuery && !selectedBrand.name.toLowerCase().includes(searchQuery)
            ? selectedBrand.models.filter(m => m.name.toLowerCase().includes(searchQuery))
            : selectedBrand.models)
        : [];

    useEffect(() => {
        setSelectedBrand(null);
        setSelectedModel(null);
        setListings([]);
        setModelImages({});
    }, [searchQuery]);

    useEffect(() => {
        if (selectedBrand) {
            modelsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [selectedBrand]);

    useEffect(() => {
        if (listings.length > 0) {
            reverbSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [listings]);

    useEffect(() => {
        if (!user) return;
        followedService.getAll()
            .then(all => setFollowedIds(new Set(all.map(l => l.listingId))))
            .catch(() => {});
    }, []);

    async function selectBrand(brand: IBrand): Promise<void> {
        setSelectedBrand(brand);
        setSelectedModel(null);
        setListings([]);
        setModelImages({});

        const modelsToLoad = searchQuery && !brand.name.toLowerCase().includes(searchQuery)
            ? brand.models.filter(m => m.name.toLowerCase().includes(searchQuery))
            : brand.models;

        const initialLoading: Record<string, boolean> = {};
        modelsToLoad.forEach(m => { initialLoading[m.name] = true; });
        setLoadingImages(initialLoading);

        await Promise.all(modelsToLoad.map(async (model) => {
            try {
                const results = await fetchAllListings(brand.name, model.name);
                const photo = results.find(l => l.imageUrl)?.imageUrl;
                if (photo) setModelImages(prev => ({ ...prev, [model.name]: photo }));
            } catch { /* ignore */ } finally {
                setLoadingImages(prev => ({ ...prev, [model.name]: false }));
            }
        }));
    }

    async function toggleFollow(listing: IListing): Promise<void> {
        if (!user) return;
        const id = listing.id;
        if (followedIds.has(id)) {
            await followedService.unfollow(id);
            setFollowedIds(prev => { const s = new Set(prev); s.delete(id); return s; });
        } else {
            await followedService.follow({
                listingId: id,
                title: listing.title,
                price: { amount: listing.price?.amount ?? '', currency: listing.price?.currency ?? '' },
                condition: listing.condition ?? '',
                imageUrl: listing.imageUrl ?? '',
                reverbUrl: listing.url ?? '',
                source: listing.source,
            });
            setFollowedIds(prev => new Set(prev).add(id));
        }
    }

    async function findListings(model: IGuitarModel): Promise<void> {
        if (!selectedBrand) return;
        setSelectedModel(model);
        setListings([]);
        setCurrentPage(1);
        setLoadingListings(true);
        const results = await fetchAllListings(selectedBrand.name, model.name);
        setListings(results);
        setLoadingListings(false);
    }

    return (
        <div className="guitars-page">
            <img src={guitarGod} alt="" aria-hidden="true" className="guitars-bg-guitar" />
            <div className="guitars-inner">
                <div className="guitars-header">
                    <h1 className="guitars-title">Guitar <span>Catalog</span></h1>
                    <p className="guitars-subtitle">Browse top manufacturers and their models. Click a model to find listings on Reverb and eBay.</p>
                    {searchQuery && <p className="guitars-search-info">Showing results for: <strong>"{searchParams.get('search')}"</strong></p>}
                </div>

                <div className="brand-grid">
                    {filteredBrands.map(brand => (
                        <button
                            key={brand.id}
                            className={`brand-card${selectedBrand?.id === brand.id ? ' brand-card--active' : ''}`}
                            onClick={() => selectBrand(brand)}
                        >
                            <span className="brand-card-name">{brand.name}</span>
                            <span className="brand-card-meta">{brand.country} · Est. {brand.founded}</span>
                        </button>
                    ))}
                </div>

                {selectedBrand && (
                    <div className="models-section" ref={modelsSectionRef}>
                        <h2 className="models-title">{selectedBrand.name} Models</h2>
                        <div className="models-grid">
                            {visibleModels.map(model => (
                                <div
                                    key={model.name}
                                    className={`model-card${selectedModel?.name === model.name ? ' model-card--active' : ''}`}
                                >
                                    {loadingImages[model.name] ? (
                                        <div className="model-card-shimmer" />
                                    ) : modelImages[model.name] ? (
                                        <img src={modelImages[model.name]} alt={model.name} className="model-card-img" />
                                    ) : (
                                        <img src={superGuitar} alt="Guitar" className="model-card-img" />
                                    )}
                                    <span className="model-type-badge" style={{ color: TYPE_COLORS[model.type] ?? '#888' }}>
                                        {model.type}
                                    </span>
                                    <span className="model-name">{model.name}</span>
                                    <button className="model-reverb-btn" onClick={() => findListings(model)}>
                                        Find Listings
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {(loadingListings || listings.length > 0) && (
                    <div className="reverb-section" ref={reverbSectionRef}>
                        <h2 className="reverb-title">
                            Listings — {selectedBrand?.name} {selectedModel?.name}
                        </h2>

                        {loadingListings && <Spinner text="Searching Reverb and eBay..." />}

                        {!loadingListings && listings.length === 0 && (
                            <p className="reverb-empty">No listings found for this model.</p>
                        )}

                        {!loadingListings && listings.length > 0 && (
                            <div className="reverb-grid">
                                {listings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map(listing => (
                                    <div key={`${listing.source}-${listing.id}`} className="reverb-card">
                                        <a
                                            href={listing.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {listing.imageUrl && (
                                                <img
                                                    src={listing.imageUrl}
                                                    alt={listing.title}
                                                    className="reverb-card-img"
                                                />
                                            )}
                                        </a>
                                        <div className="reverb-card-body">
                                            <span className={`reverb-source-badge reverb-source-badge--${listing.source}`}>
                                                {SOURCE_LABELS[listing.source]}
                                            </span>
                                            <a
                                                href={listing.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="reverb-card-title"
                                            >
                                                {listing.title}
                                            </a>
                                            <div className="reverb-card-meta">
                                                <span className="reverb-card-price">
                                                    {listing.price?.currency} {listing.price?.amount}
                                                </span>
                                                <span className="reverb-card-condition">
                                                    {listing.condition}
                                                </span>
                                            </div>
                                            {user && (
                                                <button
                                                    className={`reverb-follow-btn${followedIds.has(listing.id) ? ' reverb-follow-btn--active' : ''}`}
                                                    onClick={() => toggleFollow(listing)}
                                                >
                                                    {followedIds.has(listing.id) ? 'Following' : 'Follow'}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {!loadingListings && listings.length > itemsPerPage && (
                            <Pagination
                                totalItems={listings.length}
                                itemsPerPage={itemsPerPage}
                                currentPage={currentPage}
                                onPageChange={setCurrentPage}
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default GuitarsPage;
