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

    // GET: api/Recipe/user/5
    [HttpGet("user/{userId}")]
    public async Task<ActionResult<IEnumerable<RecipeDto>>> GetUserRecipes(int userId)
    {
        var recipes = await _context.Recipes
                                    .Where(r => r.UserId == userId)
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

        if (recipes == null || recipes.Count == 0)
        {
            return NotFound();
        }

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
    public async Task<ActionResult<RecipeDto>> UpdateRecipe(int id, RecipeUpdateDto recipeUpdateDto)
    {
        var recipe = await _context.Recipes.FindAsync(id);

        if (recipe == null)
        {
            return NotFound();
        }

        // Check if right owner performing task
        var userIdFromToken = GetUserIdFromToken();
        if (userIdFromToken != recipe.UserId)
        {
            return Unauthorized("Operation cannot be performed. You are not the owner of this recipe or you're not signed in.");
        }

        // update the recipe with new data from recipeUpdateDto
        recipe.Title = recipeUpdateDto.Title;
        recipe.Description = recipeUpdateDto.Description;
        recipe.Ingredients = recipeUpdateDto.Ingredients;
        recipe.Steps = recipeUpdateDto.Steps;

        _context.Entry(recipe).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!RecipeExists(id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }

        // Return updated recipe
        var updatedRecipe = new RecipeDto
        {
            Id = recipe.Id,
            Title = recipe.Title,
            Description = recipe.Description,
            Ingredients = recipe.Ingredients,
            Steps = recipe.Steps,
            Username = _context.Users.Find(recipe.UserId).Username
        };

        return updatedRecipe;
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
    public async Task<ActionResult<RecipeDto>> DeleteRecipe(int id)
    {
        var recipe = await _context.Recipes.FindAsync(id);
        if (recipe == null)
        {
            return NotFound();
        }

        // Check if right owner performing task
        var userIdFromToken = GetUserIdFromToken();
        if (userIdFromToken != recipe.UserId)
        {
            return Unauthorized("Operation cannot be performed. You are not the owner of this recipe or you're not signed in.");
        }

        // Create RecipeDto from recipe before deleting
        var deletedRecipe = new RecipeDto
        {
            Id = recipe.Id,
            Title = recipe.Title,
            Description = recipe.Description,
            Ingredients = recipe.Ingredients,
            Steps = recipe.Steps,
            Username = _context.Users.Find(recipe.UserId).Username
        };

        _context.Recipes.Remove(recipe);
        await _context.SaveChangesAsync();

        // Return deleted recipe
        return deletedRecipe;
    }

    // GET: api/Recipe/search?query={query}
    [HttpGet("search")]
    public async Task<ActionResult<IEnumerable<RecipeDto>>> SearchRecipes(string query)
    {
        if (string.IsNullOrWhiteSpace(query))
        {
            return BadRequest("A search query must be provided");
        }

        // Escape wildcard characters in user input
        query = query.Replace("%", "[%]").Replace("_", "[_]");

        var recipes = await _context.Recipes
                                    .Include(r => r.User)
                                    .Where(r => EF.Functions
                                    .Like(r.Title, $"%{query}%") || EF.Functions
                                    .Like(r.Description, $"%{query}%"))
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

        if (recipes.Count == 0)
        {
            return NotFound("No recipes found for the given query");
        }

        return recipes;
    }


    private bool RecipeExists(int id)
    {
        return _context.Recipes.Any(e => e.Id == id);
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
