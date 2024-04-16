import { Link, useNavigate } from 'react-router-dom';
import Logo from '@/components/common/Logo.tsx';
import { FaUser } from 'react-icons/fa6';
import { useEffect, useState } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.tsx';
import { Avatar, AvatarFallback } from '@/components/ui/avatar.tsx';
import { cn } from '@/lib/utils.ts';
import { ModeToggle } from '@/components/ModeToggle.tsx';
import { useAuth } from '@/hooks/useAuth.ts';
import { logout, reset } from '@/features/auth/authSlice';
import { useAppDispatch } from '@/app/store.ts';
import MobileNav from '@/layouts/components/MobileNav.tsx';

const Header = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

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

    const handleSignOut = () => {
        dispatch(logout());
        dispatch(reset());

        navigate('/login');
    };

    return (
        <header
            className={cn(
                'sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
                {
                    'shadow-[0_.5rem_.5rem_-.5rem_#0003]': showDropShadow,
                }
            )}
        >
            <div className="container flex h-14 items-center justify-between px-3 md:px-8 py-4">
                <div className="flex md:gap-10">
                    <MobileNav />

                    <Link to="/">
                        <Logo className={'w-20'} />
                    </Link>
                </div>

                <div className={'flex items-center space-x-2'}>
                    <ModeToggle />

                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Avatar className={'h-8 w-8'}>
                                <AvatarFallback>
                                    <span className="sr-only">{user?.name}</span>
                                    <FaUser />
                                </AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <div className="flex items-center justify-start gap-2 p-2">
                                <div className="flex flex-col space-y-1 leading-none">
                                    <p className="font-medium">{user?.name}</p>
                                    <p className="md:w-[200px] truncate text-xs text-muted-foreground">
                                        {user?.business_name}
                                    </p>
                                </div>
                            </div>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <Link to="/my-account" className={'w-full'}>
                                    My Account
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="cursor-pointer"
                                onSelect={(e) => {
                                    e.preventDefault();

                                    handleSignOut();
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
