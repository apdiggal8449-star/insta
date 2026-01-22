import React, { useState } from 'react';
import axios from 'axios';
import { Input } from './ui/input';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  const searchHandler = async (e) => {
    e.preventDefault();
    if (!query) return;

    try {
      const res = await axios.get(`https://insta-2-d9wn.onrender.com/api/v1/user/search?query=${query}`, {
        withCredentials: true
      });
      if (res.data.success) {
        setResults(res.data.users);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Search failed");
    }
  };

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-xl font-bold mb-4">Search Users</h1>

      <form onSubmit={searchHandler} className="flex gap-2 mb-6 w-full max-w-md">
        <Input
          type="text"
          placeholder="Search by username or email..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Search
        </button>
      </form>

      <div className="flex flex-col w-full max-w-md gap-3">
        {results.length === 0 && <p>No users found</p>}
        {results.map((user) => (
          <div
            key={user._id}
            className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded cursor-pointer"
            onClick={() => navigate(`/profile/${user._id}`)}
          >
            <Avatar>
              <AvatarImage src={user.profilePicture} />
              <AvatarFallback>{user.username[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-bold">{user.username}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Search;
