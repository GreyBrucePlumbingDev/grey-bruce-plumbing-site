import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import DocumentHead from '../components/DocumentHead';

// Define the Blog type based on your table structure
interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featured_image: string;
  categories: string;
  created_at: string;
}

const BlogPage = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setIsLoading(true);
        
        // Fetch all published blog posts ordered by creation date
        const { data, error } = await supabase
          .from('blog_posts')
          .select('id, title, slug, excerpt, featured_image, categories, created_at')
          .eq('published', true)
          .order('created_at', { ascending: false });
        
        if (error) {
          throw new Error(error.message);
        }
        
        const blogData = data || [];
        setBlogs(blogData);
        setFilteredBlogs(blogData);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(blogData.map(blog => blog.categories).filter(Boolean))];
        setCategories(uniqueCategories);
      } catch (err) {
        console.error('Error fetching blogs:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch blogs');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  useEffect(() => {
    // Filter blogs based on search term and category
    const applyFilters = () => {
      let filtered = [...blogs];
      
      if (searchTerm) {
        filtered = filtered.filter(blog => 
          blog.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
          blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      if (selectedCategory) {
        filtered = filtered.filter(blog => blog.categories === selectedCategory);
      }
      
      setFilteredBlogs(filtered);
    };
    
    applyFilters();
  }, [searchTerm, selectedCategory, blogs]);

  // Format date to a readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  if (isLoading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <span className="loading loading-spinner loading-lg text-[#7ac144]"></span>
    </div>
  );
  
  if (error) return (
    <div className="alert alert-error max-w-3xl mx-auto my-8 bg-red-100 border-red-400 text-red-700">
      <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      <span>Error: {error}</span>
    </div>
  );

  return (
    <>
        <DocumentHead pageTitle="Plumbing Tips & Insights" />
        <div className="container mx-auto px-4 py-12 max-w-6xl">
        <h1 className="text-4xl font-bold text-center mb-6 text-[#152f59]">Plumbing Tips & Insights</h1>
        <p className="text-center mb-12 text-gray-600 max-w-2xl mx-auto">
            Learn from our experienced plumbers with the latest advice, how-to guides, and industry insights to keep your plumbing systems running smoothly.
        </p>
        
        {/* Search and Filter Section */}
        <div className="mb-10 bg-gray-50 p-6 rounded-lg shadow">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
                <div className="input-group">
                <input 
                    type="text" 
                    placeholder="Search articles..." 
                    className="input input-bordered w-full focus:border-[#7ac144] focus:ring-1 focus:ring-[#7ac144]" 
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                <button className="btn bg-[#152f59] hover:bg-[#0e1f3a] text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </button>
                </div>
            </div>
            
            <div className="form-control">
                <select 
                className="select select-bordered w-full focus:border-[#7ac144]"
                value={selectedCategory}
                onChange={handleCategoryChange}
                >
                <option value="">All Categories</option>
                {categories.map((category, index) => (
                    <option key={index} value={category}>{category}</option>
                ))}
                </select>
            </div>
            </div>
        </div>
        
        {filteredBlogs.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <p className="text-xl text-gray-500">No blog posts match your search criteria.</p>
            <button 
                className="btn btn-outline btn-primary mt-4 border-[#7ac144] text-[#7ac144] hover:bg-[#7ac144] hover:border-[#7ac144]"
                onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
                }}
            >
                Clear Filters
            </button>
            </div>
        ) : (
            <div className="space-y-8">
            {filteredBlogs.map((blog) => (
                <div key={blog.id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow overflow-hidden border border-gray-100">
                <div className="md:flex">
                    {/* Image section (30%) */}
                    <div className="md:w-1/3 h-64 overflow-hidden flex-shrink-0">
                    <img 
                        src={blog.featured_image} 
                        alt={blog.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/images/plumbing-blog-placeholder.jpg";
                        }}
                    />
                    </div>
                    
                    {/* Content section (70%) */}
                    <div className="card-body md:w-2/3">
                    {blog.categories && (
                        <div className="card-actions justify-start mb-2">
                        <div className="badge bg-[#7ac144] text-white">{blog.categories}</div>
                        </div>
                    )}
                    <h2 className="card-title text-2xl text-[#152f59] hover:text-[#7ac144] transition-colors">
                        <Link to={`/blogs/${blog.slug}`}>
                        {blog.title}
                        </Link>
                    </h2>
                    <p className="text-sm text-gray-500 mb-2">{formatDate(blog.created_at)}</p>
                    <p className="text-gray-700">{blog.excerpt}</p>
                    <div className="card-actions justify-end mt-4">
                        <Link 
                        to={`/blogs/${blog.slug}`} 
                        className="btn bg-[#152f59] hover:bg-[#0e1f3a] text-white border-none"
                        >
                        Read More
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                        </Link>
                    </div>
                    </div>
                </div>
                </div>
            ))}
            </div>
        )}
        
        {/* Pagination could be added here in the future */}
        
        {/* Newsletter Signup 

        <div className="mt-16 bg-[#152f59] text-white p-8 rounded-lg">
            <div className="text-center">
            <h3 className="text-2xl font-bold mb-2">Stay Updated with Plumbing Tips</h3>
            <p className="mb-6">Subscribe to our newsletter for the latest plumbing advice and special offers.</p>
            <div className="flex flex-col md:flex-row max-w-md mx-auto gap-2">
                <input 
                type="email" 
                placeholder="Your email address" 
                className="input input-bordered w-full text-gray-800" 
                />
                <button className="btn bg-[#7ac144] hover:bg-[#68a538] border-none text-white">
                Subscribe
                </button>
            </div>
            </div>
        </div>
        */}
        </div>
    </>
  );
};

export default BlogPage;