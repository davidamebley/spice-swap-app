using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
public async Task<ActionResult<UserDto>> Register(UserRegisterDto registerDto) 
{
    if (await UserExists(registerDto.Username))
    {
        return BadRequest("Username is already taken");
    }

    using var hmac = new HMACSHA512();

    var user = new User 
    {
        Username = registerDto.Username,
        PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password)),
        PasswordSalt = hmac.Key
    };

    _context.Users.Add(user);
    await _context.SaveChangesAsync();

    return new UserDto { Id = user.Id, Username = user.Username };
}

[HttpPost("login")]
public async Task<ActionResult<UserDto>> Login(UserLoginDto loginDto) 
{
    var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == loginDto.Username);
    
    if (user == null)
    {
        return Unauthorized("Invalid username");
    }

    using var hmac = new HMACSHA512(user.PasswordSalt);

    var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));

    for (int i = 0; i < computedHash.Length; i++)
    {
        if (computedHash[i] != user.PasswordHash[i]) return Unauthorized("Invalid password");
    }

    return Ok(new UserDto { Id = user.Id, Username = user.Username });
}

// Handles GET requests for individual users based on their id
[HttpGet("{id}")]
public async Task<ActionResult<UserDto>> GetUser(int id)
{
    var user = await _context.Users.FindAsync(id);

    if (user == null)
    {
        return NotFound();
    }

    return new UserDto
    {
        Id = user.Id,
        Username = user.Username
    };
}


private async Task<bool> UserExists(string username)
{
    return await _context.Users.AnyAsync(u => u.Username == username.ToLower());
}
}
