const SocialFooter = () => {
  return (
    <div className="backdrop-blur-2xl bg-slate-900/70 border border-slate-700/50 
      rounded-2xl px-10 py-6 w-full shadow-[0_0_40px_rgba(56,189,248,0.15)] 
      hover:shadow-[0_0_50px_rgba(56,189,248,0.3)] transition-all duration-500 
      text-center mx-auto">
      
      {/* Title */}
      <p className="text-slate-400 text-2xl mb-3 tracking-wide">
        Built by <span className="text-sky-400 font-semibold"></span>
      </p>

      {/* Social Icons Row */}
      <div className="flex justify-center items-center gap-5 flex-wrap">
        
        {/* Email */}
        {/* <a
          href="mailto:himanshukakran8@gmail.com"
          title="Email"
          className="p-2 rounded-lg bg-slate-800/40 hover:bg-sky-500/20 
          border border-slate-700 hover:border-sky-500/50 transition-all 
          duration-300 transform hover:scale-110 shadow-md hover:shadow-sky-500/30 group"
        >
          <svg
            className="w-4 h-4 text-slate-300 group-hover:text-sky-400"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
          </svg>
        </a> */}

        {/* GitHub */}
        <a
          href="https://github.com/himanshu8github"
          target="_blank"
          rel="noopener noreferrer"
          title="GitHub"
          className="p-2 rounded-lg bg-slate-800/40 hover:bg-sky-500/20 
          border border-slate-700 hover:border-sky-500/50 transition-all 
          duration-300 transform hover:scale-110 shadow-md hover:shadow-sky-500/30 group"
        >
          <svg
            className="w-6 h-6 text-slate-300 group-hover:text-sky-400"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 .5C5.648.5.5 5.648.5 12c0 5.086 3.292 9.396 7.865 10.915.575.106.785-.25.785-.557v-2.16c-3.2.695-3.875-1.54-3.875-1.54-.523-1.33-1.28-1.687-1.28-1.687-1.045-.715.08-.7.08-.7 1.155.08 1.762 1.187 1.762 1.187 1.027 1.76 2.697 1.252 3.354.957.103-.744.403-1.252.732-1.54-2.553-.29-5.238-1.276-5.238-5.674 0-1.254.447-2.278 1.184-3.078-.12-.29-.513-1.452.112-3.03 0 0 .967-.31 3.17 1.174a10.97 10.97 0 0 1 2.887-.387c.98.005 1.97.132 2.887.387 2.203-1.484 3.17-1.174 3.17-1.174.625 1.578.232 2.74.113 3.03.738.8 1.184 1.824 1.184 3.078 0 4.41-2.69 5.38-5.26 5.665.414.357.785 1.057.785 2.13v3.157c0 .31.208.67.79.554C20.713 21.39 24 17.086 24 12c0-6.352-5.148-11.5-12-11.5z" />
          </svg>
        </a>

        {/* LinkedIn */}
        <a
          href="https://www.linkedin.com/in/himanshu-choudhary-1a19ba255/"
          target="_blank"
          rel="noopener noreferrer"
          title="LinkedIn"
          className="p-2 rounded-lg bg-slate-800/40 hover:bg-sky-500/20 
          border border-slate-700 hover:border-sky-500/50 transition-all 
          duration-300 transform hover:scale-110 shadow-md hover:shadow-sky-500/30 group"
        >
          <svg
            className="w-6 h-6 text-slate-300 group-hover:text-sky-400"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M19 0h-14C2.2 0 1 1.2 1 2.7v18.7C1 22.8 2.2 24 4 24h16c1.8 0 3-1.2 3-2.7V2.7C23 1.2 20.8 0 19 0zM8.3 20.5H5.1V9h3.2v11.5zM6.7 7.6c-1 0-1.8-.8-1.8-1.8S5.7 4 6.7 4 8.5 4.8 8.5 5.8 7.7 7.6 6.7 7.6zM20 20.5h-3.2v-5.9c0-1.4-.5-2.4-1.8-2.4-1 0-1.6.7-1.9 1.4-.1.2-.1.5-.1.8v6h-3.2V9h3.2v1.6c.4-.7 1.4-1.8 3.3-1.8 2.4 0 4.2 1.6 4.2 5.1v6.6z" />
          </svg>
        </a>

        {/* Twitter */}
        <a
          href="https://x.com/himanshuu_5"
          target="_blank"
          rel="noopener noreferrer"
          title="Twitter"
          className="p-2 rounded-lg bg-slate-800/40 hover:bg-sky-500/20 
          border border-slate-700 hover:border-sky-500/50 transition-all 
          duration-300 transform hover:scale-110 shadow-md hover:shadow-sky-500/30 group"
        >
          <svg
            className="w-6 h-6 text-slate-300 group-hover:text-sky-400"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M23.953 4.57c-.885.392-1.83.656-2.825.775a4.958 4.958 0 0 0 2.163-2.723 9.845 9.845 0 0 1-3.127 1.195 4.92 4.92 0 0 0-8.39 4.482A13.964 13.964 0 0 1 1.671 3.15a4.9 4.9 0 0 0-.665 2.475c0 1.708.87 3.213 2.188 4.096a4.904 4.904 0 0 1-2.228-.616v.062a4.93 4.93 0 0 0 3.946 4.827 4.996 4.996 0 0 1-2.223.084 4.937 4.937 0 0 0 4.604 3.42A9.868 9.868 0 0 1 .96 19.54a13.9 13.9 0 0 0 7.548 2.21c9.055 0 14.002-7.496 14.002-13.986 0-.213 0-.425-.015-.636A9.86 9.86 0 0 0 24 4.59z" />
          </svg>
        </a>

        {/* Portfolio (Updated with Text Label) */}
        <a
          href="https://himanshu-8.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          title="Portfolio"
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/40 
          hover:bg-sky-500/20 border border-slate-700 hover:border-sky-500/50 
          transition-all duration-300 transform hover:scale-110 shadow-md 
          hover:shadow-sky-500/30 group"
        >
          <svg
            className="w-6 h-6 text-slate-300 group-hover:text-sky-400"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M20 6h-2.18c-.263-1.289-1.402-2-2.82-2H9c-1.418 0-2.557.711-2.82 2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-8 11c-2.21 0-4-1.79-4-4 0-.34.04-.67.12-.99l-1.48-1.49A6.011 6.011 0 0 0 6 13c0 3.31 2.69 6 6 6 1.31 0 2.52-.42 3.5-1.12l-1.48-1.48c-.32.08-.65.12-.99.12zm1.88-2.12a3.99 3.99 0 0 0 .12-.99c0-2.21-1.79-4-4-4-.34 0-.67.04-.99.12l4.87 4.87z" />
          </svg>
          <span className="text-slate-300 text-sm font-medium group-hover:text-sky-400">
            Portfolio
          </span>
        </a>
      </div>
    </div>
  );
};

export default SocialFooter;
