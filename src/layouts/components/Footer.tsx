import { CONFIG } from '@/config.ts';

const Footer = () => (
    <footer className="flex justify-between text-xs pb-3 container">
        <p className="text-600 flex gap-1">
            {CONFIG.app.name} |
            <a href="/public" className={'text-primary'}>
                Sidooh
            </a>
            &copy; {new Date().getFullYear()}
        </p>
        <p className="text-600">v{CONFIG.app.version}</p>
    </footer>
);

export default Footer;
