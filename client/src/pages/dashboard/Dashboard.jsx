import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import AdminDashboard from './AdminDashboard';
import ArtistDashboard from './ArtistDashboard';
import CuratorDashboard from './CuratorDashboard';
import VisitorDashboard from './VisitorDashboard';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  switch (user?.role) {
    case 'admin':   return <AdminDashboard />;
    case 'artist':  return <ArtistDashboard />;
    case 'curator': return <CuratorDashboard />;
    case 'visitor': return <VisitorDashboard />;
    default: navigate('/login'); return null;
  }
};

export default Dashboard;
