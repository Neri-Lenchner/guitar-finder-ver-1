import { JSX, useState, useRef, useEffect } from 'react';
import { IBrand, IGuitarModel, IReverbListing } from '../../models/guitar.model';
import { reverbService } from '../../services/reverb.service';
import guitarsData from '../../data/guitars.json';
import superGuitar from '../../assets/super-guitar.png';
import Spinner from '../Spinner/Spinner';
import './GuitarsPage.css';

const brands: IBrand[] = guitarsData as IBrand[];

const TYPE_COLORS: Record<string, string> = {
    Electric: '#60a5fa',
    Acoustic: '#4ade80',
    Bass: '#f472b6',
    'Semi-Hollow': '#fbbf24',
    Classical: '#a78bfa',
};

function GuitarsPage(): JSX.Element {
    const [selectedBrand, setSelectedBrand] = useState<IBrand | null>(null);
    const [selectedModel, setSelectedModel] = useState<IGuitarModel | null>(null);
    const [listings, setListings] = useState<IReverbListing[]>([]);
    const [loadingListings, setLoadingListings] = useState(false);
    const [listingsError, setListingsError] = useState('');
    const [modelImages, setModelImages] = useState<Record<string, string>>({});
    const [loadingImages, setLoadingImages] = useState<Record<string, boolean>>({});
    const reverbSectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (listings.length > 0 || listingsError) {
            reverbSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [listings, listingsError]);

    async function selectBrand(brand: IBrand): Promise<void> {
        setSelectedBrand(brand);
        setSelectedModel(null);
        setListings([]);
        setListingsError('');
        setModelImages({});

        const initialLoading: Record<string, boolean> = {};
        brand.models.forEach(m => { initialLoading[m.name] = true; });
        setLoadingImages(initialLoading);

        await Promise.all(brand.models.map(async (model) => {
            try {
                const results = await reverbService.searchListings(brand.name, model.name);
                const photo = results[0]?.photos?.[0]?._links?.thumbnail?.href;
                if (photo) setModelImages(prev => ({ ...prev, [model.name]: photo }));
            } catch { /* ignore */ } finally {
                setLoadingImages(prev => ({ ...prev, [model.name]: false }));
            }
        }));
    }

    async function findOnReverb(model: IGuitarModel): Promise<void> {
        if (!selectedBrand) return;
        setSelectedModel(model);
        setListings([]);
        setListingsError('');
        setLoadingListings(true);
        try {
            const results = await reverbService.searchListings(selectedBrand.name, model.name);
            setListings(Array.isArray(results) ? results : []);
        } catch {
            setListingsError('Reverb API not available. Add REVERB_API_TOKEN to your .env to enable this feature.');
        } finally {
            setLoadingListings(false);
        }
    }

    return (
        <div className="guitars-page">
            <div className="guitars-inner">
                <div className="guitars-header">
                    <h1 className="guitars-title">Guitar <span>Catalog</span></h1>
                    <p className="guitars-subtitle">Browse top manufacturers and their models. Click a model to find listings on Reverb.</p>
                </div>

                <div className="brand-grid">
                    {brands.map(brand => (
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
                    <div className="models-section">
                        <h2 className="models-title">{selectedBrand.name} Models</h2>
                        <div className="models-grid">
                            {selectedBrand.models.map(model => (
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
                                    <button className="model-reverb-btn" onClick={() => findOnReverb(model)}>
                                        Find on Reverb
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {(loadingListings || listings.length > 0 || listingsError) && (
                    <div className="reverb-section" ref={reverbSectionRef}>
                        <h2 className="reverb-title">
                            Reverb Listings — {selectedBrand?.name} {selectedModel?.name}
                        </h2>

                        {loadingListings && <Spinner text="Searching Reverb..." />}

                        {!loadingListings && listingsError && (
                            <p className="reverb-error">{listingsError}</p>
                        )}

                        {!loadingListings && listings.length === 0 && !listingsError && (
                            <p className="reverb-empty">No listings found on Reverb for this model.</p>
                        )}

                        {!loadingListings && listings.length > 0 && (
                            <div className="reverb-grid">
                                {listings.map(listing => (
                                    <a
                                        key={listing.id}
                                        href={listing._links?.web?.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="reverb-card"
                                    >
                                        {listing.photos?.[0]?._links?.large_crop?.href && (
                                            <img
                                                src={listing.photos[0]._links.large_crop.href}
                                                alt={listing.title}
                                                className="reverb-card-img"
                                            />
                                        )}
                                        <div className="reverb-card-body">
                                            <p className="reverb-card-title">{listing.title}</p>
                                            <div className="reverb-card-meta">
                                                <span className="reverb-card-price">
                                                    {listing.price?.currency} {listing.price?.amount}
                                                </span>
                                                <span className="reverb-card-condition">
                                                    {listing.condition?.display_name}
                                                </span>
                                            </div>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default GuitarsPage;
