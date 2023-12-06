import React, { useState } from 'react';
import { Container, TextField, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import axios from 'axios';

import { RecipeCard } from './RecipeCard';

const Home = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const currentUser = useSelector((state) => state.user.user?.username);
  const API_URL = 'https://localhost:7037/api/Recipe';

  const { data: recipes, refetch, isLoading, isError, error } = useQuery(
    ['recipes', searchValue],
    () => axios.get(searchValue ? `${API_URL}/search?query=${searchValue}` : API_URL).then(res => res.data),
    { keepPreviousData: true }

  );

  const handleSearchChange = async (e) => {
    setSearchValue(e.target.value);
    refetch();
  };
  console.log(recipes);
  return (
    <Container>
      {isLoading && <p>Loading...</p>}
      {isError && <p>Error: {error.message}</p>}
      <TextField
        label="Search for recipes"
        variant="outlined"
        value={searchValue}
        onChange={handleSearchChange}
        sx={{ mb: 2, mt: 1, width: '50%', mx: 'auto' }}
      />
      <Grid container justifyContent="normal">
        {recipes && recipes.map((recipe) => (
          <Grid item key={recipe.id} xs={12} sm={6} md={4}>
            <RecipeCard
              recipe={recipe}
              onClick={() => navigate(`/recipe/${recipe.id}`)}
              currentUser={currentUser}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}

export default Home