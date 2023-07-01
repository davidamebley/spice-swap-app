import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateRecipe } from '../redux/reducers/recipeReducer';
import { Button, TextField, Typography, Container, Box, Snackbar, Alert, CircularProgress } from '@mui/material';

const UpdateRecipe = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [steps, setSteps] = useState('');
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submissionSuccessful, setSubmissionSuccessful] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const API_URL = 'https://localhost:7037/api/Recipe';
  // const recipe = useSelector((state) => state.recipe.recipes.find(recipe => recipe.Id === parseInt(id))); // 'recipes' holds all the recipe data

  useEffect(() => {
    fetch(`${API_URL}/${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setRecipe(data);
        setTitle(data.title);
        setDescription(data.description);
        setIngredients(data.ingredients);
        setSteps(data.steps);
      })
      .catch(error => {
        console.error('There was a problem fetching your recipe: ', error);
      });
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      // Logic to send the form data to the backend
      await dispatch(updateRecipe({
        id,
        updatedRecipeData: {
          title,
          description,
          ingredients,
          steps
        }
      }));
      setSubmissionSuccessful(true);
      setOpen(true);
    } catch (error) {
      console.error('Failed to update recipe: ', error);
      setSubmissionSuccessful(false);
      setOpen(true);
    } finally {
      setIsLoading(false);
    };
  };

  // Handling the snackbar
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <Container component="main" /* maxWidth="xs" */ sx={{ width: '45%' }}>
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Update Recipe
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="title"
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            multiline
            rows={3}
            id="description"
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            multiline
            rows={5}
            id="ingredients"
            label="Ingredients"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            multiline
            rows={8}
            id="steps"
            label="Steps"
            value={steps}
            onChange={(e) => setSteps(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : "Update Recipe"}
          </Button>
        </Box>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity={submissionSuccessful ? "success" : "error"} sx={{ width: '100%' }}>
            {submissionSuccessful ? 'Recipe updated successfully!' : 'Failed to update recipe.'}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default UpdateRecipe