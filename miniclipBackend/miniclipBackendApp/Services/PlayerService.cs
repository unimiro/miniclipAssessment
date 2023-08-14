using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using miniclipBackendApp.Data;

namespace miniclipBackendApp.Services
{
    public class PlayerService
    {
        private readonly AppDbContext _context;

        public PlayerService(AppDbContext context)
        {
            _context = context;
        }

        public void Add(Player player)
        {
            _context.Players.Add(player);
            _context.SaveChanges();
        }

        public List<Player> GetAll()
        {
            return _context.Players.ToList();
        }

        
    }
}