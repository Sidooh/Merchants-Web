import { Button } from '@/components/ui/button.tsx';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet.tsx';
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils.ts';
import Logo from '@/components/common/Logo.tsx';
import { HiMenuAlt1 } from 'react-icons/hi';
import { ScrollArea } from '@/components/ui/scroll-area.tsx';
import routes from '@/routes.ts';

const MobileNav = () => {
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button
                    variant="ghost"
                    className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
                >
                    <HiMenuAlt1 size={20} />
                </Button>
            </SheetTrigger>

            <SheetContent side="left" >
                <NavLink
                    to="/"
                    className="flex items-center"
                    onClick={() => {
                        navigate('/')
                        setOpen(false);
                    }}
                >
                    <Logo />
                </NavLink>
                <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10">
                    {routes.map((r) => (
                        <div key={r.label} className="py-2">
                            <h2 className="mb-2 text-sm tracking-tight text-gray-400">{r.label}</h2>
                            <div className="space-y-1">
                                {r.children.map(({ name, icon: Icon, to }) => (
                                    <NavLink
                                        to={to}
                                        key={name}
                                        onClick={() => {
                                            navigate(to)
                                            setOpen(false);
                                        }}
                                        className={({ isActive }) =>
                                            cn(
                                                'group flex items-center py-2 text-sm font-medium hover:text-gray-500',
                                                {
                                                    'text-primary border-e-2 border-e-primary/70': isActive,
                                                }
                                            )
                                        }
                                    >
                                        <Icon className="mr-2 h-4 w-4" />
                                        {name}
                                    </NavLink>
                                ))}
                            </div>
                        </div>
                    ))}
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
};

export default MobileNav;