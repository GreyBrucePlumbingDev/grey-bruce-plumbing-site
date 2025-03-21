import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '../../lib/supabase';
import { Loader2, Trash2, PenLine, Plus, Star, Save } from 'lucide-react';

// Define the testimonial schema with Zod
const testimonialSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  rating: z.number().min(1).max(5, "Rating must be between 1 and 5"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  active: z.boolean().default(true)
});

type Testimonial = z.infer<typeof testimonialSchema>;

const TestimonialEditor: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<Testimonial>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      name: '',
      rating: 5,
      description: '',
      active: true
    }
  });

  // Fetch testimonials on component mount
  useEffect(() => {
    fetchTestimonials();
  }, []);

  // Function to fetch testimonials from Supabase
  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setTestimonials(data || []);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission (create or update)
  const onSubmit = async (data: Testimonial) => {
    setSaving(true);
    setSubmitError(null);
    
    try {
      if (editingId) {
        // Update existing testimonial
        const { error } = await supabase
          .from('testimonials')
          .update({
            name: data.name,
            rating: data.rating,
            description: data.description,
            active: data.active
          })
          .eq('id', editingId);

        if (error) throw error;
      } else {
        // Create new testimonial
        const { error } = await supabase
          .from('testimonials')
          .insert([{
            name: data.name,
            rating: data.rating,
            description: data.description,
            active: data.active
          }]);

        if (error) throw error;
      }

      // Reset form and refresh data
      reset();
      fetchTestimonials();
      setEditingId(null);
      setShowForm(false);
    } catch (error: any) {
      console.error('Error saving testimonial:', error);
      setSubmitError(error.message || 'Failed to save testimonial');
    } finally {
      setSaving(false);
    }
  };

  // Handle edit testimonial
  const handleEdit = (testimonial: Testimonial) => {
    setEditingId(testimonial.id as string);
    setValue('name', testimonial.name);
    setValue('rating', testimonial.rating);
    setValue('description', testimonial.description);
    setValue('active', testimonial.active);
    setShowForm(true);
    window.scrollTo(0, 0);
  };

  // Handle delete testimonial
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      try {
        const { error } = await supabase
          .from('testimonials')
          .delete()
          .eq('id', id);

        if (error) throw error;
        
        // Update the local state to reflect the deletion
        setTestimonials(testimonials.filter(t => t.id !== id));
      } catch (error) {
        console.error('Error deleting testimonial:', error);
      }
    }
  };

  // Handle toggle active status
  const toggleActive = async (id: string, currentActive: boolean) => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .update({ active: !currentActive })
        .eq('id', id);

      if (error) throw error;
      
      // Update the local state to reflect the change
      setTestimonials(testimonials.map(t => 
        t.id === id ? { ...t, active: !currentActive } : t
      ));
    } catch (error) {
      console.error('Error updating testimonial status:', error);
    }
  };

  // Cancel editing and reset form
  const handleCancel = () => {
    setEditingId(null);
    reset();
    setShowForm(false);
    setSubmitError(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">
          Manage Testimonials
        </h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-[#152f59] hover:bg-[#0f2347] text-white rounded-md flex items-center gap-2"
          >
            <Plus size={18} /> Add New Testimonial
          </button>
        )}
      </div>

      {submitError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{submitError}</span>
        </div>
      )}

      {showForm && (
        <div className="bg-gray-50 p-6 rounded-lg border">
          <h3 className="text-xl font-medium mb-4">
            {editingId ? 'Edit Testimonial' : 'Add New Testimonial'}
          </h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Client Name
              </label>
              <input
                type="text"
                {...register('name')}
                className="w-full p-2 border rounded-md"
                placeholder="John Doe"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rating (1-5)
              </label>
              <select
                {...register('rating', { valueAsNumber: true })}
                className="w-full p-2 border rounded-md"
              >
                {[1, 2, 3, 4, 5].map((value) => (
                  <option key={value} value={value}>
                    {value} {value === 1 ? 'Star' : 'Stars'}
                  </option>
                ))}
              </select>
              {errors.rating && (
                <p className="text-red-500 text-sm mt-1">{errors.rating.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Testimonial
              </label>
              <textarea
                {...register('description')}
                rows={4}
                className="w-full p-2 border rounded-md"
                placeholder="Share your experience with our services..."
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="active"
                {...register('active')}
                className="checkbox"
              />
              <label htmlFor="active" className="text-sm font-medium text-gray-700">
                Active (Visible on website)
              </label>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-[#7ac144] hover:bg-[#69a83a] text-white rounded-md flex items-center gap-2"
              >
                {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                {saving ? 'Saving...' : 'Save Testimonial'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 size={24} className="animate-spin text-[#152f59]" />
        </div>
      ) : testimonials.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No testimonials found. Add your first testimonial above.
        </div>
      ) : (
        <div className="space-y-4">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className={`p-4 border rounded-lg ${
                testimonial.active ? 'bg-white' : 'bg-gray-50'
              }`}
            >
              <div className="flex justify-between">
                <div>
                  <h3 className="font-medium">{testimonial.name}</h3>
                  <div className="flex items-center text-yellow-500 my-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        fill={i < testimonial.rating ? 'currentColor' : 'none'}
                        className={i < testimonial.rating ? 'text-yellow-500' : 'text-gray-300'}
                      />
                    ))}
                    <span className="ml-1 text-sm text-gray-600">
                      ({testimonial.rating}/5)
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mt-2">{testimonial.description}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleEdit(testimonial)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
                    title="Edit"
                  >
                    <PenLine size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(testimonial.id as string)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                  <button
                    onClick={() => toggleActive(testimonial.id as string, testimonial.active)}
                    className={`p-2 rounded-md ${
                      testimonial.active
                        ? 'text-green-600 hover:bg-green-50'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    title={testimonial.active ? 'Active' : 'Inactive'}
                  >
                    <span className="text-xs font-medium">
                      {testimonial.active ? 'ON' : 'OFF'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TestimonialEditor;
