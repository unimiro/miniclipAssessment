using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using miniclipBackendApp.Services;
using miniclipBackendApp.Models;
using miniclipBackendApp.Data;

namespace miniclipBackendApp.Controllers
{
    [Route("api/player")]
    public class PlayerController : Controller
    {
        private readonly PlayerService _playerService;

        public PlayerController(PlayerService playerService)
        {
            _playerService = playerService;
        }

        [HttpGet]
        public IEnumerable<Player> Get()
        {
            return _playerService.GetAll();
        }

         
    }
}