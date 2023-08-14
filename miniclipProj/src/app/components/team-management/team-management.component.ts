import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { from } from 'rxjs';
import { Player, PlayerService, Team } from 'src/app/player.service';

type Strategy = 'aggressive' | 'balanced' | 'defence';

@Component({
  selector: 'app-team-management',
  templateUrl: './team-management.component.html',
  styleUrls: ['./team-management.component.sass']
})
export class TeamManagementComponent {
  selectedStrategy: Strategy = 'aggressive';
  isModalOpen = false; 
 
  //descriptions of strategy
  strategyDescriptions: { [key in Strategy]: string } = {
    'aggressive': "This strategy prioritizes offensive play. Teams employing this approach will often position more players forward, attempting to exert consistent pressure on the opposing team's defense. This can result in a higher number of goal opportunities but can also expose the team to counter-attacks. Ideal for teams with strong strikers and agile midfielders.",
    'balanced': "As the name suggests, this strategy aims for a harmonious balance between offense and defense. The team doesn't lean too heavily on either side, ensuring they're ready to transition smoothly from defense to attack and vice versa. Perfect for teams with versatile players who can adapt to evolving match situations.",
    'defence': "This strategy emphasizes a robust defensive structure. The team will often position more players behind the ball, focusing on breaking up the opposing team's plays, intercepting passes, and blocking shots. While goal opportunities might be fewer, it minimizes risks and can lead to valuable counter-attack opportunities."
  };

  players: Player[] = [];
  selectedPlayers: Player[] = [];
  playerToReplaceIndex: number | null = null;
  teamAverageScore: number = 0;
  teamAttackPower: number = 0;
  teamSupport: number = 0;
  teamDefence: number = 0;

  constructor(private playerService: PlayerService, private http: HttpClient, private router: Router) { }

  ngOnInit(): void{
    this.loadPlayers();
  }

  // Open popup window after click on '+' ( add player to team )
  openModal(playerIndex?: number) {
    this.isModalOpen = true;
    this.playerToReplaceIndex = playerIndex !== undefined ? playerIndex : null;
  }

  // Close popup window
  closeModal() {
    this.isModalOpen = false;
  }

  // Get players from backend app
  loadPlayers() {
    this.playerService.getPlayers().subscribe(data => {
        this.players = data;
    });
  }

  // Select players for team and disable selecting when 10 players are chosen
  selectPlayer(player: Player) {
    if (this.selectedPlayers.some(p => p.id === player.id)) {
        alert('This player has already been selected.');
        return;
    }
    if (this.playerToReplaceIndex !== null) {
        // Replacing the existing player at given index
        this.selectedPlayers[this.playerToReplaceIndex] = player;
        this.playerToReplaceIndex = null; // Reset
    } else if (this.selectedPlayers.length < 10) {
        this.selectedPlayers.push(player);
    } else {
        alert('You can only select 10 players.');
    }
    this.updateTeamStats();
    this.closeModal();
  }

  isSelected(player: Player): boolean {
    return this.selectedPlayers.some(p => p.id === player.id);
  }

  // Updating team statistics after choosing players
  updateTeamStats() {
    if (this.selectedPlayers.length === 0) {
        this.teamAverageScore = 0;
        this.teamAttackPower = 0;
        this.teamSupport = 0;
        this.teamDefence = 0;
        return;
    }

    // Total of all players statistics
    const totalAttackPower = this.selectedPlayers.reduce((acc, player) => acc + player.attack, 0);
    const totalSupport = this.selectedPlayers.reduce((acc, player) => acc + player.support, 0);
    const totalDefence = this.selectedPlayers.reduce((acc, player) => acc + player.defence, 0);

    // Calculate average
    this.teamAttackPower = Math.round(totalAttackPower / this.selectedPlayers.length);
    this.teamSupport = Math.round(totalSupport / this.selectedPlayers.length);
    this.teamDefence = Math.round(totalDefence / this.selectedPlayers.length);

    this.applyStrategyBonus();

    // Calculate the average score based on attack power, support, and defence
    this.teamAverageScore = Math.round((this.teamAttackPower + this.teamSupport + this.teamDefence) / 3);
  }

  // Bonus for strategy chosen
  applyStrategyBonus() {
    const BONUS_PERCENT = 0.10;
    switch (this.selectedStrategy) {
      case 'aggressive':
        this.teamAttackPower += Math.round(this.teamAttackPower * BONUS_PERCENT);
        break;
      case 'balanced':
        this.teamSupport += Math.round(this.teamSupport * BONUS_PERCENT);
        break;
      case 'defence':
        this.teamDefence += Math.round(this.teamDefence * BONUS_PERCENT);
        break;
      default:
        // do nothing
        break;
    }
  }

  startSimulation() {
    if (this.selectedPlayers.length >= 10) {
      this.router.navigate(['/match-simulation']);
    } else {
      alert('Please select at least 10 players to start the simulation.');
    }
    
    for (let player of this.selectedPlayers) {
      player.id += 500;
    }
    
    const userTeam: Team = {
      id: 0,
      teamName: 'User Team',
      players: this.selectedPlayers
    };
    
    this.playerService.setTeam(userTeam).subscribe(
      players => {
        console.log(players);
      },
      error => {
        console.error('Error posting team:', error);
      }
    );
  }

  // Update statistics after changing to another strategy
  onStrategyChange() {
    this.updateTeamStats();
  }
}
