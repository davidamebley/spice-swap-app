import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Card, CardContent, Box, CircularProgress, Alert, List, ListItem, ListItemText, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

import { deleteRecipe } from '../redux/reducers/recipeReducer';
import '../styles/recipeDetail.css';
import theme from '../styles/theme';

const RecipeDetail = () => {
  const { id } = useParams(); // Extracting the recipe id from the URL
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.user?.username);
  const { enqueueSnackbar } = useSnackbar();

  const API_URL = 'https://localhost:7037/api/Recipe';

  // const createdBy = recipe.username === currentUser ? 'You' : recipe.username;

  useEffect(() => {
    fetch(`${API_URL}/${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Couldn't fetch the recipe with id ${id}`);
        }
        return response.json();
      })
      .then(data => {
        setRecipe(data);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleUpdate = () => {
    navigate(`/update/${id}`);
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteRecipe(id));
      enqueueSnackbar('Recipe successfully deleted', { variant: 'success' });
      navigate('/userrecipes');
    } catch (error) {
      enqueueSnackbar(`Error deleting recipe: ${error.message}`, { variant: 'error' });
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!recipe) return 'No recipe found.';

  const ingredientsArray = recipe.ingredients.split('\n');
  const stepsArray = recipe.steps.split('\n');


  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh" // to take the full height of the screen
      bgcolor={theme.colors.background}
    >
      <Card sx={{
        maxWidth: '60%',
        width: '100%',
        m: 2,
        borderRadius: theme.cardBorderRadius,
        boxShadow: theme.cardBoxShadow,   // Soft shadow
      }}>

        {/* Featured image */}
        <img src={recipe.thumbnailUrl} alt={recipe.title} className='recipe-image' />

        <CardContent>
          <Typography gutterBottom variant="h4" component="div" sx={{ font: 'bold' }}>
            {recipe.title}
          </Typography>

          <Box mt={2} display="flex" justifyContent="space-between">
            <Typography variant="body1" color="text.secondary" sx={{ fontStyle: 'italic' }}>
              📅 Prep Time: {recipe.prepTime || "-"} | Cook Time: {recipe.cookTime || "-"} | Servings: {recipe.servings || "-"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Made by &bull; {recipe.username === currentUser ? 'You' : recipe.username}
            </Typography>
          </Box>

          <Typography variant="h6" color="text.secondary" mt={4}>
            Description:
          </Typography>
          <Typography variant="body1" color="text.secondary" mt={2}>
            {recipe.description}
          </Typography>

          {/* Ingredients */}
          <Box mt={4} bgcolor={theme.colors.sectionBg} p={2} borderRadius={theme.sectionBorderRadius}>
            <Typography variant="h6" color="text.secondary">
              Ingredients:
            </Typography>
            <List>
              {ingredientsArray.map((ingredient, index) => (
                <ListItem key={index}>
                  <ListItemText primary={ingredient} />
                </ListItem>
              ))}
            </List>
          </Box>

          {/* Steps */}
          <Box mt={4} bgcolor={theme.colors.sectionBg} p={2} borderRadius={theme.sectionBorderRadius}>
            <Typography variant="h6" color="text.secondary">
              Steps:
            </Typography>
            <List>
              {stepsArray.map((step, index) => (
                <ListItem key={index}>
                  <ListItemText primary={step} />
                </ListItem>
              ))}
            </List>
          </Box>
        </CardContent>

        {/* Button actions */}
        {recipe.username === currentUser && (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-evenly', p: 2, background: theme.colors.sectionBg, borderRadius: '0 0 15px 15px' }}>
              <Button variant="contained" color="primary" onClick={handleUpdate}>
                Update Recipe
              </Button>
              <Button variant="contained" color="error" onClick={handleClickOpen}>
                Delete Recipe
              </Button>
            </Box>

            <Dialog
              open={open}
              onClose={handleClose}
            >
              <DialogTitle>
                {"Are you sure you want to delete this recipe?"}
              </DialogTitle>
              <DialogContent>
                <DialogContentText>
                  This action cannot be undone.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  Cancel
                </Button>
                <Button onClick={handleDelete} color="secondary">
                  Delete
                </Button>
              </DialogActions>
            </Dialog>
          </>
        )}
      </Card>
    </Box>
  );
};

export default RecipeDetail