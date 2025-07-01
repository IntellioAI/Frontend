import { User, Book, Clock, Award } from 'lucide-react';

export function Profile() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="h-24 w-24 rounded-full bg-white flex items-center justify-center">
                <User className="h-12 w-12 text-indigo-600" />
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-2xl font-bold text-white">John Doe</h1>
                <p className="text-indigo-100">BTech Student</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
            <div className="bg-gray-50 rounded-lg p-4 flex items-center gap-4">
              <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Book className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">12</h3>
                <p className="text-gray-600">Courses Enrolled</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 flex items-center gap-4">
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">156 hrs</h3>
                <p className="text-gray-600">Learning Time</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 flex items-center gap-4">
              <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Award className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">8</h3>
                <p className="text-gray-600">Certificates Earned</p>
              </div>
            </div>
          </div>

          {/* Course Progress */}
          <div className="p-6 border-t">
            <h2 className="text-xl font-semibold mb-4">Current Courses</h2>
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">Data Structures & Algorithms</h3>
                  <span className="text-sm text-gray-600">75% Complete</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">Machine Learning Fundamentals</h3>
                  <span className="text-sm text-gray-600">45% Complete</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}