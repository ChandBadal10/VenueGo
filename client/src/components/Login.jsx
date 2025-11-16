import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { toast } from 'react-toastify';

const Login = () => {
  const { setShowLogin, axios, setToken, backendUrl } = useAppContext();
  const navigate = useNavigate();

  const [state, setState] = React.useState('login'); // "login" or "register"
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      // Use backendUrl to make sure requests hit backend server
      const url = `${backendUrl}/api/user/${state}`;
      const { data } = await axios.post(url, { name, email, password });

      if (data.success) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setShowLogin(false);
        toast.success(`${state === 'login' ? 'Login' : 'Register'} successful`);
        navigate('/');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      // Axios errors often have response.data
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div
      onClick={() => setShowLogin(false)}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 text-sm text-gray-600"
    >
      <form
        onSubmit={onSubmitHandler}
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] text-gray-500 rounded-lg shadow-xl border border-gray-200 bg-white"
      >
        <p className="text-2xl font-medium m-auto">
          <span className="text-blue-600">User</span>{' '}
          {state === 'login' ? 'Login' : 'Sign Up'}
        </p>

        {state === 'register' && (
          <div className="w-full">
            <p>Name</p>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              placeholder="Enter your name"
              className="border border-gray-200 rounded w-full p-2 mt-1 outline-blue-600"
              type="text"
              required
            />
          </div>
        )}

        <div className="w-full ">
          <p>Email</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="Enter your email"
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-blue-600"
            type="email"
            required
          />
        </div>

        <div className="w-full ">
          <p>Password</p>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            placeholder="Password"
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-blue-600"
            type="password"
            required
          />
        </div>

        <p
          onClick={() => {
            setShowLogin(false);
            navigate('/reset-password');
          }}
          className="mb-4 text-blue-600 cursor-pointer"
        >
          Forgot password?
        </p>

        <button className="bg-blue-600 hover:bg-blue-700 transition-all text-white w-full py-2 rounded-md cursor-pointer">
          {state === 'register' ? 'Create Account' : 'Login'}
        </button>

        {state === 'register' ? (
          <p>
            Already have account?{' '}
            <span
              onClick={() => setState('login')}
              className="text-blue-600 cursor-pointer"
            >
              click here
            </span>
          </p>
        ) : (
          <p>
            Create an account?{' '}
            <span
              onClick={() => setState('register')}
              className="text-blue-600 cursor-pointer"
            >
              click here
            </span>
          </p>
        )}
      </form>
    </div>
  );
};

export default Login;
