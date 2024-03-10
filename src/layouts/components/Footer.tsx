import { CONFIG } from '@/config.ts';

const Footer = () => {
    const today = new Date();

    const day = today.toLocaleDateString('en-US', { weekday: 'long' });
    const date = today.getDate();
    const month = today.toLocaleDateString('en-US', { month: 'long' });

    return (
        <footer className="absolute bottom-0 w-full">
            <div className="flex justify-between text-xs mt-4 mb-3">
                <p className="mb-0 text-600">
                    {CONFIG.app.name} |{' '}
                    <a href="/public" className={'text-primary'}>
                        Sidooh
                    </a>{' '}
                    <br className="sm:hidden" /> &copy; {new Date().getFullYear()}
                </p>
                <p className="mb-0 text-600">
                    v{CONFIG.app.version} | `${day}, ${date} ${month}`
                </p>
            </div>
        </footer>
    );
};

export default Footer;
