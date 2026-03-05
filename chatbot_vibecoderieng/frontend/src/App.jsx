import { useState, useEffect } from 'react';
import AdminAuthGate from './components/admin/AdminAuthGate';
import DashboardLayout from './components/layout/DashboardLayout';

import ChatPage from './pages/ChatPage';
import RegistrationDashboard from './pages/RegistrationDashboard';
import FacebookChannelsPage from './pages/FacebookChannelsPage';
import WebWidgetPage from './pages/WebWidgetPage';
import RagPage from './pages/RagPage';
import AiSettingsPage from './pages/AiSettingsPage';
import StatusPage from './pages/StatusPage';
import HistoryPage from './pages/HistoryPage';

function useHashRoute() {
    const [hash, setHash] = useState(window.location.hash || '#/');
    useEffect(() => {
        const onHashChange = () => setHash(window.location.hash || '#/');
        window.addEventListener('hashchange', onHashChange);
        return () => window.removeEventListener('hashchange', onHashChange);
    }, []);
    return hash;
}

const ROUTES = {
    '#/': ChatPage,
    '#/chat': ChatPage,
    '#/leads': RegistrationDashboard,
    '#/channels': FacebookChannelsPage,          // backward compat redirect
    '#/channels/facebook': FacebookChannelsPage,
    '#/channels/web': WebWidgetPage,
    '#/rag': RagPage,
    '#/ai-settings': AiSettingsPage,
    '#/history': HistoryPage,
    '#/status': StatusPage,
};

export default function App() {
    const hash = useHashRoute();
    const Page = ROUTES[hash] || ChatPage;

    return (
        <AdminAuthGate>
            <DashboardLayout>
                <Page />
            </DashboardLayout>
        </AdminAuthGate>
    );
}
