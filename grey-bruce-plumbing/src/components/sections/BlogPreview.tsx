import React from 'react';
import { Link } from 'react-router-dom';

interface BlogPostProps {
  id: string;
  title: string;
  preview: string;
  imageUrl: string;
  date: string;
}

const BlogPreview: React.FC = () => {
  // Hardcoded blog posts (will be replaced with Supabase data later)
  const blogPosts: BlogPostProps[] = [
    {
      id: "water-heater-maintenance",
      title: "5 Essential Water Heater Maintenance Tips for Homeowners",
      preview: "Regular maintenance of your water heater can extend its lifespan and prevent costly repairs. Learn these simple tips to keep your system running efficiently year-round.",
      imageUrl: "/images/blog/water-heater.jpg",
      date: "March 12, 2025"
    },
    {
      id: "eco-friendly-plumbing",
      title: "Eco-Friendly Plumbing Solutions for Modern Homes",
      preview: "Discover how environmentally conscious plumbing choices can reduce your water usage, lower utility bills, and help protect our planet's valuable resources.",
      imageUrl: "/images/blog/eco-plumbing.jpg",
      date: "February 28, 2025"
    }
  ];

  return (
    <div id="blog" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-[#152f59] mb-12">
          Plumbing Tips & Insights
        </h2>

        <div className="max-w-5xl mx-auto space-y-8">
          {blogPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="flex flex-col md:flex-row">
                {/* Image section (30%) */}
                <div className="md:w-[30%] h-48 md:h-auto">
                  <img 
                    //src={post.imageUrl} 
                    alt={post.title}
                    className="w-full h-full object-cover"
                    // Fallback image in case the actual image doesn't load
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://via.placeholder.com/300x200?text=Plumbing+Blog";
                    }}
                  />
                </div>
                
                {/* Text section (70%) */}
                <div className="md:w-[70%] p-6 flex flex-col justify-between">
                  <div>
                    <div className="text-sm text-gray-500 mb-2">{post.date}</div>
                    <h3 className="text-xl font-bold text-[#152f59] mb-3">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {post.preview}
                    </p>
                  </div>
                  
                  <div className="flex justify-end">
                    <Link 
                      to={`/blog/${post.id}`}
                      className="text-[#7ac144] hover:text-[#152f59] font-medium underline flex items-center transition-colors duration-300"
                    >
                      Read more <span className="ml-1">→</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* "View all blog posts" button */}
        <div className="flex justify-center mt-10">
          <Link 
            to="/blog"
            className="px-6 py-3 bg-[#152f59] hover:bg-[#7ac144] text-white font-medium rounded-lg transition-colors duration-300 flex items-center"
          >
            View All Blog Posts <span className="ml-2">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogPreview;