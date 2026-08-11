import { JSX, useState, useEffect } from 'react';
import { storeService } from '../../services/store.service';
import { storeStore, StoreActionType } from '../../state/store.state';
import { IStore } from '../../models/store.model';
import StoreCard from '../StoreCard/StoreCard';
import Spinner from '../Spinner/Spinner';
import './SearchPage.css';

function SearchPage(): JSX.Element {
    const [city, setCity] = useState(storeStore.getState().lastCity);
    const [stores, setStores] = useState<IStore[]>(storeStore.getState().stores);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(!!storeStore.getState().lastCity);
    const [error, setError] = useState('');

    useEffect(() => {
        const unsubscribe = storeStore.subscribe(() => {
            setStores(storeStore.getState().stores);
        });
        return unsubscribe;
    }, []);

    async function handleSearch(): Promise<void> {
        if (!city.trim()) return;
        setLoading(true);
        setError('');
        setSearched(true);
        storeStore.dispatch({ type: StoreActionType.SetStores, payload: [] });
        try {
            await storeService.searchByCity(city.trim());
        } catch {
            setError('Could not fetch stores. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>): void {
        if (e.key === 'Enter') handleSearch();
    }

    return (
        <div className="search-page">
            <div className="search-page-header">
                <h1 className="search-title">Find Guitar Stores</h1>
                <p className="search-subtitle">Search for music stores near you by city</p>
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Enter a city (e.g. London, Tel Aviv...)"
                        value={city}
                        onChange={e => setCity(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="search-input"
                    />
                    <button onClick={handleSearch} className="search-btn" disabled={loading}>
                        Search
                    </button>
                </div>
            </div>

            <div className="search-results">
                {loading && <Spinner text="Searching for stores..." />}

                {!loading && error && <p className="search-error">{error}</p>}

                {!loading && searched && !error && stores.length === 0 && (
                    <p className="search-empty">No music stores found in <strong>{storeStore.getState().lastCity}</strong>. Try a different city.</p>
                )}

                {!loading && stores.length > 0 && (
                    <>
                        <p className="search-count">{stores.length} store{stores.length !== 1 ? 's' : ''} found near <strong>{storeStore.getState().lastCity}</strong></p>
                        {stores.map(store => (
                            <StoreCard key={store.id} store={store} />
                        ))}
                    </>
                )}
            </div>
        </div>
    );
}

export default SearchPage;
