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
            <div className="store-card-header">
                <h3 className="store-name">{store.name}</h3>
            </div>

            <div className="store-card-rows">
                <div className="store-row">
                    <span className="store-row-text">{store.address}</span>
                </div>

                {store.openingHours && (
                    <div className="store-row store-row--hours">
                        <span className="store-row-icon">🕐</span>
                        <span className="store-row-text">{store.openingHours}</span>
                    </div>
                )}

                {store.phone && (
                    <div className="store-row">
                        <span className="store-row-icon">📞</span>
                        <a href={`tel:${store.phone}`} className="store-link">{store.phone}</a>
                    </div>
                )}

                {store.email && (
                    <div className="store-row">
                        <span className="store-row-icon">✉️</span>
                        <a href={`mailto:${store.email}`} className="store-link">{store.email}</a>
                    </div>
                )}

                {store.website && (
                    <div className="store-row">
                        <span className="store-row-icon">🌐</span>
                        <a href={store.website} target="_blank" rel="noopener noreferrer" className="store-link">{store.website.replace(/^https?:\/\//, '')}</a>
                    </div>
                )}
            </div>

            <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="store-map-btn">
                View on Google Maps
            </a>
        </div>
    );
}

export default StoreCard;
