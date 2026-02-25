import React, { useState } from 'react';
import { signInWithEmail } from '../services/supabaseService';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: authError } = await signInWithEmail(email, password);
      
      if (authError) {
        if (authError.message === 'Invalid login credentials') {
          throw new Error('Incorrect email or password.');
        }
        throw authError;
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans">

      {/* ═══════════ LEFT SIDE — 60% — Background Image ═══════════ */}
      <div
        className="hidden lg:flex w-[60%] relative items-center justify-center"
        style={{
          backgroundImage: 'url(/login-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Frosted glass card with definition */}
        <div className="relative z-10 bg-white/60 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl px-10 py-9 max-w-md">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-4">
            CLARION
            <span className="ml-2 text-base font-normal text-slate-500 tracking-normal">/ˈkler.i.ən/</span>
          </h2>
          <div className="space-y-3">
            <p className="text-sm text-slate-700 leading-relaxed">
              <span className="font-semibold text-slate-500 italic">(1) noun</span>
              <span className="mx-1.5 text-slate-300">—</span>
              a medieval trumpet used to signal troops on the battlefield
            </p>
            <p className="text-sm text-slate-700 leading-relaxed">
              <span className="font-semibold text-slate-500 italic">(2)</span>
              <span className="mx-1.5 text-slate-300">—</span>
              Automated market intelligence for early-lead signals
            </p>
          </div>
        </div>
      </div>

      {/* ═══════════ RIGHT SIDE — 40% — Login Form ═══════════ */}
      <div className="w-full lg:w-[40%] flex flex-col items-center justify-center bg-white px-6 py-12 relative">

        {/* Logo Section */}
        <div className="flex flex-col items-center mb-8">
          <img
            src="/logo-icon.png"
            alt="Clarion Icon"
            className="h-16 w-auto mb-4"
          />
          <img
            src="/logo-text.png"
            alt="Clarion"
            className="h-7 w-auto"
          />
        </div>

        {/* Subtitle */}
        <p className="text-sm text-gray-400 mb-8">Enter your credentials to get access</p>

        {/* Form */}
        <form onSubmit={handleLogin} className="w-full max-w-[340px] space-y-5">
          
          {/* Email Field */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Email
            </label>
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 
                         focus:bg-white focus:ring-2 focus:ring-violet-400/40 focus:border-violet-300 
                         outline-none transition-all text-gray-900 placeholder-gray-400 
                         hover:border-gray-300"
              placeholder="user@company.com"
            />
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label htmlFor="password" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Password
            </label>
            <div className="relative group">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 
                           focus:bg-white focus:ring-2 focus:ring-violet-400/40 focus:border-violet-300 
                           outline-none transition-all text-gray-900 placeholder-gray-400 
                           hover:border-gray-300 pr-11"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none p-1"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 text-red-600 text-sm py-3 px-4 rounded-xl flex items-start gap-2 border border-red-100">
              <svg className="h-5 w-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-black text-white font-bold py-3.5 px-4 rounded-xl 
                       transition-all shadow-sm hover:shadow-lg hover:-translate-y-0.5 
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 
                       disabled:shadow-none flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </>
            )}
          </button>
        </form>

        {/* Mobile-only: show definition below form */}
        <div className="lg:hidden mt-10 text-center px-4">
          <p className="text-xs text-gray-400 leading-relaxed">
            <span className="font-semibold">CLARION</span> /ˈkler.i.ən/ — (1) a medieval trumpet used to signal troops on the battlefield (2) Automated market intelligence for early-lead signals
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
```

Paste this into your `Login.tsx`, save, then run the git commands in terminal:
```
git add .
git commit -m "Redesign login page"
git push