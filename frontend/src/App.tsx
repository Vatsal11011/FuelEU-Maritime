import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TabNavigation } from './adapters/ui/components/TabNavigation';
import { RoutesTab } from './adapters/ui/components/RoutesTab';
import { CompareTab } from './adapters/ui/components/CompareTab';
import { BankingTab } from './adapters/ui/components/BankingTab';
import { PoolingTab } from './adapters/ui/components/PoolingTab';
import { ROUTES } from './shared/constants/routes';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <TabNavigation />
        <main>
          <Routes>
            <Route path={ROUTES.ROOT} element={<Navigate to={ROUTES.ROUTES} replace />} />
            <Route path={ROUTES.ROUTES} element={<RoutesTab />} />
            <Route path={ROUTES.COMPARE} element={<CompareTab />} />
            <Route path={ROUTES.BANKING} element={<BankingTab />} />
            <Route path={ROUTES.POOLING} element={<PoolingTab />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;