import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, Lock, ArrowLeft, Check } from 'lucide-react';
import useCart from '../../hooks/useCart';
import { formatCurrency } from '../../utils/formatters';
import { STRIPE_TEST_CARD } from '../../utils/constants';

const steps = ['Shipping', 'Payment', 'Confirm'];

const Checkout = () => {
  const { items, subtotal, tax, total, clear } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [shipping, setShipping] = useState({ name: '', email: '', line1: '', city: '', state: '', zip: '', country: 'US' });
  const [card, setCard] = useState({ number: '', exp: '', cvc: '', name: '' });

  const handleShippingSubmit = (e) => { e.preventDefault(); setStep(1); };

  const handlePayment = async (e) => {
    e.preventDefault();
    setProcessing(true);
    // Simulate payment processing
    await new Promise(r => setTimeout(r, 2000));
    setProcessing(false);
    clear();
    navigate('/order-confirmation', { state: { orderId: 'ORD' + Date.now(), total, items } });
  };

  if (items.length === 0 && step < 2) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="section min-h-screen">
      <div className="container-max max-w-5xl">
        <button onClick={() => step > 0 ? setStep(s => s - 1) : navigate('/cart')}
          className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> {step > 0 ? 'Back' : 'Return to Cart'}
        </button>

        <h1 className="font-display text-4xl font-bold text-white mb-8">Checkout</h1>

        {/* Step indicator */}
        <div className="flex items-center mb-10">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                i < step ? 'bg-green-600 text-white' : i === step ? 'bg-primary-600 text-white' : 'bg-gallery-card border border-gallery-border text-gray-500'
              }`}>
                {i < step ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`ml-2 text-sm ${i === step ? 'text-white' : 'text-gray-500'}`}>{s}</span>
              {i < steps.length - 1 && <div className={`mx-4 h-px flex-1 w-16 ${i < step ? 'bg-green-600' : 'bg-gallery-border'}`} />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            {/* Step 0: Shipping */}
            {step === 0 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className="font-display text-2xl font-bold text-white mb-6">Shipping Information</h2>
                <form onSubmit={handleShippingSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="input-label">Full Name</label>
                      <input required className="input" placeholder="Your full name"
                        value={shipping.name} onChange={e => setShipping(s => ({ ...s, name: e.target.value }))} />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="input-label">Email</label>
                      <input required type="email" className="input" placeholder="you@example.com"
                        value={shipping.email} onChange={e => setShipping(s => ({ ...s, email: e.target.value }))} />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="input-label">Address</label>
                      <input required className="input" placeholder="Street address"
                        value={shipping.line1} onChange={e => setShipping(s => ({ ...s, line1: e.target.value }))} />
                    </div>
                    <div>
                      <label className="input-label">City</label>
                      <input required className="input" placeholder="City"
                        value={shipping.city} onChange={e => setShipping(s => ({ ...s, city: e.target.value }))} />
                    </div>
                    <div>
                      <label className="input-label">State</label>
                      <input required className="input" placeholder="State"
                        value={shipping.state} onChange={e => setShipping(s => ({ ...s, state: e.target.value }))} />
                    </div>
                    <div>
                      <label className="input-label">ZIP Code</label>
                      <input required className="input" placeholder="ZIP"
                        value={shipping.zip} onChange={e => setShipping(s => ({ ...s, zip: e.target.value }))} />
                    </div>
                    <div>
                      <label className="input-label">Country</label>
                      <select className="input" value={shipping.country}
                        onChange={e => setShipping(s => ({ ...s, country: e.target.value }))}>
                        <option value="US" className="bg-gallery-surface">United States</option>
                        <option value="UK" className="bg-gallery-surface">United Kingdom</option>
                        <option value="CA" className="bg-gallery-surface">Canada</option>
                        <option value="AU" className="bg-gallery-surface">Australia</option>
                        <option value="FR" className="bg-gallery-surface">France</option>
                        <option value="DE" className="bg-gallery-surface">Germany</option>
                      </select>
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary w-full btn-lg mt-4">
                    Continue to Payment
                  </button>
                </form>
              </motion.div>
            )}

            {/* Step 1: Payment */}
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className="font-display text-2xl font-bold text-white mb-2">Payment Details</h2>
                <p className="text-gray-400 text-sm mb-6 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-green-400" /> Your payment is secured and encrypted
                </p>

                {/* Stripe test notice */}
                <div className="p-3 mb-6 rounded-xl bg-accent-900/20 border border-accent-700/30">
                  <p className="text-xs text-accent-300 font-medium">🧪 Test Mode — Use card: <code className="font-mono">{STRIPE_TEST_CARD}</code> · Exp: 12/26 · CVC: 123</p>
                </div>

                <form onSubmit={handlePayment} className="space-y-4">
                  <div>
                    <label className="input-label">Card Number</label>
                    <div className="relative">
                      <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input required className="input pl-10" placeholder="4242 4242 4242 4242"
                        maxLength={19}
                        value={card.number}
                        onChange={e => {
                          const val = e.target.value.replace(/\D/g, '').slice(0, 16);
                          const formatted = val.match(/.{1,4}/g)?.join(' ') || val;
                          setCard(c => ({ ...c, number: formatted }));
                        }} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="input-label">Expiry</label>
                      <input required className="input" placeholder="MM/YY" maxLength={5}
                        value={card.exp}
                        onChange={e => {
                          let val = e.target.value.replace(/\D/g, '').slice(0, 4);
                          if (val.length > 2) val = val.slice(0, 2) + '/' + val.slice(2);
                          setCard(c => ({ ...c, exp: val }));
                        }} />
                    </div>
                    <div>
                      <label className="input-label">CVC</label>
                      <input required className="input" placeholder="123" maxLength={3}
                        value={card.cvc}
                        onChange={e => setCard(c => ({ ...c, cvc: e.target.value.replace(/\D/g, '').slice(0, 3) }))} />
                    </div>
                  </div>
                  <div>
                    <label className="input-label">Name on Card</label>
                    <input required className="input" placeholder="Full name as on card"
                      value={card.name} onChange={e => setCard(c => ({ ...c, name: e.target.value }))} />
                  </div>
                  <button type="submit" disabled={processing} className="btn btn-primary w-full btn-lg mt-4">
                    {processing ? (
                      <span className="flex items-center gap-2">
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Processing payment…
                      </span>
                    ) : (
                      <><Lock className="w-4 h-4" /> Pay {formatCurrency(total)}</>
                    )}
                  </button>
                </form>
              </motion.div>
            )}
          </div>

          {/* Order summary sidebar */}
          <div>
            <div className="card p-5 sticky top-24">
              <h3 className="font-semibold text-white mb-4">Order Summary</h3>
              <div className="space-y-3 mb-4">
                {items.map(item => (
                  <div key={item._id} className="flex gap-2">
                    <img src={item.thumbnail} alt={item.title}
                      className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                      onError={e => { e.target.src = `https://picsum.photos/seed/${item._id}/80/80`; }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-white truncate">{item.title}</p>
                      <p className="text-xs text-gray-500">{item.artist?.name}</p>
                      <p className="text-xs text-primary-400 font-medium">{formatCurrency(item.price)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-gallery-border pt-4 space-y-2">
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Subtotal</span><span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Tax</span><span>{formatCurrency(tax)}</span>
                </div>
                <div className="flex justify-between font-semibold text-white">
                  <span>Total</span><span className="text-gradient">{formatCurrency(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
