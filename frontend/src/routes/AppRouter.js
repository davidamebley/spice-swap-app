import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../components/Home';
import Login from '../components/Login';
import Register from '../components/Register';
import RecipeDetail from '../components/RecipeDetail';
import NewRecipe from '../components/NewRecipe';
import UpdateRecipe from '../components/UpdateRecipe';
import UserRecipes from '../components/UserRecipes';
import NotFound from '../components/NotFound';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={Login} />
        <Route path="/register" element={<Register />} />
        <Route path="/recipe/:id" element={<RecipeDetail />} />
        <Route path="/new" element={<NewRecipe />} />
        <Route path="/update/:id" element={<UpdateRecipe />} />
        <Route path="/userrecipes" element={<UserRecipes />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;