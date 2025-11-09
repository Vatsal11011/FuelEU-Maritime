import { NavLink } from 'react-router-dom';
import { ROUTES } from '../../../shared/constants/routes';
import type { TabConfig } from '../../../shared/types';

export const TabNavigation: React.FC = () => {
  const tabs: TabConfig[] = [
    { id: 'routes', label: 'Routes', path: ROUTES.ROUTES },
    { id: 'compare', label: 'Compare', path: ROUTES.COMPARE },
    { id: 'banking', label: 'Banking', path: ROUTES.BANKING },
    { id: 'pooling', label: 'Pooling', path: ROUTES.POOLING },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8">
          {tabs.map((tab) => (
            <NavLink
              key={tab.id}
              to={tab.path}
              className={({ isActive }) =>
                `px-1 py-4 text-sm font-medium transition-colors border-b-2 ${
                  isActive
                    ? 'text-blue-600 border-blue-600'
                    : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                }`
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};