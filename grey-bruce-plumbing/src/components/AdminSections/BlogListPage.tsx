import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { formatDistanceToNow } from 'date-fns';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featured_image: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
}

const BlogListPage: React.FC = () => {
  const navigate = useNavigate();
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Fetch blog posts from Supabase
  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        setIsLoading(true);
        
        let query = supabase
          .from('blog_posts')
          .select('*')
          .order('created_at', { ascending: false });
        
        // Apply filter
        if (filter === 'published') {
          query = query.eq('published', true);
        } else if (filter === 'draft') {
          query = query.eq('published', false);
        }
        
        // Apply search if provided
        if (searchTerm) {
          query = query.ilike('title', `%${searchTerm}%`);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        setBlogPosts(data || []);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
        alert('Failed to load blog posts. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogPosts();
  }, [filter, searchTerm]);

  // Navigate to create new blog post
  const handleCreateNew = () => {
    navigate('/admin/blog/new');
  };

  // Navigate to edit blog post
  const handleEdit = (id: string) => {
    navigate(`/admin/blog/edit/${id}`);
  };

  // Delete blog post
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
      try {
        setIsDeleting(id);
        const { error } = await supabase
          .from('blog_posts')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        
        // Remove post from state
        setBlogPosts(blogPosts.filter(post => post.id !== id));
      } catch (error) {
        console.error('Error deleting blog post:', error);
        alert('Failed to delete blog post. Please try again.');
      } finally {
        setIsDeleting(null);
      }
    }
  };

  // Toggle publish status
  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    try {
      setIsDeleting(id); // Reuse loading state for publish toggle
      
      const { error } = await supabase
        .from('blog_posts')
        .update({ published: !currentStatus, updated_at: new Date() })
        .eq('id', id);
      
      if (error) throw error;
      
      // Update post in state
      setBlogPosts(blogPosts.map(post => 
        post.id === id ? { ...post, published: !currentStatus } : post
      ));
    } catch (error) {
      console.error('Error updating publish status:', error);
      alert('Failed to update publish status. Please try again.');
    } finally {
      setIsDeleting(null);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <div className="w-full">
      {/* Header with actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-[#152f59]">Blog Posts</h2>
        
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="flex-1 md:flex-initial">
            <input
              type="text"
              placeholder="Search by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input input-bordered w-full md:w-64"
            />
          </div>
          
          <div className="flex-1 md:flex-initial">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'all' | 'published' | 'draft')}
              className="select select-bordered w-full"
            >
              <option value="all">All Posts</option>
              <option value="published">Published Only</option>
              <option value="draft">Drafts Only</option>
            </select>
          </div>
          
          <button
            onClick={handleCreateNew}
            className="btn bg-[#7ac144] hover:bg-[#6aad39] text-white"
          >
            New Post
          </button>
        </div>
      </div>

      {/* Blog posts table */}
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <span className="loading loading-spinner loading-lg text-[#152f59]"></span>
        </div>
      ) : blogPosts.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th className="bg-gray-100">Title</th>
                <th className="bg-gray-100">Status</th>
                <th className="bg-gray-100 hidden md:table-cell">Last Updated</th>
                <th className="bg-gray-100">Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogPosts.map((post) => (
                <tr key={post.id} className="hover">
                  <td>
                    <div className="flex items-center space-x-3">
                      {post.featured_image && (
                        <div className="avatar">
                          <div className="w-12 h-12 rounded">
                            <img src={post.featured_image} alt={post.title} />
                          </div>
                        </div>
                      )}
                      <div>
                        <div className="font-bold">{post.title}</div>
                        <div className="text-sm opacity-70 hidden md:block">
                          {post.slug}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${post.published ? 'badge-success' : 'badge-ghost'}`}>
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="hidden md:table-cell">{formatDate(post.updated_at)}</td>
                  <td>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(post.id)}
                        className="btn btn-sm btn-outline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleTogglePublish(post.id, post.published)}
                        className={`btn btn-sm ${post.published ? 'btn-warning' : 'btn-success'}`}
                        disabled={isDeleting === post.id}
                      >
                        {isDeleting === post.id ? (
                          <span className="loading loading-spinner loading-xs"></span>
                        ) : (
                          post.published ? 'Unpublish' : 'Publish'
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="btn btn-sm btn-error"
                        disabled={isDeleting === post.id}
                      >
                        {isDeleting === post.id ? (
                          <span className="loading loading-spinner loading-xs"></span>
                        ) : (
                          'Delete'
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <div className="text-gray-500 mb-4">No blog posts found</div>
          <button
            onClick={handleCreateNew}
            className="btn bg-[#7ac144] hover:bg-[#6aad39] text-white"
          >
            Create your first blog post
          </button>
        </div>
      )}
    </div>
  );
};

export default BlogListPage;