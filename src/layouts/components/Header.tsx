import { Link, useNavigate } from 'react-router-dom';
import Logo from '@/components/common/Logo.tsx';
import { FaUser, FaX } from 'react-icons/fa6';
import { useEffect, useState } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.tsx';
import { useAppDispatch } from '@/app/store.ts';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.tsx';
import { cn } from '@/lib/utils.ts';
import { ModeToggle } from '@/components/ModeToggle.tsx';
import { useAuth } from '@/hooks/useAuth.ts';

const Header = () => {
    const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);

    const { user } = useAuth();
    const [showDropShadow, setShowDropShadow] = useState(false);

    const setDropShadow = () => {
        const el = document.documentElement;
        if (el.scrollTop > 0) {
            setShowDropShadow(true);
        } else {
            setShowDropShadow(false);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', setDropShadow);

        return () => window.removeEventListener('scroll', setDropShadow);
    }, []);

    return (
        <header
            className={cn('sticky top-0 z-40 bg-background', {
                'shadow-[0_.5rem_.5rem_-.5rem_#0003]': showDropShadow,
            })}
        >
            <div className="container flex h-16 items-center justify-between py-4">
                <div className="flex gap-6 md:gap-10">
                    <Link to="/" className="hidden items-center space-x-2 md:flex">
                        <Logo />
                    </Link>

                    <button
                        className="flex items-center space-x-2 md:hidden"
                        onClick={() => setShowMobileMenu(!showMobileMenu)}
                    >
                        {showMobileMenu ? <FaX /> : <Logo />}
                        <span className="font-bold">Menu</span>
                    </button>
                    {showMobileMenu && <MobileNav />}
                </div>

                <div className={'flex items-center space-x-2'}>
                    <ModeToggle />

                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Avatar className={'h-8 w-8'}>
                                <AvatarFallback>
                                    <span className="sr-only">{user.name}</span>
                                    <FaUser />
                                </AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <div className="flex items-center justify-start gap-2 p-2">
                                <div className="flex flex-col space-y-1 leading-none">
                                    <p className="font-medium">Store No.:</p>
                                    <p className="w-[200px] truncate text-sm text-muted-foreground">{user.store_no}</p>
                                </div>
                            </div>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="cursor-pointer"
                                onSelect={(e) => {
                                    e.preventDefault();
                                }}
                            >
                                Sign out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
};

export default Header;
