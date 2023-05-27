using Microsoft.AspNetCore.Mvc;

[Route("api/[controller]")]
[ApiController]
public class UserController : ControllerBase
{
    private readonly DataContext _context;
    
    public UserController(DataContext context)
    {
        _context = context;
    }

    [HttpPost("register")]
    public async Task<ActionResult<User>> Register(User user) 
    {
        // Registration logic here
    }

    [HttpPost("login")]
    public async Task<ActionResult<User>> Login(User user) 
    {
        // Login logic here
    }
}
