import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from '../components/Home';
import Login from '../components/Login';
import Register from '../components/Register';
import RecipeDetail from '../components/RecipeDetail';
import NewRecipe from '../components/NewRecipe';
import UpdateRecipe from '../components/UpdateRecipe';
import UserRecipes from '../components/UserRecipes';

const AppRouter = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/recipe/:id" component={RecipeDetail} />
        <Route path="/new" component={NewRecipe} />
        <Route path="/update/:id" component={UpdateRecipe} />
        <Route path="/userrecipes" component={UserRecipes} />
      </Switch>
    </Router>
  );
};

export default AppRouter;