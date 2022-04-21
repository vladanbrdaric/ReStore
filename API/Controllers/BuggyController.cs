using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace API.Controllers
{
    public class BuggyController : BaseApiController
    { 
        [HttpGet("bad-request")]
        public ActionResult GetBadRequest()
        {
            // This will send 400 back to the client
            return BadRequest(new ProblemDetails{Title="This is a bad request."});
        }  

        [HttpGet("unauthorised")]
        public ActionResult GetUnauthorised()
        {
            // This will send 401 back to the client
            return Unauthorized();
        }   

        // Each error will have its own routh / (path)
        [HttpGet("not-found")]
        public ActionResult GetNotFound()
        {
            // This will send 404 back to the client
            return NotFound();
        }   

        [HttpGet("server-error")]
        public ActionResult GetServerError()
        {
            // This one is going to return an exception and response code 500. 
            throw new Exception("This is a server error.");
        }   

        [HttpGet("validation-error")]
        public ActionResult GetValidationError()
        {
            // Is user fyll som kind of form and one of fields is not correct.
            ModelState.AddModelError("Problem1", "This is the first error");
            ModelState.AddModelError("Problem2", "This is the second error");
            return ValidationProblem();
        }   
    }
}