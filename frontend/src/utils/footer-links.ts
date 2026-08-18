export interface FooterLinkInfo {
    label: string;
    path: string;
    title: string;
    body: string;
    contactEmail?: string;
}

export interface FooterColumn {
    heading: string;
    items: FooterLinkInfo[];
}

export const footerColumns: FooterColumn[] = [
    {
        heading: 'Company',
        items: [
            {
                label: 'About Us',
                path: '/about',
                title: 'About GuitarFinder',
                body: `GuitarFinder is the world's most obsessive guitar discovery platform - and we mean that in the best possible way.\n\nFounded by guitarists, for guitarists, we set out with one mission: to make finding your dream guitar as thrilling as actually playing it. Whether you're a wide-eyed beginner holding a pick for the first time, a weekend warrior chasing that perfect clean tone, or a seasoned professional hunting down a 1959 Gibson Les Paul Burst - GuitarFinder was built for you.\n\n20 iconic brands. Thousands of models. One platform.\nWe've curated an encyclopedic catalog spanning legends like Fender, Gibson, Martin, and Taylor, all the way to boutique powerhouses like PRS, D'Angelico, and Music Man. Every brand. Every era. Every style.\n\nMeet GuitarGod - your 24/7 AI guitar genius.\nGot a question about the difference between single-coil and humbucker pickups? Wondering which guitar is right for blues vs. metal? GuitarGod has you covered - powered by cutting-edge AI and fueled by an encyclopedic knowledge of everything guitar.\n\nReal listings. Real prices. Real fast.\nThrough our Reverb integration, you can browse live marketplace listings, compare prices, check conditions, and follow the guitars you love - all without ever leaving GuitarFinder.\n\nFind music stores near you.\nUsing our global store finder, discover music shops in your city or anywhere in the world. Whether you're in Tel Aviv or Tokyo, great gear is closer than you think.\n\nSave your favourites.\nFollow listings and build your personal watchlist. Never lose track of a guitar you've been dreaming about.\n\nGuitarFinder. Because every great song starts with the right guitar.`,
            },
        ],
    },
    {
        heading: 'Support',
        items: [
            {
                label: 'Contact Us',
                path: '/contact',
                title: 'Contact Us',
                body: `Have a question, a suggestion, or just want to talk guitars? We're here for it.\n\nOur support team is made up of real musicians who genuinely care about your experience. Whether you're struggling with a technical issue, can't find the guitar you're looking for, or just want to geek out about tone - don't hesitate to reach out.\n\nWe typically respond within one business day, often much faster. We don't use bots for support (GuitarGod stays in its lane). Every message is read by a real human being who loves guitars as much as you do.\n\nYou can also use the contact form to:\n- Report a bug or broken feature\n- Suggest a new guitar brand or model to add\n- Request a partnership or collaboration\n- Share feedback about GuitarGod's answers\n- Just say hello\n\nWe read every single message. Your feedback directly shapes the future of GuitarFinder.`,
                contactEmail: 'support@guitarfinder.com',
            },
            {
                label: 'FAQ',
                path: '/faq',
                title: 'Frequently Asked Questions',
                body: `Q: Is GuitarFinder free to use?\nA: Completely free. No hidden fees, no premium tiers, no paywalls. Create an account and the entire platform is yours.\n\nQ: How does GuitarGod work?\nA: GuitarGod is powered by OpenAI's language model and has been given deep context about guitars, gear, technique, tone, and music history. Ask it anything - from "what's the difference between a Stratocaster and a Telecaster?" to "recommend me a guitar for jazz under $800."\n\nQ: How do I follow a guitar listing?\nA: Browse the Guitars page, select a brand, pick a model, and click "Find on Reverb." Each listing has a Follow button. Followed listings appear in your My Guitars watchlist.\n\nQ: Can I update my profile photo?\nA: Yes - click your avatar in the top-left of the header to go to the Edit Profile page, where you can upload a new photo and update your name.\n\nQ: Does GuitarFinder sell guitars directly?\nA: No - we integrate with Reverb, the world's largest music gear marketplace, to show you real live listings. Purchases happen on Reverb's platform.\n\nQ: How accurate is GuitarGod?\nA: GuitarGod is very knowledgeable but it's still AI - treat its answers as a starting point, not gospel. For major purchasing decisions, always do your own research.\n\nQ: Is my data safe?\nA: Absolutely. Passwords are hashed using industry-standard encryption and are never stored in plain text. We don't sell or share your personal data with anyone.\n\nQ: What if a listing I followed is no longer available?\nA: Reverb listings can expire or sell. If a listing is gone, it will still appear in your watchlist so you know what you were interested in - use it as a reference for similar searches.`,
            },
        ],
    },
    {
        heading: 'Legal',
        items: [
            {
                label: 'Privacy Policy',
                path: '/privacy',
                title: 'Privacy Policy',
                body: `Your privacy matters to us deeply. GuitarFinder was built by musicians, and we know how personal your gear preferences and musical journey can be. Here's exactly how we handle your data.\n\nWhat we collect:\nWe collect your name, email address, and password (hashed - never stored in plain text) when you register. If you upload a profile photo, it is stored securely on our server. We also store the Reverb listings you choose to follow, so your watchlist persists across sessions.\n\nWhat we do NOT collect:\nWe do not track your browsing behavior across other websites. We do not use third-party advertising trackers. We do not sell, rent, or share your personal data with any third party, ever.\n\nChat history:\nMessages you send to GuitarGod are stored locally in your browser and sent to OpenAI's API to generate responses. We do not permanently store your chat history on our servers.\n\nData retention:\nYour account data is retained for as long as your account is active. You may request permanent deletion of your account and all associated data at any time by contacting us at privacy@guitarfinder.com.\n\nSecurity:\nAll passwords are hashed using bcrypt. Our API uses JWT-based authentication with secure token expiry. We take security seriously and keep our dependencies up to date.\n\nChanges to this policy:\nIf we update this Privacy Policy, we will notify you via email. Continued use of GuitarFinder after changes constitutes acceptance of the updated policy.`,
            },
            {
                label: 'Terms of Service',
                path: '/terms',
                title: 'Terms of Service',
                body: `Welcome to GuitarFinder. By accessing or using our platform, you agree to be bound by the following Terms of Service. Please read them carefully.\n\n1. Eligibility\nYou must be at least 13 years old to use GuitarFinder. By creating an account, you confirm that the information you provide is accurate and truthful.\n\n2. Account Responsibility\nYou are responsible for maintaining the security of your account credentials. Do not share your password with others. GuitarFinder is not liable for any loss resulting from unauthorized access to your account.\n\n3. Acceptable Use\nYou agree to use GuitarFinder for lawful purposes only. You may not use the platform to harass, spam, or harm others. Automated scraping of our data is prohibited without written permission.\n\n4. GuitarGod Disclaimer\nGuitarGod's responses are generated by artificial intelligence and are provided for informational purposes only. They do not constitute professional musical, financial, or legal advice. GuitarFinder is not responsible for decisions made based on GuitarGod's suggestions.\n\n5. Reverb Integration\nGuitarFinder displays listings sourced from Reverb's marketplace. We are not responsible for the accuracy, availability, or quality of third-party listings. All purchases made through Reverb are subject to Reverb's own terms.\n\n6. Intellectual Property\nAll content on GuitarFinder - including our logo, design, and original text - is the property of GuitarFinder and may not be reproduced without permission. Guitar brand names and logos belong to their respective owners.\n\n7. Termination\nWe reserve the right to suspend or terminate any account that violates these terms, engages in abusive behavior, or misuses GuitarGod.\n\n8. Changes to Terms\nWe may update these Terms of Service from time to time. Continued use of the platform after changes are posted constitutes your acceptance of the new terms.\n\nIf you have any questions about these terms, please contact us at support@guitarfinder.com.`,
            },
        ],
    },
];
