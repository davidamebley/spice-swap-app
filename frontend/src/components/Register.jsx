import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Typography, Grid, CircularProgress, Box, Container } from '@mui/material';
import { styled } from '@mui/system';

import { registerUser, startRegistration } from '../redux/reducers/userReducer';

const Form = styled('form')({
  width: '40%', // Stretch form width
  '@media (max-width:600px)': { // Make form width responsive
    width: '80%',
  },
});

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVerify, setPasswordVerify] = useState('');
  const [inputError, setInputError] = useState('');
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (user.status === 'succeeded') {
      alert("Registration successful! Redirecting to login...");
      navigate("/login");
    }
  }, [user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setInputError('');
    // Reset Registration state
    dispatch(startRegistration());

    // Check if all fields are filled
    if (!username || !password || !passwordVerify) {
      setInputError("All fields are required");
      return;
    }

    // Check if passwords match
    if (password !== passwordVerify) {
      setInputError("Passwords do not match");
      return;
    }

    // dispatch registerUser action
    dispatch(registerUser({ username, password }));
  }

  return (
    <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <Form onSubmit={handleSubmit}>
        <Grid container direction="column" spacing={2}>
          <Grid item>
            <Typography variant="h4">Register</Typography>
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
          <Grid item>
            <TextField
              variant="outlined"
              type="password"
              label="Verify Password"
              fullWidth
              value={passwordVerify}
              onChange={(e) => setPasswordVerify(e.target.value)}
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
              {user.status === 'loading' ? <CircularProgress size="1.5rem" /> : 'Register'}
            </Button>
          </Grid>

          {/* Display error message if registration fails */}
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
  );
}

export default Register;
