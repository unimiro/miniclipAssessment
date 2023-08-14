using miniclipBackendApp.Data;

namespace miniclipBackendApp.Services
{
    public class GameService
    {
        private readonly AppDbContext _context;
        private static readonly Random RandomGenerator = new Random();

        public GameService(AppDbContext context)
        {
            _context = context;
        }

        public Team GenerateRandomTeam()
        {
            // Generating opponent team
            var randomTeam = new Team
            {
                TeamName = "Random Team",
                Players = _context.GeneratePlayers().Take(10).ToList()
            };
            return randomTeam;
        }

        public int SimulateGoals(Team attackingTeam, Team defendingTeam)
        {
            // Get data for attacking and defending team
            int attackingScore = attackingTeam.Players.Sum(player => player.Attack);
            int defendingScore = defendingTeam.Players.Sum(player => player.Defence);

            // Calculate probability of scoring goal based on the teams statistics
            double scoringProbability = (double)attackingScore / (attackingScore + defendingScore);

            // Score goals based on propability
            if (RandomGenerator.NextDouble() < scoringProbability)
            {
                int maxGoals = 5;
                return RandomGenerator.Next(1, maxGoals + 1); 
            }
            else
            {
                return 0;
            }
        }
    }
}