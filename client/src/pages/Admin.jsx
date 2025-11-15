import React, { useState } from 'react';
import { Plus, Edit, Trash2, Home, Code2, ArrowRight } from 'lucide-react';
import { NavLink } from 'react-router-dom';

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
    <div className="min-h-screen bg-black text-white flex flex-col relative">
      {/* Decorative background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 opacity-100 bg-[radial-gradient(ellipse_at_top_left,rgba(56,189,248,0.14),transparent_45%),radial-gradient(ellipse_at_bottom_right,rgba(217,70,239,0.12),transparent_45%)]" />
      </div>

      {/* Navbar */}
      <nav className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
        <div className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-2 hover:opacity-90 transition group">
            <Home className="w-5 h-5 text-slate-400 group-hover:text-sky-400 transition" />
            <span className="text-slate-400 group-hover:text-sky-400 transition font-medium">Home</span>
          </NavLink>

          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-sky-500 to-sky-600 p-2 rounded-lg shadow-sm shadow-sky-500/10">
              <Code2 className="w-4 h-4" />
            </div>
            <span className="text-xl font-bold">
              Code<span className="text-sky-500">Matrix</span> Admin
            </span>
          </div>

      
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 container mx-auto px-4 md:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
        
          <p className="text-slate-400 text-sm md:text-base">
            Manage and maintain coding problems on CodeMatrix platform
          </p>
        </div>

        {/* Admin Options Grid */}
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {adminOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <NavLink key={option.id} to={option.route} className="group block focus:outline-none">
                  {/* Gradient ring wrapper */}
                  <div className={`rounded-2xl p-[1px] bg-gradient-to-br ${option.color} via-transparent to-transparent transition-colors`}>
                    <div className="h-full rounded-2xl bg-slate-900/60 border border-slate-800 p-4 md:p-5 backdrop-blur-sm hover:bg-slate-900/70 hover:border-slate-700 transition-colors duration-200">
                      {/* Icon row */}
                      <div className={`${option.bgColor} border rounded-xl p-3 mb-3 inline-flex w-full justify-center items-center`}>
                        <IconComponent size={24} className={`${getColorText(option.id)}`} />
                      </div>

                      {/* Title */}
                      <h2 className="text-base md:text-lg font-bold text-white mb-1 group-hover:text-sky-300 transition-colors">
                        {option.title}
                      </h2>

                      {/* Description */}
                      <p className="text-slate-400 text-xs md:text-sm mb-3 leading-relaxed">
                        {option.description}
                      </p>

                      {/* CTA row */}
                      <div className="flex items-center gap-2 text-sky-400/90 opacity-100 md:opacity-80 group-hover:opacity-100 transition-opacity text-xs md:text-sm">
                        <span className="font-medium">Open</span>
                        <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </div>
                  </div>
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-10 mx-auto max-w-5xl">
          <div className="grid grid-cols-3 gap-3 md:gap-4">
            <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-3 md:p-4 text-center">
              <div className="text-xl md:text-2xl font-bold bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent mb-1">
                3
              </div>
              <p className="text-slate-400 text-xs md:text-sm">Management Options</p>
            </div>
            <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-3 md:p-4 text-center">
              <div className="text-xl md:text-2xl font-bold text-green-400 mb-1">✓</div>
              <p className="text-slate-400 text-xs md:text-sm">Full Control Access</p>
            </div>
            <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-3 md:p-4 text-center">
              <div className="text-xl md:text-2xl font-bold text-purple-400 mb-1">⚡</div>
              <p className="text-slate-400 text-xs md:text-sm">Real-time Updates</p>
            </div>
          </div>
        </div>
      </div>

      {/* Styles */}
      <style>{`
        /* Low-motion polish */
        .group:hover .card-shadow { box-shadow: 0 10px 30px rgba(14,165,233,0.08); }
      `}</style>
    </div>
  );
}

export default Admin;