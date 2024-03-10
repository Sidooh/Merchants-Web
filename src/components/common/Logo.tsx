import { IMAGES } from '@/constants/images.ts';
import { cn } from '@/lib/utils.ts';

type LogoType = {
    src?: string;
    serviceName?: string;
    at?: 'navbar-vertical' | 'navbar-top' | 'auth';
    width?: number;
    className?: string;
};

const Logo = ({ src = IMAGES.logos.sidooh, at = 'auth', width = 78, className, serviceName }: LogoType) => {
    return (
        <div
            className={cn(
                'flex',
                {
                    'items-center py-3': at === 'navbar-vertical',
                    'items-center': at === 'navbar-top',
                    'flex-col': serviceName,
                },
                className
            )}
        >
            <img className="me-2" src={src} alt="Logo" width={width} />
            {serviceName && (
                <h6
                    className={`font-extrabold text-[${width * 0.1}pt]`}
                    style={{
                        fontFamily: "'Avenir Regular', sans-serif",
                        margin: `-.${width * 0.4}rem 0 0`,
                    }}
                >
                    {serviceName}
                </h6>
            )}
        </div>
    );
};

export default Logo;
