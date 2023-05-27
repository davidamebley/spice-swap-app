/* using Microsoft.AspNetCore.Mvc;

[Route("api/[controller]")]
[ApiController]
public class RecipeController : ControllerBase
{
    private readonly DataContext _context;
    
    public RecipeController(DataContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<ActionResult<Recipe>> CreateRecipe(Recipe recipe) 
    {
        // Create recipe logic here
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Recipe>>> GetRecipes() 
    {
        // Fetch all recipes logic here
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Recipe>> GetRecipe(int id) 
    {
        // Fetch single recipe logic here
    }
}
 */