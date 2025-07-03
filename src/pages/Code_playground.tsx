import { Navbar } from '../components/Navbar';
import CodePlayground from '../components/Code_playground/CodePlayground';

export function Playground() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Interactive Code Playground</h1>
          <p className="text-gray-600 mb-8">
            Write, edit, and run HTML, CSS, and JavaScript code in real-time. Perfect for experimenting with web technologies and testing your ideas.
          </p>
          
          <CodePlayground />
        </div>
      </div>
    </div>
  );
}