import React, { useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppBar, Toolbar, Typography, Button, Box, useMediaQuery, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useLocation } from 'react-router-dom';

import { UserContext } from '../routes/AppRouter';
import { logout } from '../redux/reducers/userReducer';

const NavBar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.user);
    // const user = useContext(UserContext);
    const { enqueueSnackbar } = useSnackbar();
    const location = useLocation();
    const theme = useTheme();

    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleLogout = () => {
        dispatch(logout());
        enqueueSnackbar('Logout successful', { variant: 'success' });
        navigate('/');
    };

    const activeButtonStyle = {
        backgroundColor: 'rgba(255,255,255,0.1)'
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography
                    variant="h6"
                    component="div"
                    sx={{ cursor: 'pointer' }}
                    onClick={() => navigate('/')}
                >
                    Spice Swap
                </Typography>

                {!isMobile && (
                    <Box sx={{ display: 'flex', flexGrow: 1, justifyContent: 'flex-end', alignItems: 'center' }}
                    >
                        <Button color="inherit" style={location.pathname === '/' ? activeButtonStyle : {}} onClick={() => navigate('/')}>Home</Button>
                        {user ? (
                            <>
                                <Button color="inherit" style={location.pathname === '/new' ? activeButtonStyle : {}} onClick={() => navigate('/new')}>Create Recipe</Button>
                                <Button color="inherit" style={location.pathname === '/userrecipes' ? activeButtonStyle : {}} onClick={() => navigate('/userrecipes')}>My Recipes</Button>
                                <Button color="inherit" onClick={handleLogout}>Logout</Button>
                            </>
                        ) : (
                            <>
                                <Button color="inherit" style={location.pathname === '/login' ? activeButtonStyle : {}} onClick={() => navigate('/login')}>Login</Button>
                                <Button color="inherit" style={location.pathname === '/register' ? activeButtonStyle : {}} onClick={() => navigate('/register')}>Register</Button>
                            </>
                        )}
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    )
}

export default NavBar