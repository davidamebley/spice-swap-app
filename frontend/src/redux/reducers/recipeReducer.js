import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'https://localhost:7037/api/Recipe';

// Initial state
const initialState = {
    recipes: [],
    status: 'idle',
    error: null
};

// Async action
export const fetchRecipes = createAsyncThunk(
    'recipes/fetchRecipes',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}`);
            return response.data;
        } catch (err) {
            if (err.response) {
                // If the error was due to server-side issue
                return rejectWithValue(err.response.data);
            } else if (err.request) {
                // The request was made but no response was received
                return rejectWithValue('Request made, no response received');
            } else {
                // Something happened in setting up the request that triggered an Error
                return rejectWithValue('Error occurred in request setup');
            }
        }
    }
);

export const fetchSingleRecipe = createAsyncThunk(
    'recipes/fetchSingleRecipe',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/${id}`);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const createRecipe = createAsyncThunk(
    'recipes/createRecipe',
    async (recipeData, { rejectWithValue }) => {
        // Token is stored in local storage
        const token = localStorage.getItem('token');
        try {
            const response = await axios.post(`${API_URL}`, recipeData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const updateRecipe = createAsyncThunk(
    'recipes/updateRecipe',
    async ({ id, updatedRecipeData }, { rejectWithValue }) => {
        // Token is stored in local storage
        const token = localStorage.getItem('token');
        try {
            const response = await axios.put(`${API_URL}/${id}`, updatedRecipeData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const fetchUserRecipes = createAsyncThunk(
    'recipes/fetchUserRecipes',
    async (userId, { rejectWithValue }) => {
        // Token is stored in local storage
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get(`${API_URL}/user/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const deleteRecipe = createAsyncThunk(
    'recipes/deleteRecipe',
    async (recipeId, { rejectWithValue }) => {
        // Token is stored in local storage
        const token = localStorage.getItem('token');
        try {
            const response = await axios.delete(`${API_URL}/${recipeId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);


const recipeSlice = createSlice({
    name: 'recipe',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchRecipes.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchRecipes.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.recipes = action.payload;
            })
            .addCase(fetchRecipes.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })

            .addCase(fetchSingleRecipe.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchSingleRecipe.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.recipes = state.recipes.map(recipe =>
                    recipe.Id === action.payload.Id ? action.payload : recipe
                );
            })
            .addCase(fetchSingleRecipe.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })

            .addCase(fetchUserRecipes.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchUserRecipes.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.recipes = action.payload;
            })
            .addCase(fetchUserRecipes.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })

            .addCase(createRecipe.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createRecipe.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.recipes.push(action.payload); // Add new recipe to the list
            })
            .addCase(createRecipe.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })

            .addCase(updateRecipe.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateRecipe.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const index = state.recipes.findIndex(recipe => recipe.Id === action.payload.Id);
                if (index !== -1) {
                    state.recipes[index] = action.payload; // Update the specific recipe
                }
            })
            .addCase(updateRecipe.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })

            .addCase(deleteRecipe.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deleteRecipe.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // Remove the deleted recipe from state
                state.recipes = state.recipes.filter(recipe => recipe.Id !== action.payload.Id);
            })
            .addCase(deleteRecipe.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })

    },
});

export default recipeSlice.reducer;