'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  User,
  Tag,
  Search,
  Filter,
  ArrowRight,
  Newspaper,
  Megaphone,
  Microscope,
  Heart,
  Users,
  Award,
  ChevronDown,
  ChevronUp,
  Mail,
  Share2,
  Bookmark
} from 'lucide-react';

const NewsPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [showFilters, setShowFilters] = useState(false);
  const [bookmarkedArticles, setBookmarkedArticles] = useState(new Set());

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

  const toggleBookmark = (articleId) => {
    setBookmarkedArticles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(articleId)) {
        newSet.delete(articleId);
      } else {
        newSet.add(articleId);
      }
      return newSet;
    });
  };

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
      <div className="relative bg-gradient-to-br from-green-900 via-green-800 to-green-700 text-white py-24 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-8">
              <Newspaper className="w-5 h-5" />
              <span className="text-sm font-semibold">Latest Updates</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">
              News & Events
            </h1>
            <p className="text-xl text-green-100 max-w-4xl mx-auto mb-12 leading-relaxed">
              Stay updated with the latest news, medical breakthroughs, events, and announcements from LAUTECH Teaching Hospital. 
              Discover our innovations, research findings, and community impact.
            </p>
            
            {/* Enhanced Search Bar */}
            <div className="max-w-3xl mx-auto">
              <div className="relative group">
                <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6 group-focus-within:text-green-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Search news, articles, events, and medical breakthroughs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-16 pr-6 py-5 rounded-2xl border-0 text-gray-900 placeholder-gray-500 focus:ring-4 focus:ring-green-300 focus:outline-none shadow-2xl text-lg"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors">
                  Search
                </button>
              </div>
              
              {/* Quick Search Tags */}
              <div className="flex flex-wrap justify-center gap-3 mt-6">
                {['Cardiology', 'Research', 'Events', 'Technology', 'Community'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSearchTerm(tag)}
                    className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-medium hover:bg-white/30 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Enhanced Sidebar */}
          <div className="lg:w-1/4 space-y-8">
            {/* Categories */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <Tag className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Categories</h3>
              </div>
              <div className="space-y-3">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 group ${
                        activeCategory === category.id
                          ? 'bg-gradient-to-r from-green-50 to-green-100 text-green-700 border-2 border-green-200 shadow-lg transform scale-105'
                          : 'text-gray-600 hover:bg-gray-50 hover:shadow-md hover:scale-105'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                          activeCategory === category.id ? 'bg-green-200' : 'bg-gray-100 group-hover:bg-gray-200'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="font-semibold text-lg">{category.label}</span>
                      </div>
                      <span className={`text-sm px-3 py-1 rounded-full font-bold transition-colors ${
                        activeCategory === category.id 
                          ? 'bg-green-200 text-green-800' 
                          : 'bg-gray-200 text-gray-600 group-hover:bg-gray-300'
                      }`}>
                        {category.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Trending Articles */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Award className="w-5 h-5 text-orange-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Trending</h3>
              </div>
              <div className="space-y-6">
                {newsData.slice(0, 3).map((article, index) => (
                  <div key={article.id} className="flex space-x-4 group cursor-pointer">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-gray-900 group-hover:text-green-600 transition-colors line-clamp-2">
                        {article.title}
                      </h4>
                      <div className="flex items-center space-x-2 mt-2 text-xs text-gray-500">
                        <span>{article.views} views</span>
                        <span>•</span>
                        <span>{article.likes} likes</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Newsletter Subscription */}
            <div className="bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 rounded-3xl shadow-xl p-8 border border-gray-100">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Stay Updated</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Get the latest news, medical breakthroughs, and hospital updates delivered to your inbox.
                </p>
                <div className="space-y-4">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full px-6 py-4 rounded-2xl border border-gray-300 focus:ring-4 focus:ring-green-300 focus:border-transparent text-center"
                  />
                  <button className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-4 px-6 rounded-2xl font-bold text-lg hover:from-green-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                    Subscribe Now
                  </button>
                  <p className="text-xs text-gray-500">
                    Join 5,000+ subscribers. Unsubscribe anytime.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-6">Hospital Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Total Articles</span>
                  <span className="text-2xl font-bold text-green-400">24</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Monthly Readers</span>
                  <span className="text-2xl font-bold text-blue-400">15K+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Research Papers</span>
                  <span className="text-2xl font-bold text-purple-400">65+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Events This Month</span>
                  <span className="text-2xl font-bold text-orange-400">8</span>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Main Content */}
          <div className="lg:w-3/4">
            {/* Enhanced Filter and Sort Controls */}
            <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-gray-100">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div className="flex flex-wrap items-center gap-4">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-green-50 to-blue-50 text-gray-700 rounded-2xl hover:from-green-100 hover:to-blue-100 transition-all duration-300 border border-green-200"
                  >
                    <Filter className="w-5 h-5" />
                    <span className="font-semibold">Filters & Sort</span>
                    {showFilters ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                  
                  {showFilters && (
                    <div className="flex items-center space-x-4">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-6 py-3 border border-gray-300 rounded-2xl focus:ring-4 focus:ring-green-300 focus:border-transparent font-semibold"
                      >
                        <option value="latest">📅 Latest First</option>
                        <option value="oldest">📅 Oldest First</option>
                        <option value="popular">🔥 Most Popular</option>
                        <option value="trending">⭐ Trending</option>
                      </select>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-lg font-semibold text-gray-700">
                    <span className="text-green-600">{filteredNews.length}</span> article{filteredNews.length !== 1 ? 's' : ''} found
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>Updated 2 hours ago</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Featured News */}
            {activeCategory === 'all' && featuredNews.length > 0 && (
              <div className="mb-16">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">Featured News</h2>
                  <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent"></div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {featuredNews.map((article) => (
                    <article key={article.id} className="group bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 border border-gray-100 transform hover:-translate-y-2">
                      <div className="relative h-80 overflow-hidden">
                        <Image
                          src={article.image}
                          alt={article.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                        
                        {/* Featured Badge */}
                        <div className="absolute top-6 left-6">
                          <span className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm font-bold rounded-full shadow-lg">
                            ⭐ Featured
                          </span>
                        </div>
                        
                        {/* Bookmark Button */}
                        <button
                          onClick={() => toggleBookmark(article.id)}
                          className="absolute top-6 right-6 p-3 bg-white/90 backdrop-blur-sm rounded-2xl hover:bg-white transition-all duration-300 shadow-lg"
                        >
                          <Bookmark className={`w-5 h-5 ${bookmarkedArticles.has(article.id) ? 'text-green-600 fill-current' : 'text-gray-400'}`} />
                        </button>
                        
                        {/* Category Badge */}
                        <div className="absolute bottom-6 left-6">
                          <span className="px-3 py-1 bg-green-600 text-white text-xs font-semibold rounded-full">
                            {categories.find(c => c.id === article.category)?.label}
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-8">
                        <div className="flex items-center space-x-6 text-sm text-gray-500 mb-4">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4" />
                            <span className="font-medium">{formatDate(article.publishDate)}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4" />
                            <span className="font-medium">{article.readTime}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4" />
                            <span className="font-medium">{article.views} views</span>
                          </div>
                        </div>
                        
                        <h3 className="text-2xl font-bold text-gray-900 mb-4 line-clamp-2 group-hover:text-green-600 transition-colors">
                          {article.title}
                        </h3>
                        
                        <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">
                          {article.excerpt}
                        </p>
                        
                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-6">
                          {article.tags.slice(0, 3).map((tag, index) => (
                            <span key={index} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                              {tag}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Image
                              src={article.authorImage}
                              alt={article.author}
                              width={40}
                              height={40}
                              className="rounded-full border-2 border-green-200"
                            />
                            <div>
                              <p className="text-sm font-bold text-gray-900">{article.author}</p>
                              <p className="text-xs text-gray-500">{article.authorRole}</p>
                            </div>
                          </div>
                          
                          <Link href={`/news/${article.id}`}>
                            <button className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:from-green-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
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
            )}

            {/* Enhanced Regular News */}
            <div>
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <Newspaper className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">
                  {activeCategory === 'all' ? 'Latest News' : categories.find(c => c.id === activeCategory)?.label}
                </h2>
                <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent"></div>
              </div>
              
              <div className="space-y-8">
                {regularNews.map((article, index) => (
                  <article key={article.id} className="group bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 border border-gray-100 transform hover:-translate-y-1">
                    <div className="flex flex-col lg:flex-row">
                      <div className="lg:w-1/3">
                        <div className="relative h-64 lg:h-full">
                          <Image
                            src={article.image}
                            alt={article.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                          
                          {/* Category Badge */}
                          <div className="absolute top-4 left-4">
                            <span className="px-3 py-1 bg-green-600 text-white text-xs font-semibold rounded-full">
                              {categories.find(c => c.id === article.category)?.label}
                            </span>
                          </div>
                          
                          {/* Bookmark Button */}
                          <button
                            onClick={() => toggleBookmark(article.id)}
                            className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-xl hover:bg-white transition-all duration-300"
                          >
                            <Bookmark className={`w-4 h-4 ${bookmarkedArticles.has(article.id) ? 'text-green-600 fill-current' : 'text-gray-400'}`} />
                          </button>
                        </div>
                      </div>
                      
                      <div className="lg:w-2/3 p-8">
                        <div className="flex items-center space-x-6 text-sm text-gray-500 mb-4">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4" />
                            <span className="font-medium">{formatDate(article.publishDate)}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4" />
                            <span className="font-medium">{article.readTime}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4" />
                            <span className="font-medium">{article.views} views</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Heart className="w-4 h-4" />
                            <span className="font-medium">{article.likes} likes</span>
                          </div>
                        </div>
                        
                        <h3 className="text-2xl font-bold text-gray-900 mb-4 line-clamp-2 group-hover:text-green-600 transition-colors">
                          {article.title}
                        </h3>
                        
                        <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">
                          {article.excerpt}
                        </p>
                        
                        <div className="flex flex-wrap gap-2 mb-6">
                          {article.tags.map((tag, index) => (
                            <span key={index} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium hover:bg-gray-200 transition-colors">
                              {tag}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Image
                              src={article.authorImage}
                              alt={article.author}
                              width={40}
                              height={40}
                              className="rounded-full border-2 border-green-200"
                            />
                            <div>
                              <p className="text-sm font-bold text-gray-900">{article.author}</p>
                              <p className="text-xs text-gray-500">{article.authorRole}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-3">
                            <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors group">
                              <Share2 className="w-5 h-5 text-gray-400 group-hover:text-green-600" />
                            </button>
                            <Link href={`/news/${article.id}`}>
                              <button className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:from-green-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                                <span>Read More</span>
                                <ArrowRight className="w-4 h-4" />
                              </button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* Enhanced No Results */}
            {filteredNews.length === 0 && (
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-8">
                  <Newspaper className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No articles found</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  We couldn't find any articles matching your search criteria. Try adjusting your filters or search terms.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => setSearchTerm('')}
                    className="px-6 py-3 bg-green-600 text-white rounded-2xl font-semibold hover:bg-green-700 transition-colors"
                  >
                    Clear Search
                  </button>
                  <button
                    onClick={() => setActiveCategory('all')}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-2xl font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Show All Articles
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Footer CTA */}
      <div className="bg-gradient-to-r from-green-900 via-green-800 to-green-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Stay Connected with LAUTECH
          </h2>
          <p className="text-xl text-green-100 max-w-3xl mx-auto mb-12">
            Get the latest medical news, research breakthroughs, and hospital updates delivered directly to your inbox.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-6 py-4 rounded-2xl border-0 text-gray-900 placeholder-gray-500 focus:ring-4 focus:ring-green-300 focus:outline-none text-lg"
            />
            <button className="bg-white text-green-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg">
              Subscribe Now
            </button>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8 mt-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-300">5,000+</div>
              <div className="text-green-200">Subscribers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-300">24</div>
              <div className="text-green-200">Articles Monthly</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-300">15K+</div>
              <div className="text-green-200">Monthly Readers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-300">98%</div>
              <div className="text-green-200">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsPage;
