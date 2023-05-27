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

    var user = new User 
    {
        Username = registerDto.Username
    };

    CreatePasswordHash(registerDto.Password, out byte[] passwordHash, out byte[] passwordSalt);

    user.PasswordHash = passwordHash;
    user.PasswordSalt = passwordSalt;

    _context.Users.Add(user);
    await _context.SaveChangesAsync();

    return CreatedAtAction(nameof(GetUser), new { id = user.Id }, new { user.Id, user.Username });
}

[HttpPost("login")]
public async Task<ActionResult<UserDto>> Login(UserLoginDto loginDto) 
{
    var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == loginDto.Username);
    
    if (user == null)
    {
        return Unauthorized("Invalid username");
    }

    if (!VerifyPasswordHash(loginDto.Password, user.PasswordHash, user.PasswordSalt))
    {
        return Unauthorized("Invalid password");
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

private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
{
    using var hmac = new HMACSHA512();
    passwordSalt = hmac.Key;
    passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
}

private bool VerifyPasswordHash(string password, byte[] storedHash, byte[] storedSalt)
{
    using var hmac = new HMACSHA512(storedSalt);
    var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));

    for (int i = 0; i < computedHash.Length; i++)
    {
        if (computedHash[i] != storedHash[i]) return false;
    }

    return true;
}

}
