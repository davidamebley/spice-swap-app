import React, { createContext } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { QueryClient, QueryClientProvider } from 'react-query';

import Home from '../components/Home';
import Login from '../components/Login';
import Register from '../components/Register';
import RecipeDetail from '../components/RecipeDetail';
import NewRecipe from '../components/NewRecipe';
import UpdateRecipe from '../components/UpdateRecipe';
import UserRecipes from '../components/UserRecipes';
import NotFound from '../components/NotFound';
import RedirectIfLoggedIn from './RedirectIfLoggedIn';
import RedirectIfLoggedOut from './RedirectIfLoggedOut';
import NavBar from '../components/NavBar';

// Create a Query client
const queryClient = new QueryClient();

export const UserContext = createContext(null);

const AppRouter = () => {
  const user = useSelector((state) => state.user.user);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <UserContext.Provider value={user}>
          <NavBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login"
              element={<RedirectIfLoggedIn> <Login /> </RedirectIfLoggedIn>} />
            <Route path="/register"
              element={<RedirectIfLoggedIn> <Register /> </RedirectIfLoggedIn>} />
            <Route path="/recipe/:id" element={<RecipeDetail />} />
            <Route path="/new"
              element={<RedirectIfLoggedOut> <NewRecipe /></RedirectIfLoggedOut>} />
            <Route path="/update/:id"
              element={<RedirectIfLoggedOut> <UpdateRecipe /> </RedirectIfLoggedOut>} />
            <Route path="/userrecipes"
              element={<RedirectIfLoggedOut><UserRecipes /></RedirectIfLoggedOut>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </UserContext.Provider>
      </Router>
    </QueryClientProvider>
  );
};

export default AppRouter;