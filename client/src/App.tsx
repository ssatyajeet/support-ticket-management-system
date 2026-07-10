import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';
import CreateTicketPage from './pages/CreateTicketPage';
import DashboardPage from './pages/DashboardPage';
import NotFoundPage from './pages/NotFoundPage';
import TicketDetailPage from './pages/TicketDetailPage';
import TicketListPage from './pages/TicketListPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/" element={<TicketListPage />} />
          <Route path="/tickets/new" element={<CreateTicketPage />} />
          <Route path="/tickets/:id" element={<TicketDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
