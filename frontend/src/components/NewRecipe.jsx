import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { createRecipe } from '../redux/reducers/recipeReducer';
import { useSelector } from 'react-redux';
import { Button, TextField, Typography, Container, Box, Snackbar, Alert, CircularProgress } from '@mui/material';

const NewRecipe = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [steps, setSteps] = useState('');
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submissionSuccessful, setSubmissionSuccessful] = useState(false);
  const [newRecipeId, setNewRecipeId] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUserID = useSelector((state) => state.user.user?.id);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setIngredients('');
    setSteps('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      // Logic to send the form data to the backend
      const action = await dispatch(createRecipe({
        title,
        description,
        ingredients,
        steps,
        userId: currentUserID
      }));
      // navigate(`/recipe/${action.payload.id}`, { replace: true });
      setNewRecipeId(action.payload.id); // Save the new recipe id
      setSubmissionSuccessful(true);
      setOpen(true);
      resetForm();
    } catch (error) {
      console.error('Failed to create new recipe: ', error);
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
          New Recipe
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit}
          sx={{ mt: 1 }}>
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
            {isLoading ? <CircularProgress size={24} /> : "Create Recipe"}
          </Button>
        </Box>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity={submissionSuccessful ? "success" : "error"} sx={{ width: '100%' }}
            action={
              submissionSuccessful && (
                <Button color="inherit" size="small" onClick={() => navigate(`/recipe/${newRecipeId}`)}>
                  VIEW NEW RECIPE
                </Button>
              )
            }
          >
            {submissionSuccessful ? 'Recipe created successfully!' : 'Failed to create recipe.'}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default NewRecipe;
