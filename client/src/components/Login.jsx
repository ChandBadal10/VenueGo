import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { toast } from 'react-toastify';

export default function Login() {
  const { setShowLogin, axios, setToken, backendUrl } = useAppContext();
  const navigate = useNavigate();

  const [state, setState] = React.useState('login');
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const url = `${backendUrl}/api/user/${state}`;
      const { data } = await axios.post(url, { name, email, password });

      if (data?.success) {
        if (state === "register") {
          setState("login");
          setPassword("");
          toast.success("Registration successful — please log in.");
        } else {
          localStorage.setItem("token", data.token);
          localStorage.setItem("role", data.role);
          axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
          setToken(data.token);

          window.history.pushState(null, "", window.location.href);
          window.onpopstate = () => window.history.go(1);

          const role = data.user?.role || data.role;
          if (role === "admin") navigate("/admin", { replace: true });
          else navigate("/", { replace: true });

          setShowLogin(false);
          toast.success("Login successful");
        }
      } else {
        toast.error(data.message || "Operation failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      console.error('Login error:', error);
    }
  };

  return (
    <div
      onClick={() => setShowLogin(false)}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-black/50 to-black/40 p-6"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl bg-white grid grid-cols-1 md:grid-cols-2"
      >
        {/* Left artwork / brand panel */}
        <div className="relative hidden md:flex flex-col items-center justify-center gap-6 p-10 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white">
          {/* <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
            <svg width="92" height="92" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7v7c0 5 5 9 10 9s10-4 10-9V7l-10-5z" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div> */}

          <h2 className="text-2xl font-semibold">Welcome to <span className="font-extrabold">VenueGo</span></h2>
          <p className="text-center max-w-xs text-sm/relaxed">
            Secure, fast and delightful authentication. {state === 'login' ? 'Sign in to continue.' : 'Create an account to get started.'}
          </p>

          <div className="mt-2 flex gap-3 text-[13px] opacity-90">
            <div className="px-3 py-2 rounded bg-white/10">Privacy-first</div>
            <div className="px-3 py-2 rounded bg-white/10">Fast login</div>
            <div className="px-3 py-2 rounded bg-white/10">Responsive</div>
          </div>

          <div className="absolute bottom-6 left-6 opacity-30 text-xs">
            © {new Date().getFullYear()} VenueGo
          </div>
        </div>

        {/* Right: form panel */}
        <form onSubmit={onSubmitHandler} className="p-8 md:p-10 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-700">
                {state === 'login' ? 'Sign in' : 'Create account'}
              </h3>
              <p className="text-xs text-gray-400">Fast, secure access to your dashboard</p>
            </div>

            <button
              type="button"
              onClick={() => setShowLogin(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          {state === 'register' && (
            <label className="relative group">
              <span className="text-xs text-gray-500">Name</span>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                placeholder="Your full name"
                className="mt-1 w-full rounded-lg border border-gray-200 p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
                type="text"
                required
              />
            </label>
          )}

          <label className="relative group">
            <span className="text-xs text-gray-500">Email</span>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              placeholder="Your email address"
              className="mt-1 w-full rounded-lg border border-gray-200 p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
              type="email"
              required
            />
          </label>

          <label className="relative group">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Password</span>
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="text-xs text-blue-600 hover:underline"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>

            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              placeholder="••••••••"
              className="mt-1 w-full rounded-lg border border-gray-200 p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
              type={showPassword ? 'text' : 'password'}
              required
            />
          </label>

          <div className="flex items-center justify-between mt-1">
            <p
              onClick={() => {
                setShowLogin(false);
                navigate('/reset-password');
              }}
              className="text-sm text-blue-600 cursor-pointer"
            >
              Forgot password?
            </p>


          </div>

          <button
            className="mt-2 w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium hover:from-blue-700 hover:to-indigo-700 transition-all"
            type="submit"
          >
            {state === 'register' ? 'Create Account' : 'Login'}
          </button>

          <div className="mt-3 text-center text-sm text-gray-500">
            {state === 'register' ? (
              <>
                Already have account?{' '}
                <span onClick={() => setState('login')} className="text-blue-600 cursor-pointer underline">
                  click here
                </span>
              </>
            ) : (
              <>
                Create an account?{' '}
                <span onClick={() => setState('register')} className="text-blue-600 cursor-pointer underline">
                  click here
                </span>
              </>
            )}
          </div>

          <div className="mt-4 text-center text-xs text-gray-400">
            By continuing you agree to our <span className="text-blue-600">Terms</span> and <span className="text-blue-600">Privacy</span>.
          </div>
        </form>
      </div>
    </div>
  );
}
