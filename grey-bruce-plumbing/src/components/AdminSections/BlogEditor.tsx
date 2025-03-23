import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import TipTap from '../TipTap';
import { supabase } from '../../lib/supabase';

// Blog post schema
const blogPostSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  excerpt: z.string().min(10, 'Excerpt must be at least 10 characters'),
  featured_image: z.string().optional(),
  categories: z.string().optional(),
  published: z.boolean().default(false),
});

type BlogPostFormValues = z.infer<typeof blogPostSchema>;

interface BlogEditorProps {
  blogFolderPath?: string;
}

const BlogEditor: React.FC<BlogEditorProps> = ({ blogFolderPath = 'blog-images' }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [featuredImagePreview, setFeaturedImagePreview] = useState<string | null>(null);
  const [featuredImageFile, setFeaturedImageFile] = useState<File | null>(null);
  
  const { register, handleSubmit, control, setValue, formState: { errors }, reset } = useForm<BlogPostFormValues>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: '',
      slug: '',
      excerpt: '',
      featured_image: '',
      categories: '',
      published: false
    }
  });

  // Fetch blog post data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchBlogPost = async () => {
        try {
          const { data, error } = await supabase
            .from('blog_posts')
            .select('*')
            .eq('id', id)
            .single();

          if (error) throw error;
          
          if (data) {
            reset({
              title: data.title,
              slug: data.slug,
              excerpt: data.excerpt,
              featured_image: data.featured_image,
              categories: data.categories,
              published: data.published
            });
            
            setContent(data.content);
            
            if (data.featured_image) {
              setFeaturedImagePreview(data.featured_image);
            }
          }
        } catch (error) {
          console.error('Error fetching blog post:', error);
          alert('Failed to load blog post. Please try again.');
        } finally {
          setIsLoading(false);
        }
      };

      fetchBlogPost();
    }
  }, [id, isEditMode, reset]);

  // Handle featured image upload
  const handleFeaturedImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFeaturedImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setFeaturedImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload featured image to Supabase storage
  const uploadFeaturedImage = async (): Promise<string | null> => {
    if (!featuredImageFile) return null;
    
    try {
      // Create a unique file name
      const fileExt = featuredImageFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${blogFolderPath}/${fileName}`;
      
      // Upload to Supabase Storage
      const { error } = await supabase.storage
        .from('assets')
        .upload(filePath, featuredImageFile, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (error) throw error;
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from('assets')
        .getPublicUrl(filePath);
      
      return urlData.publicUrl;
    } catch (error) {
      console.error('Error uploading featured image:', error);
      throw error;
    }
  };

  // Save blog post
  const onSave = async (formData: BlogPostFormValues) => {
    console.log('Form data:', formData);
    try {
      setIsSaving(true);
      
      // Upload featured image if a new one was selected
      let featuredImageUrl = formData.featured_image;
      if (featuredImageFile) {
        const uploadedUrl = await uploadFeaturedImage();
        featuredImageUrl = uploadedUrl || undefined;
      }
      
      const blogPostData = {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt,
        content: content,
        featured_image: featuredImageUrl,
        categories: formData.categories,
        published: formData.published,
        updated_at: new Date()
      };
      
      if (isEditMode) {
        // Update existing post
        const { error } = await supabase
          .from('blog_posts')
          .update(blogPostData)
          .eq('id', id);
          
        if (error) throw error;
      } else {
        // Create new post
        const { error } = await supabase
          .from('blog_posts')
          .insert([{
            ...blogPostData,
            created_at: new Date()
          }]);
          
        if (error) throw error;
      }

      console.log('Blog post saved:', blogPostData);
      alert('Blog post saved successfully!');
      
      // Navigate back to blog posts list
      navigate('/admin/dashboard');
      
    } catch (error) {
      console.error('Error saving blog post:', error);
      alert('Failed to save blog post. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Generate slug from title
  const generateSlug = () => {
    const title = document.getElementById('title') as HTMLInputElement;
    if (title && title.value) {
      const slug = title.value
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')  // Remove special characters
        .replace(/\s+/g, '-')      // Replace spaces with hyphens
        .replace(/-+/g, '-');      // Replace multiple hyphens with single hyphen
      
      setValue('slug', slug);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <span className="loading loading-spinner loading-lg text-[#152f59]"></span>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#152f59]">
          {isEditMode ? 'Edit Blog Post' : 'Create New Blog Post'}
        </h2>
        <button
          type="button"
          className="btn btn-outline"
          onClick={() => navigate('/admin/dashboard')}
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit(onSave)} className="space-y-6">
        {/* Title */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text font-medium">Post Title</span>
          </label>
          <input
            id="title"
            type="text"
            {...register('title')}
            className="input input-bordered w-full"
            onBlur={generateSlug}
          />
          {errors.title && (
            <label className="label">
              <span className="label-text-alt text-error">{errors.title.message}</span>
            </label>
          )}
        </div>

        {/* Slug */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text font-medium">Slug</span>
            <span className="label-text-alt">
              <button
                type="button"
                onClick={generateSlug}
                className="text-[#7ac144] hover:underline"
              >
                Generate from title
              </button>
            </span>
          </label>
          <input
            type="text"
            {...register('slug')}
            className="input input-bordered w-full"
          />
          {errors.slug && (
            <label className="label">
              <span className="label-text-alt text-error">{errors.slug.message}</span>
            </label>
          )}
        </div>

        {/* Excerpt */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text font-medium">Excerpt</span>
          </label>
          <textarea
            {...register('excerpt')}
            className="textarea textarea-bordered h-20"
          />
          {errors.excerpt && (
            <label className="label">
              <span className="label-text-alt text-error">{errors.excerpt.message}</span>
            </label>
          )}
        </div>

        {/* Featured Image */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text font-medium">Featured Image</span>
          </label>
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={handleFeaturedImageChange}
                className="file-input file-input-bordered w-full"
              />
              <input
                type="hidden"
                {...register('featured_image')}
              />
            </div>
            {featuredImagePreview && (
              <div className="w-24 h-24 relative">
                <img
                  src={featuredImagePreview}
                  alt="Featured image preview"
                  className="object-cover w-full h-full rounded-md"
                />
                <button
                  type="button"
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  onClick={() => {
                    setFeaturedImagePreview(null);
                    setFeaturedImageFile(null);
                    setValue('featured_image', '');
                  }}
                >
                  ×
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Categories */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text font-medium">Categories</span>
            <span className="label-text-alt">Separate with commas</span>
          </label>
          <input
            type="text"
            {...register('categories')}
            className="input input-bordered w-full"
            placeholder="e.g. plumbing, drain cleaning, water heaters"
          />
        </div>

        {/* Published Status */}
        <div className="form-control">
          <label className="label cursor-pointer justify-start gap-2">
            <Controller
              name="published"
              control={control}
              render={({ field }) => (
                <input
                  type="checkbox"
                  className="toggle toggle-success"
                  checked={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            <span className="label-text">Publish this post</span>
          </label>
        </div>

        {/* Content Editor */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text font-medium">Content</span>
          </label>
          <TipTap
            initialContent={content}
            onSave={setContent}
            editorHeight="min-h-[500px]"
            folderPath={blogFolderPath}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => navigate('/admin/dashboard')}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn bg-[#7ac144] hover:bg-[#6aad39] text-white"
            disabled={isSaving}
            onClick={() => {
                console.log('Submit button clicked');
                console.log('Current form values:', control._formValues);
                console.log('Current validation errors:', errors);
            }}   
            >
            {isSaving ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Saving...
              </>
            ) : (
              isEditMode ? 'Update Post' : 'Create Post'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogEditor;