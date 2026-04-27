import { useSelector, useDispatch } from 'react-redux';
import { addToCart, removeFromCart, clearCart, toggleCart, cartSubtotal, cartCount } from '../redux/slices/cartSlice';

const useCart = () => {
  const dispatch = useDispatch();
  const { items, isOpen } = useSelector(state => state.cart);
  const subtotal = useSelector(cartSubtotal);
  const count = useSelector(cartCount);

  const addItem = (artwork) => dispatch(addToCart(artwork));
  const removeItem = (id) => dispatch(removeFromCart(id));
  const clear = () => dispatch(clearCart());
  const toggle = () => dispatch(toggleCart());
  const isInCart = (id) => items.some(i => i._id === id);

  const tax = Math.round(subtotal * 0.1 * 100) / 100;
  const total = subtotal + tax;

  return { items, isOpen, count, subtotal, tax, total, addItem, removeItem, clear, toggle, isInCart };
};

export default useCart;
