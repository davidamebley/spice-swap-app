using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

[Route("api/[controller]")]
[ApiController]
public class RecipeController : ControllerBase
{
    private readonly DataContext _context;

    public RecipeController(DataContext context)
    {
        _context = context;
    }

    // GET: api/Recipe
    [HttpGet]
    public async Task<ActionResult<IEnumerable<RecipeDto>>> GetRecipes()
    {
        var recipes = await _context.Recipes
                                    .Include(r => r.User)
                                    .Select(r => new RecipeDto
                                    {
                                        Id = r.Id,
                                        Title = r.Title,
                                        Description = r.Description,
                                        Ingredients = r.Ingredients,
                                        Steps = r.Steps,
                                        Username = r.User.Username
                                    })
                                    .ToListAsync();
        return recipes;
    }

    // GET: api/Recipe/5
    [HttpGet("{id}")]
    public async Task<ActionResult<RecipeDto>> GetRecipe(int id)
    {
        var recipe = await _context.Recipes
                                   .Include(r => r.User)
                                   .Select(r => new RecipeDto
                                   {
                                       Id = r.Id,
                                       Title = r.Title,
                                       Description = r.Description,
                                       Ingredients = r.Ingredients,
                                       Steps = r.Steps,
                                       Username = r.User.Username
                                   })
                                   .FirstOrDefaultAsync(r => r.Id == id);

        if (recipe == null)
        {
            return NotFound();
        }

        return recipe;
    }

    // PUT: api/Recipe/5
    [Authorize]     // Protected method
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateRecipe(int id, Recipe recipe)
    {
        if (id != recipe.Id)
        {
            return BadRequest();
        }

        _context.Entry(recipe).State = EntityState.Modified;
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // POST: api/Recipe
    [Authorize]     // Protected method
    [HttpPost]
    public async Task<ActionResult<RecipeDto>> CreateRecipe(RecipeCreateDto recipeCreateDto)
    {
        // Check if UserId is valid
        if (recipeCreateDto.UserId == 0)
        {
            return BadRequest("A valid UserId is required");
        }

        var recipe = new Recipe
        {
            Title = recipeCreateDto.Title,
            Description = recipeCreateDto.Description,
            Ingredients = recipeCreateDto.Ingredients,
            Steps = recipeCreateDto.Steps,
            UserId = recipeCreateDto.UserId
        };

        _context.Recipes.Add(recipe);
        await _context.SaveChangesAsync();

        var createdRecipe = new RecipeDto
        {
            Id = recipe.Id,
            Title = recipe.Title,
            Description = recipe.Description,
            Ingredients = recipe.Ingredients,
            Steps = recipe.Steps,
            Username = _context.Users.Find(recipe.UserId).Username
        };

        return CreatedAtAction(nameof(GetRecipe), new { id = recipe.Id }, createdRecipe);
    }


    // DELETE: api/Recipe/5
    [Authorize]     // Protected method
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteRecipe(int id)
    {
        var recipe = await _context.Recipes.FindAsync(id);
        if (recipe == null)
        {
            return NotFound();
        }

        _context.Recipes.Remove(recipe);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private int GetUserIdFromToken()
    {
        var identity = HttpContext.User.Identity as ClaimsIdentity;
        var userIdClaim = identity?.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null)
        {
            throw new UnauthorizedAccessException("Invalid or expired token");
        }

        if (!int.TryParse(userIdClaim.Value, out var userId))
        {
            throw new Exception("Invalid user id in token");
        }

        return userId;
    }

}
