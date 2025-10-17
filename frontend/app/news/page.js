'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  Search,
  ArrowRight,
  Newspaper,
  Microscope,
  Heart,
  Users,
  Award
} from 'lucide-react';

const NewsPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('latest');

  // News categories
  const categories = [
    { id: 'all', label: 'All News', icon: Newspaper, count: 24 },
    { id: 'medical', label: 'Medical Updates', icon: Heart, count: 8 },
    { id: 'research', label: 'Research', icon: Microscope, count: 6 },
    { id: 'events', label: 'Events', icon: Calendar, count: 5 },
    { id: 'community', label: 'Community', icon: Users, count: 3 },
    { id: 'awards', label: 'Awards & Recognition', icon: Award, count: 2 }
  ];

  // Sample news data
  const newsData = [
    {
      id: 1,
      title: "LAUTECH Teaching Hospital Opens New Cardiac Surgery Unit",
      excerpt: "State-of-the-art facility equipped with advanced technology for complex cardiac procedures, featuring 3D imaging and robotic assistance.",
      content: "LAUTECH Teaching Hospital has officially opened its new Cardiac Surgery Unit, marking a significant milestone in our commitment to providing world-class cardiovascular care. The facility features cutting-edge technology including 3D imaging systems, robotic surgical assistance, and advanced monitoring equipment. This expansion will allow us to perform more complex cardiac procedures and train the next generation of cardiac surgeons.",
      category: 'medical',
      author: 'Dr. Sarah Johnson',
      authorRole: 'Chief Medical Officer',
      authorImage: '/s1.jpg',
      publishDate: '2024-03-15',
      readTime: '5 min read',
      image: '/s1.jpg',
      featured: true,
      tags: ['Cardiology', 'Surgery', 'Technology', 'Innovation'],
      views: 1250,
      likes: 89
    },
    {
      id: 2,
      title: "Breakthrough Research in Cancer Treatment Published in Nature Medicine",
      excerpt: "Our oncology team's research on personalized cancer treatment shows 40% improvement in patient outcomes.",
      content: "A groundbreaking study conducted by our oncology research team has been published in the prestigious Nature Medicine journal. The research focuses on personalized cancer treatment approaches using advanced genomic analysis. The study, which followed 500 patients over three years, shows a remarkable 40% improvement in treatment outcomes when using personalized treatment protocols compared to standard approaches.",
      category: 'research',
      author: 'Dr. Michael Adebayo',
      authorRole: 'Director of Oncology Research',
      authorImage: '/s2.jpeg',
      publishDate: '2024-03-12',
      readTime: '7 min read',
      image: '/s2.jpeg',
      featured: true,
      tags: ['Oncology', 'Research', 'Personalized Medicine', 'Cancer Treatment'],
      views: 2100,
      likes: 156
    },
    {
      id: 3,
      title: "Annual Medical Conference 2024: Advancing Healthcare Excellence",
      excerpt: "Join us for three days of medical education, research presentations, and networking opportunities.",
      content: "The LAUTECH Teaching Hospital Annual Medical Conference 2024 is set to bring together healthcare professionals, researchers, and students from across West Africa. The conference will feature keynote presentations by international experts, research paper presentations, workshops on emerging medical technologies, and networking sessions. This year's theme focuses on 'Advancing Healthcare Excellence Through Innovation and Collaboration'.",
      category: 'events',
      author: 'Dr. Fatima Ibrahim',
      authorRole: 'Conference Director',
      authorImage: '/s3.jpeg',
      publishDate: '2024-03-10',
      readTime: '4 min read',
      image: '/s3.jpeg',
      featured: false,
      tags: ['Conference', 'Medical Education', 'Networking', 'Innovation'],
      views: 890,
      likes: 67
    },
    {
      id: 4,
      title: "Community Health Outreach Program Reaches 10,000 Residents",
      excerpt: "Our mobile health unit has provided free medical services to underserved communities across the state.",
      content: "The LAUTECH Teaching Hospital Community Health Outreach Program has reached a significant milestone, providing free medical services to over 10,000 residents in underserved communities. The program, which began in 2020, operates mobile health units that travel to rural areas, offering general health checkups, vaccinations, health education, and basic treatments. This initiative reflects our commitment to improving healthcare access for all members of our community.",
      category: 'community',
      author: 'Dr. Grace Okafor',
      authorRole: 'Community Health Director',
      authorImage: '/s4.jpeg',
      publishDate: '2024-03-08',
      readTime: '6 min read',
      image: '/s4.jpeg',
      featured: false,
      tags: ['Community Health', 'Outreach', 'Public Health', 'Accessibility'],
      views: 1450,
      likes: 112
    },
    {
      id: 5,
      title: "Hospital Receives International Accreditation for Patient Safety",
      excerpt: "LAUTECH Teaching Hospital becomes the first in the region to receive JCI accreditation for patient safety standards.",
      content: "We are proud to announce that LAUTECH Teaching Hospital has received international accreditation from the Joint Commission International (JCI) for our patient safety standards. This prestigious recognition makes us the first hospital in our region to achieve this level of international certification. The accreditation process involved rigorous evaluation of our patient care protocols, safety measures, staff training, and quality improvement processes.",
      category: 'awards',
      author: 'Dr. James Okonkwo',
      authorRole: 'Quality Assurance Director',
      authorImage: '/s5.jpeg',
      publishDate: '2024-03-05',
      readTime: '5 min read',
      image: '/s5.jpeg',
      featured: true,
      tags: ['Accreditation', 'Patient Safety', 'Quality', 'International Recognition'],
      views: 3200,
      likes: 234
    },
    {
      id: 6,
      title: "New AI-Powered Diagnostic System Reduces Diagnosis Time by 60%",
      excerpt: "Artificial intelligence integration in radiology department improves diagnostic accuracy and speed.",
      content: "Our radiology department has successfully integrated an AI-powered diagnostic system that has reduced diagnosis time by 60% while maintaining high accuracy rates. The system uses machine learning algorithms to analyze medical images and assist radiologists in identifying abnormalities. This technological advancement has significantly improved patient care by enabling faster diagnosis and treatment planning.",
      category: 'medical',
      author: 'Dr. Aisha Mohammed',
      authorRole: 'Head of Radiology',
      authorImage: '/s6.jpeg',
      publishDate: '2024-03-03',
      readTime: '4 min read',
      image: '/s6.jpeg',
      featured: false,
      tags: ['AI', 'Radiology', 'Technology', 'Diagnosis'],
      views: 1800,
      likes: 98
    },
    {
      id: 7,
      title: "Medical Students Win National Research Competition",
      excerpt: "LAUTECH medical students secure first place in the National Medical Research Competition with their innovative study on telemedicine.",
      content: "A team of medical students from LAUTECH Teaching Hospital has won first place in the National Medical Research Competition with their innovative study on telemedicine applications in rural healthcare. The winning project, titled 'Bridging the Healthcare Gap: Telemedicine Solutions for Rural Communities,' demonstrated how technology can improve healthcare access in underserved areas. The team received a cash prize and the opportunity to present their research at an international conference.",
      category: 'awards',
      author: 'Dr. Peter Williams',
      authorRole: 'Medical Education Director',
      authorImage: '/s5.jpeg',
      publishDate: '2024-03-01',
      readTime: '5 min read',
      image: '/s1.jpg',
      featured: false,
      tags: ['Students', 'Research', 'Telemedicine', 'Innovation'],
      views: 1200,
      likes: 145
    },
    {
      id: 8,
      title: "Emergency Department Expansion Doubles Patient Capacity",
      excerpt: "New emergency facilities include dedicated trauma bays, pediatric emergency area, and advanced life support equipment.",
      content: "The expansion of our Emergency Department has been completed, effectively doubling our patient capacity and significantly improving our ability to handle medical emergencies. The new facilities include dedicated trauma bays, a specialized pediatric emergency area, advanced life support equipment, and a streamlined triage system. This expansion ensures that we can provide timely and effective emergency care to more patients while maintaining our high standards of medical excellence.",
      category: 'medical',
      author: 'Dr. Blessing Nwosu',
      authorRole: 'Emergency Medicine Director',
      authorImage: '/slide_4.jpeg',
      publishDate: '2024-02-28',
      readTime: '6 min read',
      image: '/s2.jpeg',
      featured: false,
      tags: ['Emergency Medicine', 'Expansion', 'Trauma Care', 'Capacity'],
      views: 2100,
      likes: 178
    }
  ];

  // Filter and sort news
  const filteredNews = newsData
    .filter(article => {
      const matchesCategory = activeCategory === 'all' || article.category === activeCategory;
      const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'latest':
          return new Date(b.publishDate) - new Date(a.publishDate);
        case 'oldest':
          return new Date(a.publishDate) - new Date(b.publishDate);
        case 'popular':
          return b.views - a.views;
        case 'trending':
          return b.likes - a.likes;
        default:
          return 0;
      }
    });

  const featuredNews = newsData.filter(article => article.featured);
  const regularNews = filteredNews.filter(article => !article.featured);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              News & Events
            </h1>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-8">
              Stay updated with the latest news, medical breakthroughs, and announcements from LAUTECH Teaching Hospital.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search news and articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            {/* Categories */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                        activeCategory === category.id
                          ? 'bg-gray-900 text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="w-4 h-4" />
                        <span className="font-medium text-sm">{category.label}</span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        activeCategory === category.id 
                          ? 'bg-white text-gray-900' 
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {category.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Filter Controls */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="text-sm font-medium text-gray-700">
                  {filteredNews.length} article{filteredNews.length !== 1 ? 's' : ''}
                </div>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 text-sm"
                >
                  <option value="latest">Latest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="popular">Most Popular</option>
                  <option value="trending">Trending</option>
                </select>
              </div>
            </div>

            {/* Featured News */}
            {activeCategory === 'all' && featuredNews.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {featuredNews.map((article) => (
                    <article key={article.id} className="group bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow border border-gray-200">
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={article.image}
                          alt={article.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="px-2 py-1 bg-gray-900 text-white text-xs font-medium rounded">
                            {categories.find(c => c.id === article.category)?.label}
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(article.publishDate)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{article.readTime}</span>
                          </div>
                        </div>
                        
                        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                          {article.title}
                        </h3>
                        
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                          {article.excerpt}
                        </p>
                        
                        <Link href={`/news/${article.id}`}>
                          <button className="inline-flex items-center space-x-2 bg-gray-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-black transition-colors text-sm">
                            <span>Read More</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}

            {/* Regular News */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {activeCategory === 'all' ? 'Latest News' : categories.find(c => c.id === activeCategory)?.label}
              </h2>
              
              <div className="space-y-6">
                {regularNews.map((article, index) => (
                  <article key={article.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow border border-gray-200">
                    <div className="flex flex-col sm:flex-row">
                      <div className="sm:w-1/3">
                        <div className="relative h-48 sm:h-full">
                          <Image
                            src={article.image}
                            alt={article.title}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute top-3 left-3">
                            <span className="px-2 py-1 bg-gray-900 text-white text-xs font-medium rounded">
                              {categories.find(c => c.id === article.category)?.label}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="sm:w-2/3 p-6">
                        <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(article.publishDate)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{article.readTime}</span>
                          </div>
                        </div>
                        
                        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                          {article.title}
                        </h3>
                        
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                          {article.excerpt}
                        </p>
                        
                        <Link href={`/news/${article.id}`}>
                          <button className="inline-flex items-center space-x-2 bg-gray-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-black transition-colors text-sm">
                            <span>Read More</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* No Results */}
            {filteredNews.length === 0 && (
              <div className="text-center py-16">
                <Newspaper className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No articles found</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your filters or search terms.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => setSearchTerm('')}
                    className="px-4 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-black transition-colors"
                  >
                    Clear Search
                  </button>
                  <button
                    onClick={() => setActiveCategory('all')}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    Show All Articles
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Newsletter CTA */}
      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Stay Updated
          </h2>
          <p className="text-gray-300 mb-8">
            Get the latest medical news and hospital updates delivered to your inbox.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-xl mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border border-gray-700 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-white focus:outline-none"
            />
            <button className="bg-white text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsPage;
