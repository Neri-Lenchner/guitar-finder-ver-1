import { JSX } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { footerColumns } from '../../utils/footer-links';
import guitarGod from '../../assets/guitar-god.png';
import './FooterPage.css';

function FooterPage(): JSX.Element {
    const { pathname } = useLocation();
    const navigate = useNavigate();

    const allItems = footerColumns.flatMap(col => col.items);
    const page = allItems.find(item => item.path === pathname);

    if (!page) {
        navigate('/home', { replace: true });
        return <></>;
    }

    return (
        <div className="footer-page">
            <div className="footer-page-inner">
                <div className="footer-page-content">
                    <button className="footer-page-back" onClick={() => navigate(-1)}>&#10094; Back</button>
                    <h1 className="footer-page-title">{page.title}</h1>
                    <p className="footer-page-body">{page.body}</p>
                    {page.contactEmail && (
                        <a href={`mailto:${page.contactEmail}`} className="footer-page-email">{page.contactEmail}</a>
                    )}
                </div>
                <img src={guitarGod} alt="" aria-hidden="true" className="footer-page-guitar" />
            </div>
        </div>
    );
}

export default FooterPage;
