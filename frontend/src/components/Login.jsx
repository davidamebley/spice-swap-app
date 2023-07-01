import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { Button, TextField, Typography, Grid, CircularProgress, Box, Container } from '@mui/material';
import { styled } from '@mui/system';

import { loginUser } from '../redux/reducers/userReducer';

const Form = styled('form')({
  width: '40%', // Stretch form width
  '@media (max-width:600px)': { // Make form width responsive
    width: '80%',
  },
});

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [inputError, setInputError] = useState('');
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const user = useSelector(state => state.user);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setInputError('');

    // Check if all fields are filled
    if (!username || !password) {
      setInputError("All fields are required");
      return;
    }

    // dispatch loginUser action
    await dispatch(loginUser({ username, password }));

  }

  useEffect(() => {
    if (user.user && user.status === 'succeeded') {
      enqueueSnackbar('You have successfully logged in!', { variant: 'success' });
      navigate('/');  // navigate after dispatch is done
    }
  }, [user, enqueueSnackbar, navigate]);


  return (
    <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'start', height: '100vh', marginTop: '2em' }}>
      <Form onSubmit={handleLogin}>
        <Grid container direction="column" spacing={2}>
          <Grid item>
            <Typography variant="h4">Login to Spice Swap</Typography>
          </Grid>
          <Grid item>
            <TextField
              variant="outlined"
              label="Username"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Grid>
          <Grid item>
            <TextField
              variant="outlined"
              type="password"
              label="Password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Grid>

          {/* Display error message if validation fails */}
          {inputError &&
            <Grid item>
              <Box color="error.main">
                <Typography variant="body1">{inputError}</Typography>
              </Box>
            </Grid>
          }

          <Grid item>
            <Button variant="contained" color="primary" type="submit" fullWidth disabled={user.status === 'loading'}>
              {user.status === 'loading' ? <CircularProgress size="1.5rem" /> : 'Login'}
            </Button>
          </Grid>

          {/* Display error message if login fails */}
          {user.status === 'failed' &&
            <Grid item>
              <Box color="error.main">
                <Typography variant="body1">{user.error}</Typography>
              </Box>
            </Grid>
          }
        </Grid>
      </Form>
    </Container>
  )
}

export default Login