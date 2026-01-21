/*import React, { useEffect, useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import axios from 'axios';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useSelector } from 'react-redux';

const Signup = () => {
    const [input, setInput] = useState({
        username: "",
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const { user } = useSelector(store => store.auth);
    const navigate = useNavigate();

    // Update input state
    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    // Signup handler
    const signupHandler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await axios.post(
                'http://localhost:5050/api/v1/user/register', // <-- HTTP, not HTTPS
                input,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                }
            );

            if (res.data?.success) {
                toast.success(res.data.message);
                setInput({
                    username: "",
                    email: "",
                    password: ""
                });
                navigate("/login");
            }
        } catch (error) {
            console.error(error);
            if (error.response) {
                // Backend returned an error
                toast.error(error.response.data.message || "Something went wrong!");
            } else if (error.request) {
                // No response from backend
                toast.error("Server not reachable. Please check your backend.");
            } else {
                toast.error(error.message);
            }
        } finally {
            setLoading(false);
        }
    }

    // Redirect if already logged in
    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate]);

    return (
        <div className='flex items-center w-screen h-screen justify-center'>
            <form onSubmit={signupHandler} className='shadow-lg flex flex-col gap-5 p-8 rounded-md'>
                <div className='my-4'>
                    <h1 className='text-center font-bold text-xl'>LOGO</h1>
                    <p className='text-sm text-center'>Signup to see photos & videos from your friends</p>
                </div>

                <div>
                    <span className='font-medium'>Username</span>
                    <Input
                        type="text"
                        name="username"
                        value={input.username}
                        onChange={changeEventHandler}
                        className="focus-visible:ring-transparent my-2"
                        required
                    />
                </div>

                <div>
                    <span className='font-medium'>Email</span>
                    <Input
                        type="email"
                        name="email"
                        value={input.email}
                        onChange={changeEventHandler}
                        className="focus-visible:ring-transparent my-2"
                        required
                    />
                </div>

                <div>
                    <span className='font-medium'>Password</span>
                    <Input
                        type="password"
                        name="password"
                        value={input.password}
                        onChange={changeEventHandler}
                        className="focus-visible:ring-transparent my-2"
                        required
                    />
                </div>

                {loading ? (
                    <Button disabled>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        Please wait
                    </Button>
                ) : (
                    <Button type='submit'>Signup</Button>
                )}

                <span className='text-center'>
                    Already have an account? <Link to="/login" className='text-blue-600'>Login</Link>
                </span>
            </form>
        </div>
    )
}
*/import React, { useEffect, useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import axios from 'axios';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useSelector } from 'react-redux';

const Signup = () => {
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: "",
    image: null
  });

  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useSelector(store => store.auth);
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const fileChangeHandler = (e) => {
  const file = e.target.files[0];

  if (!file) return;

  // 5MB limit (safe)
  if (file.size > 5 * 1024 * 1024) {
    toast.error("Image size must be less than 5MB");
    return;
  }

  setInput({ ...input, image: file });
  setPreview(URL.createObjectURL(file));
};


  const signupHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("username", input.username);
    formData.append("email", input.email);
    formData.append("password", input.password);
    if (input.image) formData.append("image", input.image);

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:5050/api/v1/user/register",
        formData,
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  return (
    <div className='flex items-center w-screen h-screen justify-center'>
      <form
        onSubmit={signupHandler}
        className='shadow-lg flex flex-col gap-5 p-8 rounded-md w-[350px]'
      >
        <div className='text-center'>
          <h1 className='font-bold text-xl'>LOGO</h1>
          <p className='text-sm text-gray-500'>
            Signup to see photos & videos from your friends
          </p>
        </div>

        
        <div>
          <span className='font-medium'>Username</span>
          <Input
            type="text"
            name="username"
            value={input.username}
            onChange={changeEventHandler}
            className="my-2"
            required
          />
        </div>

        <div>
          <span className='font-medium'>Email</span>
          <Input
            type="email"
            name="email"
            value={input.email}
            onChange={changeEventHandler}
            className="my-2"
            required
          />
        </div>

        <div>
          <span className='font-medium'>Password</span>
          <Input
            type="password"
            name="password"
            value={input.password}
            onChange={changeEventHandler}
            className="my-2"
            required
          />
        </div>
        {/* IMAGE */}
        <div className='flex flex-col items-center gap-2'>
          {preview && (
            <img
              src={preview}
              alt="preview"
              className="w-24 h-24 rounded-full object-cover"
            />
          )}
          <Input type="file" accept="image/*" onChange={fileChangeHandler} />
        </div>


        {loading ? (
          <Button disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please wait
          </Button>
        ) : (
          <Button type="submit">Signup</Button>
        )}

        <span className='text-center text-sm'>
          Already have an account?{" "}
          <Link to="/login" className='text-blue-600'>Login</Link>
        </span>
      </form>
    </div>
  );
};

export default Signup;

