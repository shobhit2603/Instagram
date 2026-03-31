import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import useGoogleAuth from '../hooks/useGoogleAuth';
import handleSubmit from '../../../utils/handleForm';

const Login = () => {

  const {handleLogin} = useAuth();
  const {handleGoogleAuth} = useGoogleAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4 selection:bg-purple-500/30">
      <div className="flex flex-col md:flex-row bg-neutral-900 rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden max-w-4xl w-full border border-neutral-800">
        
        {/* Left Side: Branding / Visual (Hidden on Mobile) */}
        <div className="md:w-1/2 p-10 lg:p-12 bg-neutral-950/50 text-white flex-col justify-between relative overflow-hidden hidden md:flex border-r border-neutral-800">
          {/* Decorative glowing blobs */}
          <div className="absolute top-[-20%] right-[-10%] w-72 h-72 rounded-full bg-indigo-500 opacity-20 blur-3xl"></div>
          <div className="absolute bottom-[-10%] left-[-20%] w-80 h-80 rounded-full bg-pink-500 opacity-20 blur-3xl"></div>

          <div className="z-10">
            <h1 className="text-4xl lg:text-5xl tracking-tight mb-2">Instagram</h1>
            <p className="text-neutral-400 text-lg font-medium">Welcome back.</p>
          </div>
          
          <div className="z-10 mt-auto">
            <h2 className="text-3xl lg:text-4xl mb-4 leading-tight">Log in to keep <br /> exploring.</h2>
            <p className="text-neutral-400 font-medium text-lg">Pick up right where you left off.</p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="md:w-1/2 p-8 lg:p-12 flex flex-col justify-center bg-neutral-900 relative">
          <div className="max-w-md mx-auto w-full">
            {/* Mobile Header (Hidden on Desktop) */}
            <div className="md:hidden text-center mb-8">
              <h1 className="text-4xl font-medium text-white mb-2">
                Instagram
              </h1>
              <p className="text-neutral-400 text-sm">Log in to see photos and videos from your friends.</p>
            </div>

            <h3 className="text-2xl text-white mb-6 hidden md:block">Welcome back</h3>
            
            <form onSubmit={(e) => handleSubmit(e, async (obj) => {
              try {
                await handleLogin(obj);
                navigate("/");
              } catch (error) {
                console.error("Login failed:", error);
              }
            })} className="space-y-4">
              
              {/* Email Input */}
              <div className="relative">
                <input 
                  type="text" 
                  name="usernameOrEmail"
                  id="usernameOrEmail"
                  placeholder="Username or Email"
                  className="peer w-full px-4 pt-6 pb-2 border-2 border-neutral-800 rounded-xl bg-neutral-950 text-white focus:outline-none focus:border-purple-500 focus:bg-neutral-900 transition-all placeholder-transparent"
                  required
                />
                <label 
                  htmlFor="usernameOrEmail" 
                  className="absolute left-4 top-2 text-xs font-semibold text-neutral-500 transition-all pointer-events-none peer-placeholder-shown:text-sm peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:font-normal peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:font-semibold peer-focus:text-purple-400"
                >
                  Username or Email
                </label>
              </div>

              {/* Password Input */}
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password"
                  id="password"
                  placeholder="Password"
                  className="peer w-full px-4 pt-6 pb-2 pr-14 border-2 border-neutral-800 rounded-xl bg-neutral-950 text-white focus:outline-none focus:border-purple-500 focus:bg-neutral-900 transition-all placeholder-transparent"
                  required
                />
                <label 
                  htmlFor="password" 
                  className="absolute left-4 top-2 text-xs font-semibold text-neutral-500 transition-all pointer-events-none peer-placeholder-shown:text-sm peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:font-normal peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:font-semibold peer-focus:text-purple-400"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white focus:outline-none text-sm font-medium transition-colors cursor-pointer"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>

              {/* Forgot Password Link */}
              <div className="text-right mt-2 pb-2">
                 <a href="#" className="text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors">Forgot password?</a>
              </div>

              <div className="pt-2">
                <button 
                  type="submit"
                  className="w-full bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-400 hover:via-purple-400 hover:to-pink-400 text-white font-medium py-3.5 px-4 rounded-xl shadow-[0_8px_20px_-6px_rgba(168,85,247,0.4)] transform transition-all active:scale-[0.98] cursor-pointer"
                >
                  Log In
                </button>
              </div>

              <div className="flex items-center my-2 before:flex-1 before:border-t before:border-neutral-800 before:mt-0.5 after:flex-1 after:border-t after:border-neutral-800 after:mt-0.5">
                <p className="text-center text-xs font-semibold text-neutral-500 mx-4 mb-0">OR</p>
              </div>

              <button 
                type="button"
                onClick={handleGoogleAuth}
                className="w-full flex items-center justify-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white font-medium py-3 px-4 rounded-xl transition-colors outline-none cursor-pointer border border-neutral-700 hover:border-neutral-600"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Log in with Google
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-neutral-800 text-center">
              <p className="text-neutral-400 text-sm font-medium">
                Don't have an account?{' '}
                <Link to="/register" className="font-medium text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-pink-400 hover:opacity-80 transition-opacity">
                  Sign up
                </Link>
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;