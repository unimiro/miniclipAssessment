using Microsoft.EntityFrameworkCore;
using miniclipBackendApp.Models;

namespace miniclipBackendApp.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options) { }

        public DbSet<Player> Players { get; set; }
        public DbSet<Team> Teams { get; set; }
        public DbSet<Game> Games { get; set; }

         public void AddPlayersToDatabase()
        {
            List<Player> players = GeneratePlayers();
            this.Players.AddRange(players);
            this.SaveChanges();

            // Detaching players after saving them
            foreach (var player in players)
            {
                this.Entry(player).State = EntityState.Detached;
            }
        }

        public List<Player> GeneratePlayers()
        {
            var names = new List<string>
            {
                "John", "Mike", "Ethan", "Oliver", "Lucas", 
                "Liam", "Mason", "Logan", "Noah", "James", 
                "Aiden", "Benjamin", "Jacob", "Michael", "Matthew", 
                "Elijah", "Daniel", "Joseph", "David", "Samuel", 
                "Robert", "Lucas", "Jack", "William", "Andrew", 
                "Ryan", "Chris", "Paul", "Luke", "Jason"
            };

            var imagePaths = new List<string>
            {
                "assets/images/players/1.jpg", "assets/images/players/2.jpg", "assets/images/players/3.jpg",
                "assets/images/players/4.jpg", "assets/images/players/5.jpg", "assets/images/players/6.jpg",
                "assets/images/players/7.jpg", "assets/images/players/8.jpg", "assets/images/players/9.jpg",
                "assets/images/players/10.jpg", "assets/images/players/11.jpg", "assets/images/players/12.jpg",
                "assets/images/players/13.jpg", "assets/images/players/14.jpg", "assets/images/players/15.jpg",
                "assets/images/players/16.jpg", "assets/images/players/17.jpg", "assets/images/players/18.jpg",
                "assets/images/players/19.jpg", "assets/images/players/20.jpg", "assets/images/players/21.jpg",
                "assets/images/players/22.jpg", "assets/images/players/23.jpg",
            };

            var positions = new List<string> { "Forward", "Midfielder", "Defender", "Goalkeeper" };
            var random = new Random();
            var players = new List<Player>();

            // generating 20 players
            for (int i = 0; i < 20; i++)
            {
                players.Add(new Player
                {
                    Id = i + 1,
                    Name = names[i],
                    Age = random.Next(18, 36),
                    Position = positions[random.Next(0, positions.Count)],
                    SkillLevel = random.Next(1, 11),
                    Attack = random.Next(50, 101),
                    Support = random.Next(50, 101),
                    Defence = random.Next(50, 101),
                    ImagePath = imagePaths[i]
                });
            }
            return players;
        }
    }    
}


            
       