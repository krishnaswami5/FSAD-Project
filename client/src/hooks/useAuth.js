import { useSelector, useDispatch } from 'react-redux';
import { loginUser, logoutUser, registerUser } from '../redux/slices/authSlice';

const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading, error } = useSelector(state => state.auth);

  const login = (data) => dispatch(loginUser(data));
  const register = (data) => dispatch(registerUser(data));
  const logout = () => dispatch(logoutUser());

  const isAdmin = user?.role === 'admin';
  const isArtist = user?.role === 'artist';
  const isCurator = user?.role === 'curator';
  const isVisitor = user?.role === 'visitor';

  const hasRole = (...roles) => roles.includes(user?.role);

  return { user, isAuthenticated, loading, error, login, register, logout, isAdmin, isArtist, isCurator, isVisitor, hasRole };
};

export default useAuth;
