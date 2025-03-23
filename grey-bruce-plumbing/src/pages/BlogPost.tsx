import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import DocumentHead from '../components/DocumentHead';

// Define the Blog type based on your table structure
interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  featured_image: string;
  categories: string;
  created_at: string;
  updated_at: string;
}

const BlogPostPage = () => {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogPost = async () => {
      if (!postId) return;
      
      try {
        setIsLoading(true);
        
        // Fetch the specific blog post by slug
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('slug', postId)
          .eq('published', true)
          .single();
        
        if (error) {
          throw new Error(error.message);
        }
        
        setPost(data);
      } catch (err) {
        console.error('Error fetching blog post:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch blog post');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogPost();
  }, [postId]);

  // Format date to a readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <span className="loading loading-spinner loading-lg text-primary"></span>
    </div>
  );
  
  if (error || !post) return (
    <div className="alert alert-error max-w-3xl mx-auto my-8">
      <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      <span>{error || "Blog post not found"}</span>
    </div>
  );

  return (
    <>
        <DocumentHead pageTitle={post.title} />
        <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Breadcrumb navigation */}
        <div className="text-sm breadcrumbs mb-6">
            <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/blogs">Blogs</Link></li>
            <li className="truncate max-w-xs">{post.title}</li>
            </ul>
        </div>
        
        {/* Featured Image */}
        {post.featured_image && (
            <div className="w-full h-80 md:h-96 mb-8 overflow-hidden rounded-lg shadow-lg">
            <img 
                src={post.featured_image} 
                alt={post.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://via.placeholder.com/1200x600?text=Plumbing+Blog";
                }}
            />
            </div>
        )}
        
        {/* Blog metadata */}
        <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <span>Published: {formatDate(post.created_at)}</span>
            {post.updated_at !== post.created_at && (
                <span>Updated: {formatDate(post.updated_at)}</span>
            )}
            {post.categories && (
                <div className="badge badge-primary">{post.categories}</div>
            )}
            </div>
        </div>
        
        {/* Blog content - display HTML content safely */}
        <div 
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
        />
        
        {/* Back to blogs button */}
        <div className="mt-12">
            <Link to="/blogs" className="btn btn-outline">
            &larr; Back to all blogs
            </Link>
        </div>
        </div>
    </>
  );
};

export default BlogPostPage;