const SocialFooter = () => {
  return (
    <div className="mt-6 pt-4 border-t border-slate-800/50 ">
      <p className="text-center text-slate-500 text-xs mb-3">
        Built by Himanshu
      </p>

      <div className="flex justify-center items-center gap-2">
        {/* Email */}
        <a
          href="mailto:himanshukakran8@gmail.com"
          title="Email"
          className="p-1.5 rounded-lg bg-slate-900/50 hover:bg-sky-500/20 
          border border-slate-800 hover:border-sky-500/50 transition-all 
          duration-300 transform hover:scale-110 group"
        >
          <svg className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
          </svg>
        </a>

        {/* GitHub */}
        <a
          href="https://github.com/himanshu8github"
          target="_blank"
          rel="noopener noreferrer"
          title="GitHub"
          className="p-1.5 rounded-lg bg-slate-900/50 hover:bg-sky-500/20 
          border border-slate-800 hover:border-sky-500/50 transition-all 
          duration-300 transform hover:scale-110 group"
        >
          <svg className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387..." />
          </svg>
        </a>

        {/* LinkedIn */}
        <a
          href="https://www.linkedin.com/in/himanshu-choudhary-1a19ba255/"
          target="_blank"
          rel="noopener noreferrer"
          title="LinkedIn"
          className="p-1.5 rounded-lg bg-slate-900/50 hover:bg-sky-500/20 
          border border-slate-800 hover:border-sky-500/50 transition-all 
          duration-300 transform hover:scale-110 group"
        >
          <svg className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328..." />
          </svg>
        </a>

        {/* Twitter */}
        <a
          href="https://x.com/himanshuu_5"
          target="_blank"
          rel="noopener noreferrer"
          title="Twitter"
          className="p-1.5 rounded-lg bg-slate-900/50 hover:bg-sky-500/20 
          border border-slate-800 hover:border-sky-500/50 transition-all 
          duration-300 transform hover:scale-110 group"
        >
          <svg className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.953 4.57a10 10 0 00..." />
          </svg>
        </a>

        {/* Portfolio */}
        <a
          href="https://himanshu-8.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          title="Portfolio"
          className="p-1.5 rounded-lg bg-slate-900/50 hover:bg-sky-500/20 
          border border-slate-800 hover:border-sky-500/50 transition-all 
          duration-300 transform hover:scale-110 group"
        >
          <svg className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 6h-2.18c-.263-1.289..." />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default SocialFooter;
