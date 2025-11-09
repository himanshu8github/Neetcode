import React, { useState } from 'react';
import { Plus, Edit, Trash2, Home, Code2, ArrowRight } from 'lucide-react';
import { NavLink } from 'react-router';

function Admin() {
  const [selectedOption, setSelectedOption] = useState(null);

  const adminOptions = [
    {
      id: 'create',
      title: 'Create Problem',
      description: 'Add new coding problems to the platform',
      icon: Plus,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-500/10 border-green-500/30',
      route: '/admin/create'
    },
    {
      id: 'update',
      title: 'Update Problem',
      description: 'Edit existing problems and details',
      icon: Edit,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500/10 border-blue-500/30',
      route: '/admin/update'
    },
    {
      id: 'delete',
      title: 'Delete Problem',
      description: 'Remove problems from platform',
      icon: Trash2,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-500/10 border-red-500/30',
      route: '/admin/delete'
    }
  ];

  const getColorText = (id) => {
    const colors = {
      create: 'text-green-400',
      update: 'text-blue-400',
      delete: 'text-red-400'
    };
    return colors[id] || 'text-sky-400';
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Navbar */}
      <nav className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
        <div className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-2 hover:opacity-80 transition group">
            <Home className="w-5 h-5 text-slate-400 group-hover:text-sky-400 transition" />
            <span className="text-slate-400 group-hover:text-sky-400 transition font-medium">Home</span>
          </NavLink>
          
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-sky-500 to-sky-600 p-2 rounded">
              <Code2 className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold">Code<span className="text-sky-500">Matrix</span> Admin</span>
          </div>

          <div className="text-slate-400 text-sm">Admin Panel</div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center container mx-auto px-4 md:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-sky-400 to-sky-600 bg-clip-text text-transparent mb-2">
            Admin Panel
          </h1>
          <p className="text-slate-400 text-sm">
            Manage and maintain coding problems on CodeMatrix platform
          </p>
        </div>

        {/* Admin Options Grid - 3 columns centered */}
        <div className="flex justify-center mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl">
            {adminOptions.map((option, idx) => {
              const IconComponent = option.icon;
              return (
                <NavLink
                  key={option.id}
                  to={option.route}
                  className="group"
                >
                  <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 h-full hover:border-slate-700 hover:bg-slate-900/80 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-sky-500/10 cursor-pointer">
                    {/* Icon Container */}
                    <div className={`${option.bgColor} border rounded-lg p-3 mb-3 inline-block w-full flex justify-center group-hover:scale-110 transition-transform`}>
                      <IconComponent size={24} className={getColorText(option.id)} />
                    </div>
                    
                    {/* Title */}
                    <h2 className="text-base font-bold text-white mb-1 group-hover:text-sky-400 transition-colors">
                      {option.title}
                    </h2>
                    
                    {/* Description */}
                    <p className="text-slate-400 text-xs mb-3 leading-relaxed">
                      {option.description}
                    </p>
                    
                    {/* Arrow Indicator */}
                    <div className="flex items-center gap-2 text-sky-400 opacity-0 group-hover:opacity-100 transition-opacity text-xs">
                      <span className="font-medium">Access</span>
                      <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* Stats Section - Smaller and always visible */}
        <div className="flex justify-center">
          <div className="grid grid-cols-3 gap-3 w-full max-w-2xl">
            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-sky-400 mb-1">3</div>
              <p className="text-slate-400 text-xs">Management Options</p>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">✓</div>
              <p className="text-slate-400 text-xs">Full Control Access</p>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-purple-400 mb-1">⚡</div>
              <p className="text-slate-400 text-xs">Real-time Updates</p>
            </div>
          </div>
        </div>
      </div>

      {/* Styles */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}

export default Admin;