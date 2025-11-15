import SocialFooter from './Social';

function AuthHero() {
  return (
    <div className="hidden lg:flex flex-col items-start justify-center space-y-8 pl-4">
      <div className="w-16 h-1 bg-gradient-to-r from-cyan-500 to-transparent rounded-full" />
      <div className="space-y-2">
        <p className="text-slate-300 font-bold text-5xl">Welcome back</p>
        <h1 className="text-5xl font-bold text-white leading-tight">
          to <span className="text-cyan-400">CodeMatrix</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-sm font-light leading-relaxed">
          Master Data Structures & Algorithms with AI-powered guidance
        </p>
      </div>
      <div className="space-y-3 pt-4">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-cyan-500 rounded-full" />
          <span className="text-slate-300 text-sm font-medium">AI-powered code reviews</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-cyan-500 rounded-full" />
          <span className="text-slate-300 text-sm font-medium">Real-time problem tracking</span>
        </div>
      </div>

      <div className="pt-2">
        <SocialFooter />
      </div>
    </div>
  );
}

export default AuthHero;