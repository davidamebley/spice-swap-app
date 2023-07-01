import React, { useState } from 'react';
import { Container, TextField, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import axios from 'axios';

import { RecipeCard } from './RecipeCard';

const UserRecipes = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const currentUser = useSelector((state) => state.user.user?.username);
  const currentUserID = useSelector((state) => state.user.user?.id);
  const API_URL = 'https://localhost:7037/api/Recipe';

  const defaultRecipesQuery = useQuery(
    ['userRecipes', currentUserID],
    () => axios.get(`${API_URL}/user/${currentUserID}`).then(res => res.data),
    { enabled: Boolean(currentUserID) }
  );

  const searchRecipesQuery = useQuery(
    ['userRecipesSearch', currentUserID, searchValue],
    () => axios.get(`${API_URL}/user/${currentUserID}/search?query=${searchValue}`).then(res => res.data),
    { enabled: Boolean(currentUserID && searchValue) }
  );

  const { data: recipes, isError, error } = searchValue ? searchRecipesQuery : defaultRecipesQuery;

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  if (isError) {
    return <Typography variant="h6" color="error">Error: {error.message}</Typography>;
  }

  return (
    <Container>
      <TextField
        label="Search for recipes"
        variant="outlined"
        value={searchValue}
        onChange={handleSearchChange}
        sx={{ mb: 2, mt: 1, width: '50%', mx: 'auto' }}
      />
      <Grid container justifyContent="normal">
        {recipes && recipes.length > 0 ? (
          recipes.map((recipe) => (
            <Grid item key={recipe.id} xs={12} sm={6} md={4}>
              <RecipeCard
                recipe={recipe}
                onClick={() => navigate(`/recipe/${recipe.id}`)}
                currentUser={currentUser}
              />
            </Grid>
          ))
        ) : (
          <Typography variant="h6">No recipes found</Typography>
        )}
      </Grid>
    </Container>
  );
};

export default UserRecipes;
