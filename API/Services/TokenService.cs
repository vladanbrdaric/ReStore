using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace API.Services
{
    public class TokenService
    {
        private readonly IConfiguration _config;
        private readonly UserManager<User> _userManager;

        public TokenService(UserManager<User> userManager, IConfiguration config)
        {
            _config = config;
            _userManager = userManager;
        }

        // This method will generate the token
        public async Task<string> GenerateToken(User user)
        {
            // Token containes three parts:
            // header  -> telling what algorith is used to encrypt the signature, and what type of token it is 'jwt'...
            // payload -> the contens inside the token, the claims about the user, when it was issued and when it's going to expire...
            // signature -> this part is going to be encrypted.


            // == PAYLOAD ==

            // Claims -> information about the user that's comming from the database. Email, Username, Name, Roles...
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, user.UserName)
            };

            var roles = await _userManager.GetRolesAsync(user);

            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }


            // == Signatur ==

            // This is a key used to decrypt and encrypt the sign.
            // Everybody that has this key can pretend to be anybody including admin as well.
            // It should NEWER leave the server.

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["JWTSettings:TokenKey"]));

            // create credentials with the key and algiritm. HmacSha256 is the strongest available.
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            // Create JWT token options
            var TokenOptions = new JwtSecurityToken(
                issuer: null,
                audience: null,
                claims: claims,
                expires: DateTime.Now.AddDays(7),
                signingCredentials: creds
            );

            // return the token created with the token options
            return new JwtSecurityTokenHandler().WriteToken(TokenOptions);
        }
    }
}
