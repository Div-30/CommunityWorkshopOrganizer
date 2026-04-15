import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, X, Link as LinkIcon } from 'lucide-react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
};

export default function CreateWorkshopForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    capacity: 20,
    description: '',
    tags: '',
    speaker: 'Oliver Organizer',
    resourceTitle: '',
    resourceUrl: '',
  });
  const [resourceLinks, setResourceLinks] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    if (role !== 'Organizer') navigate('/login');
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const addResourceLink = () => {
    if (!formData.resourceTitle.trim() || !formData.resourceUrl.trim()) return;
    setResourceLinks((prev) => [
      ...prev,
      { title: formData.resourceTitle.trim(), url: formData.resourceUrl.trim() },
    ]);
    setFormData((prev) => ({ ...prev, resourceTitle: '', resourceUrl: '' }));
  };

  const removeResourceLink = (index) => {
    setResourceLinks((prev) => prev.filter((_, i) => i !== index));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.time) newErrors.time = 'Time is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.capacity < 1) newErrors.capacity = 'Capacity must be at least 1';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setIsSubmitting(true);

    setTimeout(() => {
      const newWorkshop = {
        workshopId: `w-${Date.now()}`,
        title: formData.title,
        speaker: formData.speaker,
        date: new Date(`${formData.date}T${formData.time}`).toISOString(),
        capacity: parseInt(formData.capacity, 10),
        registeredCount: 0,
        resourceLinks,
        description: formData.description,
        tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
      };

      const existing = JSON.parse(localStorage.getItem('createdWorkshops') || '[]');
      localStorage.setItem('createdWorkshops', JSON.stringify([newWorkshop, ...existing]));
      setIsSubmitting(false);
      navigate('/organizer');
    }, 800);
  };

  return (
    <motion.div
      className="max-w-2xl mx-auto w-full py-8"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Back button + Header */}
      <motion.div className="mb-8" variants={itemVariants}>
        <button
          onClick={() => navigate('/organizer')}
          className="inline-flex items-center gap-1.5 text-sm font-medium mb-5 transition-all duration-200 hover:-translate-x-0.5"
          style={{ color: 'var(--text-tertiary)' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-violet)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-tertiary)')}
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </button>
        <p
          className="text-xs font-bold uppercase tracking-widest mb-1"
          style={{ color: 'var(--accent-violet)' }}
        >
          Organizer Portal
        </p>
        <h1
          className="text-3xl font-bold tracking-tight"
          style={{ color: 'var(--text-primary)', fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Create a Workshop
        </h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--text-tertiary)' }}>
          Publish a new event to the community discovery dashboard
        </p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card style={{ boxShadow: 'var(--shadow-lg)' }}>
          {/* Progress indicator */}
          <div className="h-1" style={{ background: 'var(--gradient-hero)' }} />

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Title */}
            <motion.div variants={itemVariants}>
              <Input
                label="Workshop Title *"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Introduction to React Context API"
                error={errors.title}
              />
            </motion.div>

            {/* Date + Time */}
            <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-4" variants={itemVariants}>
              <Input
                label="Date *"
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                error={errors.date}
              />
              <Input
                label="Time *"
                type="time"
                id="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                error={errors.time}
              />
            </motion.div>

            {/* Capacity + Tags */}
            <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-4" variants={itemVariants}>
              <Input
                label="Attendee Capacity *"
                type="number"
                id="capacity"
                name="capacity"
                min="1"
                max="1000"
                value={formData.capacity}
                onChange={handleChange}
                error={errors.capacity}
              />
              <div>
                <label
                  htmlFor="tags"
                  className="block text-xs font-semibold uppercase tracking-widest mb-2"
                  style={{ color: 'var(--text-tertiary)' }}
                >
                  Tags{' '}
                  <span className="normal-case font-normal" style={{ color: 'var(--text-tertiary)' }}>
                    (comma-separated)
                  </span>
                </label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="e.g., React, Frontend, Beginners"
                  className="input"
                />
              </div>
            </motion.div>

            {/* Description */}
            <motion.div variants={itemVariants}>
              <label
                htmlFor="description"
                className="block text-xs font-semibold uppercase tracking-widest mb-2"
                style={{ color: 'var(--text-tertiary)' }}
              >
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                placeholder="What will attendees learn? What should they expect?"
                className={`input resize-y ${errors.description ? 'input-error' : ''}`}
              />
              {errors.description && (
                <p className="text-xs mt-1.5 font-medium" style={{ color: 'var(--accent-rose)' }}>
                  {errors.description}
                </p>
              )}
            </motion.div>

            {/* Resource Links */}
            <motion.div variants={itemVariants}>
              <label
                className="block text-xs font-semibold uppercase tracking-widest mb-2"
                style={{ color: 'var(--text-tertiary)' }}
              >
                Resource Links{' '}
                <span className="normal-case font-normal">(optional)</span>
              </label>

              {resourceLinks.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {resourceLinks.map((link, i) => (
                    <motion.div
                      key={i}
                      className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      style={{
                        background: 'rgba(124,58,237,0.08)',
                        color: 'var(--accent-violet)',
                        border: '1px solid rgba(124,58,237,0.15)',
                      }}
                    >
                      <LinkIcon size={12} /> {link.title}
                      <button
                        type="button"
                        onClick={() => removeResourceLink(i)}
                        className="transition-colors duration-200 ml-1 hover:opacity-70"
                        style={{ color: 'var(--accent-rose)' }}
                      >
                        <X size={14} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <input
                  type="text"
                  name="resourceTitle"
                  value={formData.resourceTitle}
                  onChange={handleChange}
                  placeholder="Link title"
                  className="flex-1 input"
                />
                <input
                  type="url"
                  name="resourceUrl"
                  value={formData.resourceUrl}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="flex-1 input"
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={addResourceLink}
                  disabled={!formData.resourceTitle.trim() || !formData.resourceUrl.trim()}
                  className="flex-shrink-0"
                >
                  <Plus size={14} /> Add
                </Button>
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div
              className="pt-6 flex gap-3"
              style={{ borderTop: '1px solid var(--border-default)' }}
              variants={itemVariants}
            >
              <Button
                type="button"
                variant="secondary"
                size="lg"
                onClick={() => navigate('/organizer')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="lg"
                loading={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? 'Publishing...' : 'Publish Workshop'}
              </Button>
            </motion.div>
          </form>
        </Card>
      </motion.div>
    </motion.div>
  );
}