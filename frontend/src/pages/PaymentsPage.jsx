import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Spinner } from '../components/ui/Spinner';
import { CreditCard, Lock, ArrowLeft, CheckCircle } from 'lucide-react';
import { workshopAPI, registrationAPI } from '../services/api';

export function PaymentsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { success, error: showError } = useToast();

  const [workshop, setWorkshop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);

  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });

  useEffect(() => {
    async function loadWorkshop() {
      try {
        const wsData = await workshopAPI.getById(id);
        setWorkshop(wsData);
      } catch (err) {
        showError('Failed to load workshop details');
      } finally {
        setLoading(false);
      }
    }
    loadWorkshop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Format card number with spaces
    if (name === 'cardNumber') {
      const cleaned = value.replace(/\s/g, '');
      const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
      setFormData(prev => ({ ...prev, [name]: formatted }));
      return;
    }
    
    // Format expiry date
    if (name === 'expiryDate') {
      const cleaned = value.replace(/\D/g, '');
      const formatted = cleaned.length >= 2 ? `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}` : cleaned;
      setFormData(prev => ({ ...prev, [name]: formatted }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    // Simulate payment processing
    setTimeout(async () => {
      try {
        // Register for workshop after payment
        await registrationAPI.register(Number(id));
        setPaymentComplete(true);
        success('Payment successful! You are now registered.');
        
        // Redirect after 2 seconds
        setTimeout(() => {
          navigate(`/workshops/${id}`);
        }, 2000);
      } catch (err) {
        showError(err.message || 'Payment failed. Please try again.');
        setProcessing(false);
      }
    }, 2000);
  };

  const role = user?.role?.toLowerCase() || 'attendee';

  if (loading) {
    return (
      <PageWrapper role={role}>
        <div className="flex items-center justify-center h-64">
          <Spinner size="lg" />
        </div>
      </PageWrapper>
    );
  }

  if (!workshop) {
    return (
      <PageWrapper role={role}>
        <Card>
          <p className="text-slate-500">Workshop not found</p>
        </Card>
      </PageWrapper>
    );
  }

  if (paymentComplete) {
    return (
      <PageWrapper role={role}>
        <div className="max-w-2xl mx-auto">
          <Card className="text-center py-12">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-emerald-600" />
            </div>
            <h2 className="text-[24px] font-semibold text-slate-900 mb-2">Payment Successful</h2>
            <p className="text-[14px] text-slate-600 mb-6">
              You are now registered for {workshop.title}
            </p>
            <Button onClick={() => navigate(`/workshops/${id}`)}>
              View Workshop Details
            </Button>
          </Card>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper role={role}>
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-6">
        <ArrowLeft size={14} />
        Back
      </Button>

      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <Card>
              <div className="flex items-center gap-2 mb-6">
                <CreditCard size={20} className="text-indigo-600" />
                <h2 className="text-[20px] font-semibold text-slate-900">Payment Details</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Card Number"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  required
                />

                <Input
                  label="Cardholder Name"
                  name="cardName"
                  value={formData.cardName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Expiry Date"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    placeholder="MM/YY"
                    maxLength={5}
                    required
                  />
                  <Input
                    label="CVV"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleChange}
                    placeholder="123"
                    maxLength={3}
                    required
                  />
                </div>

                <div className="bg-slate-50 rounded-xl p-4 flex items-start gap-3">
                  <Lock size={16} className="text-slate-400 mt-0.5" />
                  <p className="text-[13px] text-slate-600 leading-relaxed">
                    Your payment information is encrypted and secure. We do not store your card details.
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  loading={processing}
                  disabled={processing}
                >
                  {processing ? 'Processing Payment...' : 'Pay & Register'}
                </Button>
              </form>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <h3 className="text-[16px] font-semibold text-slate-900 mb-4">Order Summary</h3>
              
              <div className="space-y-3 mb-4 pb-4 border-b border-slate-200">
                <div>
                  <p className="text-[14px] font-medium text-slate-900 mb-1">{workshop.title}</p>
                  <p className="text-[13px] text-slate-500">
                    {new Date(workshop.eventDate).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                  <p className="text-[13px] text-slate-500 mt-0.5">
                    {new Date(workshop.eventDate).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                  </p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-[14px]">
                  <span className="text-slate-600">Registration Fee</span>
                  <span className="text-slate-900 font-medium">
                    {Number(workshop.price).toLocaleString()} RWF
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <div className="flex justify-between">
                  <span className="text-[16px] font-semibold text-slate-900">Total</span>
                  <span className="text-[18px] font-bold text-indigo-600">
                    {Number(workshop.price).toLocaleString()} RWF
                  </span>
                </div>
              </div>
            </Card>

            <div className="mt-4 bg-indigo-50 rounded-xl p-4">
              <p className="text-[13px] text-indigo-700 leading-relaxed">
                By completing this purchase, you agree to our terms of service and refund policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
