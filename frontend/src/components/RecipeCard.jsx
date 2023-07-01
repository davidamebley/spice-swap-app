import { Card, CardContent, Typography, CardActionArea, Box } from '@mui/material';

export function RecipeCard({ recipe, onClick, currentUser }) {
    const createdBy = recipe.username === currentUser ? 'You' : recipe.username;
    return (
        <Card sx={{ width: 345, height: 200, m: 1 }} onClick={onClick}>
            <CardActionArea>
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div" align="left" mb={4}>
                        {recipe.title.substring(0, 25)}...
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="left" >
                        {recipe.description ? recipe.description.substring(0, 120) + `...` : 'No description'}
                    </Typography>
                    <Box mt={3}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', fontWeight: 'bold' }} align="left">
                            ~ By &bull; {createdBy}
                        </Typography>
                    </Box>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}
