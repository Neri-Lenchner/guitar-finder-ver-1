import { JSX, useState, useEffect } from 'react';
import { followedService, IFollowedListing } from '../../services/followed.service';
import { authService } from '../../services/auth.service';
import './WatchlistPage.css';

function WatchlistPage(): JSX.Element {
    const [listings, setListings] = useState<IFollowedListing[]>([]);
    const [loading, setLoading] = useState(true);
    const user = authService.getLoggedInUser();

    useEffect(() => {
        if (!user) { setLoading(false); return; }
        followedService.getAll()
            .then(setListings)
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    async function handleUnfollow(listingId: string): Promise<void> {
        await followedService.unfollow(listingId);
        setListings(prev => prev.filter(l => l.listingId !== listingId));
    }

    if (!user) return (
        <div className="watchlist-page">
            <p className="watchlist-empty">Please log in to view your watchlist.</p>
        </div>
    );

    if (loading) return (
        <div className="watchlist-page">
            <div className="watchlist-grid">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="watchlist-skeleton" />
                ))}
            </div>
        </div>
    );

    return (
        <div className="watchlist-page">
            <div className="watchlist-inner">
                <h1 className="watchlist-title">My <span>Guitars</span></h1>
                <p className="watchlist-subtitle">
                    {listings.length} {listings.length === 1 ? 'listing' : 'listings'} saved
                </p>

                {listings.length === 0 ? (
                    <p className="watchlist-empty">
                        No listings saved yet. Browse the <a href="/guitars">Guitar Catalog</a> and follow listings you like.
                    </p>
                ) : (
                    <div className="watchlist-grid">
                        {listings.map(listing => (
                            <div key={listing._id} className="watchlist-card">
                                {listing.imageUrl && (
                                    <a href={listing.reverbUrl} target="_blank" rel="noopener noreferrer">
                                        <img src={listing.imageUrl} alt={listing.title} className="watchlist-card-img" />
                                    </a>
                                )}
                                <div className="watchlist-card-body">
                                    <a
                                        href={listing.reverbUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="watchlist-card-title"
                                    >
                                        {listing.title}
                                    </a>
                                    <div className="watchlist-card-meta">
                                        <span className="watchlist-card-price">
                                            {listing.price?.currency} {listing.price?.amount}
                                        </span>
                                        {listing.condition && (
                                            <span className="watchlist-card-condition">{listing.condition}</span>
                                        )}
                                    </div>
                                    <button
                                        className="watchlist-unfollow-btn"
                                        onClick={() => handleUnfollow(listing.listingId)}
                                    >
                                        ♥ Unfollow
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default WatchlistPage;
