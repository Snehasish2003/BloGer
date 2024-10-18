import { Route, Routes } from "react-router-dom";
import LoginSignUp from "./components/LoginSignup/loginnsignup";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import UserProfilePage from "./pages/UserProfilePage";
import FollowerPage from "./pages/FollowerPage";
import HealthPage from "./pages/HealthPage";
import NewsPage from "./pages/NewsPage";
import NotificationPage from "./pages/NotificationPage";

const App = () => {
  return (
    <Routes>
        <Route path="/" element={<LoginSignUp />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/:userId" element={<UserProfilePage />} />
        <Route path="/notification" element={<NotificationPage />} />
        <Route path="/following" element={<FollowerPage />} />
        <Route path="/health" element={<HealthPage />} />
        <Route path="/news" element={<NewsPage />} />
    </Routes>
  );
}

export default App;
