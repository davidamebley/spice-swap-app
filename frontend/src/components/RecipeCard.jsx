import { Card, CardContent, Typography, CardActionArea, Box } from '@mui/material';

import '../styles/recipeCard.css';

export function RecipeCard({ recipe, onClick, currentUser }) {
    const createdBy = recipe.username === currentUser ? 'You' : recipe.username;
    return (
        <Card sx={{ width: 345, height: 200, m: 1 }} onClick={onClick}>
            <CardActionArea>
                <CardContent>
                    {/* Featured image */}
                    <img src={recipe.thumbnailUrl} alt={recipe.title} className="thumbnail-image" />

                    <Typography
                        gutterBottom variant="h5" component="div" align="left" mb={4} className="recipeCardTitle"
                    >
                        {recipe.title}
                    </Typography>

                    {<Typography
                        variant="body2" color="text.secondary" align="left" className="recipeCardDescription"
                    >
                        {recipe.description ? recipe.description : 'No description'}
                    </Typography>}
                    <Box mt={3}>
                        <Typography
                            variant="body2" color="text.secondary" sx={{ fontWeight: '450' }} align="left" className="recipeCardAuthor"
                        >
                            By &bull; {createdBy}
                        </Typography>
                    </Box>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}
