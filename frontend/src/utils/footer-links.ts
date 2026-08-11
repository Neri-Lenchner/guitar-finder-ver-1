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
                body: `GuitarFinder is your all-in-one guitar discovery platform. Whether you're a beginner searching for your first instrument or a seasoned player hunting for a rare vintage piece, we help you find the perfect guitar. Our AI-powered assistant GuitarBot is here to answer any question about gear, technique, and tone.`,
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
                body: `Have a question or running into an issue? Our support team is happy to help. Reach out and we'll get back to you within one business day.`,
                contactEmail: 'support@guitarfinder.com',
            },
            {
                label: 'FAQ',
                path: '/faq',
                title: 'Frequently Asked Questions',
                body: `Q: Is GuitarFinder free to use?\nA: Yes — creating an account and using GuitarBot is completely free.\n\nQ: How does GuitarBot work?\nA: GuitarBot is powered by AI and trained on a wide range of guitar knowledge, from gear reviews to playing technique.\n\nQ: Can I update my profile photo?\nA: Yes — click your avatar in the header to go to the Edit Profile page.\n\nQ: Is my data safe?\nA: Absolutely. Passwords are hashed and your personal data is never shared with third parties.`,
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
                body: `GuitarFinder collects only the information necessary to operate your account and personalise your experience. We do not sell your data to third parties. Passwords are hashed and never stored in plain text. Account data is retained for 12 months after your last login and permanently deleted upon request. For questions, contact us at privacy@guitarfinder.com.`,
            },
            {
                label: 'Terms of Service',
                path: '/terms',
                title: 'Terms of Service',
                body: `By using GuitarFinder you agree to use the platform for lawful purposes only. GuitarBot's responses are AI-generated and should not be taken as professional advice. GuitarFinder is not liable for purchasing decisions made based on information provided by the platform. We reserve the right to suspend accounts that misuse the service.`,
            },
        ],
    },
];
