using Microsoft.AspNetCore.Mvc;
using miniclipBackendApp.Models;
using miniclipBackendApp.Data;
using Microsoft.EntityFrameworkCore;
using miniclipBackendApp.Services;

namespace miniclipBackendApp.Controllers
{
    [Route("api/game")]
    public class GameController : Controller
    {
        private readonly AppDbContext _context;
        private readonly GameService _gameService;

        public GameController(AppDbContext context, GameService gameService)
        {
            _context = context;
            _gameService = gameService;
        }

        [HttpPost("simulate")]
        public ActionResult<string> SimulateGame([FromBody] Team homeTeam)
        {
            // Fetch the existing team from the database without tracking
            var existingHomeTeam = _context.Teams.AsNoTracking()
                .Include(t => t.Players)
                .FirstOrDefault(t => t.Id == homeTeam.Id);

            if (existingHomeTeam != null)
            {
                // Update properties from the received homeTeam to existingHomeTeam
                existingHomeTeam.TeamName = homeTeam.TeamName;

                foreach (var player in homeTeam.Players)
                {
                    var existingPlayer = existingHomeTeam.Players.FirstOrDefault(p => p.Id == player.Id);
                    if (existingPlayer != null)
                    {
                        // Update properties of the existing player
                        existingPlayer.Name = player.Name;
                        existingPlayer.Support = player.Support;
                        existingPlayer.Attack = player.Attack;
                        existingPlayer.Defence = player.Defence;
                        existingPlayer.Age = player.Age;
                        existingPlayer.SkillLevel = player.SkillLevel;
                        existingPlayer.Position = player.Position;
                    }
                    else
                    {
                        // Add the new player to the team.
                        existingHomeTeam.Players.Add(player);
                    }
                }

                // Attach and update the modified existing home team.
                _context.Teams.Update(existingHomeTeam);
            }
            else
            {
                _context.Teams.Add(homeTeam);
            }

            var awayTeam = _gameService.GenerateRandomTeam();
            int homeTeamGoals = _gameService.SimulateGoals(homeTeam, awayTeam);
            int awayTeamGoals = _gameService.SimulateGoals(awayTeam, homeTeam);

            var game = new Game
            {
                HomeTeam = homeTeam,
                AwayTeam = awayTeam,
                HomeTeamGoals = homeTeamGoals,
                AwayTeamGoals = awayTeamGoals,
                WinningTeam = homeTeamGoals > awayTeamGoals ? homeTeam : (homeTeamGoals < awayTeamGoals ? awayTeam : null)
            };
            
            _context.Games.Add(game);
            _context.SaveChanges();

            return game.WinningTeam != null ? Ok($"The winning team is {game.WinningTeam.TeamName}") : Ok("It's a draw!");
        }
    }
}
