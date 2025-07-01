import { Course } from '../types';

// Define search result types
export interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'course' | 'resource' | 'community' | 'playground';
  url: string;
}

// Courses data
const COURSES: Course[] = [
  {
    id: 'cs-1',
    title: 'Data Structures & Algorithms',
    description: 'Master essential data structures and algorithms with practical implementations.',
    instructor: 'Dr. Sarah Johnson',
    thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea',
    duration: '12 weeks',
    level: 'Advanced',
    category: 'cs',
    rating: 4.8,
    students: 1200
  },
  {
    id: 'cs-2',
    title: 'Database Management Systems',
    description: 'Learn database design, SQL, and advanced database management techniques.',
    instructor: 'Prof. David Miller',
    thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d',
    duration: '10 weeks',
    level: 'Intermediate',
    category: 'cs',
    rating: 4.7,
    students: 980
  },
  {
    id: 'ai-1',
    title: 'Machine Learning Fundamentals',
    description: 'Master machine learning algorithms, data preprocessing, and model evaluation.',
    instructor: 'Prof. Alan Turing',
    thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c',
    duration: '12 weeks',
    level: 'Advanced',
    category: 'ai',
    rating: 4.9,
    students: 1500
  },
  {
    id: 'cs-3',
    title: 'Web Development Bootcamp',
    description: 'Build modern web applications with React, Node.js, and MongoDB.',
    instructor: 'Emily Rodriguez',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
    duration: '16 weeks',
    level: 'Beginner',
    category: 'cs',
    rating: 4.6,
    students: 2100
  },
  {
    id: 'ai-2',
    title: 'Deep Learning & Neural Networks',
    description: 'Explore advanced deep learning architectures and neural network implementations.',
    instructor: 'Dr. Yann Chen',
    thumbnail: 'https://images.unsplash.com/photo-1555255707-c07966088b7b',
    duration: '14 weeks',
    level: 'Advanced',
    category: 'ai',
    rating: 4.8,
    students: 850
  },
  {
    id: 'cs-4',
    title: 'Cloud Computing & DevOps',
    description: 'Master cloud platforms, containerization, and CI/CD pipelines.',
    instructor: 'Alex Thompson',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa',
    duration: '10 weeks',
    level: 'Intermediate',
    category: 'cs',
    rating: 4.7,
    students: 1350
  }
];

// Resources data
const RESOURCES: SearchResult[] = [
  {
    id: 'res-1',
    title: 'Algorithm Visualization Tools',
    description: 'Interactive tools for visualizing complex algorithms and data structures.',
    type: 'resource',
    url: '/resources/algorithm-visualization'
  },
  {
    id: 'res-2',
    title: 'Machine Learning Cheat Sheets',
    description: 'Comprehensive cheat sheets for machine learning concepts and algorithms.',
    type: 'resource',
    url: '/resources/ml-cheatsheets'
  },
  {
    id: 'res-3',
    title: 'Web Development Resources',
    description: 'Curated collection of tools, libraries, and frameworks for modern web development.',
    type: 'resource',
    url: '/resources/web-development'
  }
];

// Community data
const COMMUNITY: SearchResult[] = [
  {
    id: 'comm-1',
    title: 'AI Ethics Discussion Group',
    description: 'Join discussions on ethical considerations in artificial intelligence development.',
    type: 'community',
    url: '/community/ai-ethics'
  },
  {
    id: 'comm-2',
    title: 'Coding Challenge Club',
    description: 'Weekly coding challenges and collaborative problem-solving sessions.',
    type: 'community',
    url: '/community/coding-challenges'
  },
  {
    id: 'comm-3',
    title: 'Tech Career Network',
    description: 'Connect with industry professionals and get career advice in tech fields.',
    type: 'community',
    url: '/community/career-network'
  }
];

// Playground data
const PLAYGROUND: SearchResult[] = [
  {
    id: 'play-1',
    title: 'Python Playground',
    description: 'Interactive Python coding environment with real-time execution and feedback.',
    type: 'playground',
    url: '/playground/python'
  },
  {
    id: 'play-2',
    title: 'JavaScript Sandbox',
    description: 'Test and experiment with JavaScript code in a safe, browser-based environment.',
    type: 'playground',
    url: '/playground/javascript'
  },
  {
    id: 'play-3',
    title: 'Data Visualization Lab',
    description: 'Create and customize interactive data visualizations using various libraries.',
    type: 'playground',
    url: '/playground/data-viz'
  }
];

// Convert courses to search results
const courseSearchResults: SearchResult[] = COURSES.map(course => ({
  id: course.id,
  title: course.title,
  description: course.description,
  type: 'course',
  url: `/courses/${course.id}`
}));

// Combine all search results
export const ALL_SEARCH_RESULTS: SearchResult[] = [
  ...courseSearchResults,
  ...RESOURCES,
  ...COMMUNITY,
  ...PLAYGROUND
];

// Search function
export function searchContent(query: string): SearchResult[] {
  if (!query.trim()) return [];
  
  const lowerCaseQuery = query.toLowerCase();
  
  return ALL_SEARCH_RESULTS.filter(item => 
    item.title.toLowerCase().includes(lowerCaseQuery) || 
    item.description.toLowerCase().includes(lowerCaseQuery)
  );
}
