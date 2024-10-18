import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { auth, db } from '../Firebase/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import {
  House,
  Rss,
  Newspaper,
  HeartHandshake,
  Bell,
  Search,
  CircleUser,
  Pencil,
  Menu,
  X,
  LogOut,
} from 'lucide-react';
import HoverDown from './smallComponents/HoverDown';
import CreatePost from './smallComponents/CreatePost';
import Followers from './Followers';
import { collection, getDocs, query, where } from 'firebase/firestore';

const Navbar = () => {
  const location = useLocation();
  const [hoveredLink, setHoveredLink] = useState(null);
  const [create, setCreate] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [showFollowers, setShowFollowers] = useState(false);
  const [userId, setUserId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showlist,setShowList]=useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleCreate = () => {
    setCreate(true);
    console.log(true)
  };

  const handleCloseCreate = () => {
    setCreate(false);
  };

  const handleCloseFollowers = () => {
    setShowFollowers(false);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };


  const handleShowFollowers = () => {
    setShowFollowers(!showFollowers);
  };
  const handleSearch = async (e) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);
  
    if (searchTerm.trim() !== '') {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('firstName', '==', searchTerm));
      const querySnapshot = await getDocs(q);
      const users = [];
      querySnapshot.forEach((doc) => {
        users.push({
          ...doc.data(), 
          uid: doc.id   
        });
      });
  
      setSearchResults(users);
    } else {
      setSearchResults([]); 
    }
  };
  
  const handelSelectedUser = (id) => {
    setShowList(false);
  
    navigate(`/profile/${id}`);
  }

  return (
    <nav className="w-screen bg-[#262626] fixed top-0 left-0 z-50">
      <div className="flex items-center justify-between lg:justify-evenly p-4 lg:p-4">
        <a href="/home" className="text-3xl text-[#f52936] font-semibold">
          BLOGer
        </a>

        <div className="lg:hidden">
          <button onClick={toggleMenu} aria-label="Toggle Menu">
            {menuOpen ? <X color="white" size={30} /> : <Menu color="white" size={30} />}
          </button>
        </div>

        <ul className="hidden lg:flex gap-7 h-full items-center">
          <li>
            <a
              href="/home"
              className="flex items-center px-3 py-2 rounded hover:bg-[#464748] relative"
              onMouseEnter={() => setHoveredLink('Home')}
              onMouseLeave={() => setHoveredLink(null)}
            >
              <House
                color={location.pathname === '/home' ? '#f52936' : '#ecedee'}
                height={32}
                width={32}
                className="mr-2"
              />
              {location.pathname === '/home' && (
                <hr className="absolute bottom-0 left-0 w-full bg-[#f52936] h-1" />
              )}
              {hoveredLink === 'Home' && <HoverDown name="Home" />}
            </a>
          </li>

          <li>
            <button
              className="flex items-center px-3 py-2 rounded hover:bg-[#464748] relative"
              onClick={handleShowFollowers}
              onMouseEnter={() => setHoveredLink('Following')}
              onMouseLeave={() => setHoveredLink(null)}
            >
              <Rss
                color={showFollowers ? '#f52936' : '#ecedee'}
                height={32}
                width={32}
                className="mr-2"
              />
              {showFollowers && (
                <hr className="absolute bottom-0 left-0 w-full bg-[#f52936] h-1" />
              )}
              {hoveredLink === 'Following' && <HoverDown name="Following" />}
            </button>
          </li>
          <li>
            <a
              href="/news"
              className="flex items-center px-3 py-2 rounded hover:bg-[#464748] relative"
              onMouseEnter={() => setHoveredLink('News')}
              onMouseLeave={() => setHoveredLink(null)}
            >
              <Newspaper
                color={location.pathname === '/news' ? '#f52936' : '#ecedee'}
                height={32}
                width={32}
                className="mr-2"
              />
              {location.pathname === '/news' && (
                <hr className="absolute bottom-0 left-0 w-full bg-[#f52936] h-1" />
              )}
              {hoveredLink === 'News' && <HoverDown name="News" />}
            </a>
          </li>

          <li>
            <a
              href="/health"
              className="flex items-center px-3 py-2 rounded hover:bg-[#464748] relative"
              onMouseEnter={() => setHoveredLink('Health')}
              onMouseLeave={() => setHoveredLink(null)}
            >
              <HeartHandshake
                color={location.pathname === '/health' ? '#f52936' : '#ecedee'}
                height={32}
                width={32}
                className="mr-2"
              />
              {location.pathname === '/health' && (
                <hr className="absolute bottom-0 left-0 w-full bg-[#f52936] h-1" />
              )}
              {hoveredLink === 'Health' && <HoverDown name="Health" />}
            </a>
          </li>

          <li>
            <a
              href="/notification"
              className="flex items-center px-3 py-2 rounded hover:bg-[#464748] relative"
              onMouseEnter={() => setHoveredLink('Notification')}
              onMouseLeave={() => setHoveredLink(null)}
            >
              <Bell
                color={location.pathname === '/notification' ? '#f52936' : '#ecedee'}
                height={32}
                width={32}
                className="mr-2"
              />
              {location.pathname === '/notification' && (
                <hr className="absolute bottom-0 left-0 w-full bg-[#f52936] h-1" />
              )}
              {hoveredLink === 'Notification' && <HoverDown name="Notification" />}
            </a>
          </li>
        </ul>

        <div className="hidden lg:flex items-center gap-5 relative">
          <div className="flex p-2 bg-[#181818] hover:border-[1px] hover:border-white rounded">
            <Search color="#b6b8bb" />
            <input
              type="text"
              className="w-72 bg-[#181818] ml-2 border-none outline-none text-[#b6b8bb]"
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          {showlist && searchResults.length > 0 && (
            <div className="absolute top-10 w-72 bg-black text-white rounded-md shadow-lg z-20">
              {searchResults.map((user, index) => (
                <div key={index} className="p-2 hover:bg-slate-700 flex gap-10" onClick={() => handelSelectedUser(user.uid)}>
                  <img src={user.photo} alt="" className='w-8 rounded-full' />
                  {user.firstName} {user.lastName}
                </div>
              ))}
            </div>
          )}



          <div className="relative">
            <CircleUser
              color="white"
              size={32}
              onClick={toggleUserMenu}
              className="cursor-pointer"
            />
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-20">
                <a
                  href="/profile"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                  onClick={() => setUserMenuOpen(false)}
                >
                  Profile
                </a>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          <div
            onClick={handleCreate}
            className="p-2 bg-[#f52936] w-40 gap-2 rounded-3xl flex justify-center items-center cursor-pointer"
          >
            <h2 className="text-[#ecedee] font-medium text-sm">Create Post</h2>
            <Pencil color="#ecedee" height={20} />
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="lg:hidden bg-[#262626] w-full">
          <ul className="flex flex-col items-start px-4 pt-2 pb-4 space-y-2 animate-slideDown">
            <li className="w-full">
              <a
                href="/home"
                className="flex items-center px-3 py-2 rounded hover:bg-[#464748] w-full"
                onClick={handleLinkClick}
              >
                <House
                  color={location.pathname === '/home' ? '#f52936' : '#ecedee'}
                  height={24}
                  width={24}
                  className="mr-2"
                />
                <span className="text-white">Home</span>
              </a>
            </li>
            <li className="w-full">
              <button
                className="flex items-center px-3 py-2 rounded hover:bg-[#464748] w-full"
                onClick={handleShowFollowers}
              >
                <Rss
                  color={showFollowers ? '#f52936' : '#ecedee'}
                  height={24}
                  width={24}
                  className="mr-2"
                />
                <span className="text-white">Following</span>
              </button>
            </li>
            <li className="w-full">
              <a
                href="/news"
                className="flex items-center px-3 py-2 rounded hover:bg-[#464748] w-full"
                onClick={handleLinkClick}
              >
                <Newspaper
                  color={location.pathname === '/news' ? '#f52936' : '#ecedee'}
                  height={24}
                  width={24}
                  className="mr-2"
                />
                <span className="text-white">News</span>
              </a>
            </li>
            <li className="w-full">
              <a
                href="/health"
                className="flex items-center px-3 py-2 rounded hover:bg-[#464748] w-full"
                onClick={handleLinkClick}
              >
                <HeartHandshake
                  color={location.pathname === '/health' ? '#f52936' : '#ecedee'}
                  height={24}
                  width={24}
                  className="mr-2"
                />
                <span className="text-white">Health</span>
              </a>
            </li>
            <li className="w-full">
              <a
                href="/notification"
                className="flex items-center px-3 py-2 rounded hover:bg-[#464748] w-full"
                onClick={handleLinkClick}
              >
                <Bell
                  color={location.pathname === '/notification' ? '#f52936' : '#ecedee'}
                  height={24}
                  width={24}
                  className="mr-2"
                />
                <span className="text-white">Notification</span>
              </a>
            </li>
            <li className="w-full">
              <a
                href="/profile"
                className="flex items-center px-3 py-2 rounded hover:bg-[#464748] w-full"
                onClick={handleLinkClick}
              >
                <CircleUser
                  color={location.pathname === '/profile' ? '#f52936' : '#ecedee'}
                  height={24}
                  width={24}
                  className="mr-2"
                />
                <span className="text-white">Profile</span>
              </a>
            </li>
            <li className="w-full flex items-center px-3 py-2 rounded hover:bg-[#464748]" onClick={handleLogout}>
              <LogOut
                color={location.pathname === '/profile' ? '#f52936' : '#ecedee'}
                height={24}
                width={24}
                className="mr-2"
              />
              <span className="text-white">Logout</span>
            </li>
          </ul>
        </div>
      )}

      {create && <CreatePost selected={create} onClose={handleCloseCreate} />}
      {showFollowers && <Followers userId={userId} onClose={handleCloseFollowers} />}
    </nav>
  );
};

export default Navbar;
