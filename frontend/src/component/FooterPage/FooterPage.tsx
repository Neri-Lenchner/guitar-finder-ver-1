import { JSX } from 'react';
import {NavigateFunction, useLocation, useNavigate} from 'react-router-dom';
import {footerColumns, FooterLinkInfo} from '../../utils/footer-links';
import guitarGod from '../../assets/guitar-god.png';
import './FooterPage.css';

function FooterPage(): JSX.Element {
    const { pathname } = useLocation();
    const navigate: NavigateFunction = useNavigate();

    const allItems: FooterLinkInfo[] = footerColumns.flatMap(col => col.items);
    const page: FooterLinkInfo | undefined = allItems.find(item => item.path === pathname);

    if (!page) {
        navigate('/home', { replace: true });
        return <></>;
    }

    return (
        <div className="footer-page">
            <div className="footer-page-inner">
                <div className="footer-page-content">
                    <button
                        className="footer-page-back"
                        onClick={(): void | Promise<void> => navigate(-1)}>
                        &#10094; Back
                    </button>
                    <h1 className="footer-page-title">
                        {page.title}
                    </h1>
                    <p className="footer-page-body">
                        {page.body}
                    </p>
                    {page.contactEmail && (
                        <a
                            href={`mailto:${page.contactEmail}`}
                            className="footer-page-email">
                            {page.contactEmail}
                        </a>
                    )}
                </div>
                <img
                    src={guitarGod}
                    alt="" aria-hidden="true"
                    className="footer-page-guitar"
                />
            </div>
        </div>
    );
}

export default FooterPage;
