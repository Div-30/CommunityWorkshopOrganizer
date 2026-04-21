import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { organizerRequestAPI } from '../services/api';
import { Button } from '../components/ui/Button';
import { Info, Send } from 'lucide-react';

export function OrganizerRequestPage() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { success, error: showError } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      showError('Please provide a reason or some details about your request.');
      return;
    }

    setLoading(true);
    try {
      await organizerRequestAPI.submitRequest(message);
      success('Your request has been submitted to the administratos. You will be notified once approved.');
      navigate('/dashboard');
    } catch (err) {
      showError(err.message || 'Failed to submit the request. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="w-full max-w-[500px] page-enter bg-white rounded-2xl shadow-xl border border-slate-200">
        
        <div className="p-8 border-b border-slate-100 bg-slate-50 rounded-t-2xl">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 mb-4 shadow-md shadow-indigo-500/20">
            <Send size={22} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Become an Organizer</h1>
          <p className="mt-2 text-sm text-slate-500 leading-relaxed">
            Organizers have the ability to create new workshops, manage attendee capacity, and oversee schedules. Since this is a privileged role, our administration team manually reviews all requests.
          </p>
        </div>

        <div className="p-8">
          <div className="flex items-start gap-3 p-4 mb-6 bg-indigo-50 text-indigo-800 rounded-lg border border-indigo-100">
             <Info className="shrink-0 mt-0.5" size={18} />
             <p className="text-sm font-medium leading-relaxed">
               Please describe your experience, the types of workshops you plan on running, or how you intend to contribute to our community.
             </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Your Application Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="I would like to teach..."
                rows={5}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
              />
            </div>

             <div className="flex items-center gap-3 pt-2">
                <Button 
                   type="button" 
                   variant="outline" 
                   className="flex-1 border-slate-300 text-slate-700"
                   onClick={() => navigate('/dashboard')}
                >
                   Skip for now
                </Button>
                <Button 
                   type="submit" 
                   className="flex-1 bg-emerald-500 hover:bg-emerald-600 border-none shadow-md shadow-emerald-500/20"
                   loading={loading}
                >
                   Submit Request
                </Button>
             </div>
          </form>
        </div>

      </div>
    </div>
  );
}
