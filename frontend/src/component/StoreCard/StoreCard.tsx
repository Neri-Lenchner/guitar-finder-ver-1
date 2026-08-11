import { JSX } from 'react';
import { IStore } from '../../models/store.model';
import './StoreCard.css';

interface StoreCardProps {
    store: IStore;
}

function StoreCard({ store }: StoreCardProps): JSX.Element {
    const mapsUrl = `https://www.google.com/maps?q=${store.lat},${store.lon}`;

    return (
        <div className="store-card">
            <div className="store-card-icon">🎸</div>
            <div className="store-card-content">
                <div className="store-card-top">
                    <h3 className="store-name">{store.name}</h3>
                    {store.openingHours && (
                        <span className="store-hours">{store.openingHours}</span>
                    )}
                </div>
                <p className="store-address">{store.address}</p>
                <div className="store-card-links">
                    {store.phone && (
                        <a href={`tel:${store.phone}`} className="store-link">📞 {store.phone}</a>
                    )}
                    {store.website && (
                        <a href={store.website} target="_blank" rel="noopener noreferrer" className="store-link">🌐 Website</a>
                    )}
                    <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="store-link store-link--map">📍 View on Map</a>
                </div>
            </div>
        </div>
    );
}

export default StoreCard;
