import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Pools from './pages/Pools';
import Dashboard from './pages/Dashboard';
import ApiPage from './pages/ApiPage';

export default function App() {
    return (
        <div className="min-h-screen bg-lev-bg text-white">
            <Navbar />
            <main className="pt-16">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/pools" element={<Pools />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/api" element={<ApiPage />} />
                </Routes>
            </main>
        </div>
    );
}
