import { cn } from '@/lib/utils';
import routes from '@/routes';
import { NavLink } from 'react-router-dom';

export function Sidebar() {
    return (
        <nav className={'pb-12 fixed w-[12.625rem]'}>
            <div className="space-y-4 py-4">
                {routes.map((r) => (
                    <div key={r.label} className="px-3 py-2">
                        <h2 className="mb-2 px-4 text-sm tracking-tight text-gray-400">{r.label}</h2>
                        <div className="space-y-1">
                            {r.children.map(({ name, icon: Icon, to }) => (
                                <NavLink
                                    to={to}
                                    key={name}
                                    className={({ isActive }) =>
                                        cn(
                                            'group flex items-center  px-3 py-2 text-sm font-medium hover:text-gray-500',
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
            </div>
        </nav>
    );
}
