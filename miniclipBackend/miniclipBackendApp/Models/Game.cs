using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace miniclipBackendApp.Models
{
    public class Game
    {
        public int GameId { get; set;}
        public Team? HomeTeam { get; set; }
        public Team? AwayTeam { get; set; }
        public int? HomeTeamGoals { get; set; }
        public int? AwayTeamGoals { get; set;}
        public Team? WinningTeam { get; set; }
    }
}