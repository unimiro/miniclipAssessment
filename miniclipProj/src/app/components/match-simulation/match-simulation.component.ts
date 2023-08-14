import { Component, OnInit, OnDestroy } from '@angular/core';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-match-simulation',
  templateUrl: './match-simulation.component.html',
  styleUrls: ['./match-simulation.component.sass']
})
export class MatchSimulationComponent implements OnInit, OnDestroy {

  ballPosition = { x: 300, y: 200, dx: 2, dy: -1, controlledBy: null as null | number }; // Default ball position
  showGoalMessage = false;
  ballEdgeTimer = 0; // Tracks time ball stays near the edge
  ballCooldown = 0;  // Cooldown time after ball is thrown to center

  players = [
    { x: 50, y: 50, speed: 3, team: 'red', role: 'defender' },
    { x: 100, y: 100, speed: 3, team: 'red', role: 'defender' },
    { x: 150, y: 150, speed: 3, team: 'red', role: 'midfielder' },
    { x: 200, y: 200, speed: 3, team: 'red', role: 'midfielder' },
    { x: 250, y: 250, speed: 3, team: 'red', role: 'attacker' },
    { x: 300, y: 100, speed: 3, team: 'blue', role: 'defender' },
    { x: 350, y: 150, speed: 3, team: 'blue', role: 'defender' },
    { x: 400, y: 200, speed: 3, team: 'blue', role: 'midfielder' },
    { x: 450, y: 250, speed: 3, team: 'blue', role: 'midfielder' },
    { x: 500, y: 300, speed: 3, team: 'blue', role: 'attacker' },
    { x: 30, y: 200, speed: 5, team: 'red', role: 'goalkeeper' },
    { x: 570, y: 200, speed: 5, team: 'blue', role: 'goalkeeper' },
  ];

  private simulation$!: Subscription;

  // Initial action
  ngOnInit() {
    const fps = 60;
    this.simulation$ = interval(1000 / fps).subscribe(() => this.simulateMatch());
  }

  shootTowardsGoal(player: any) {
    const goalX = player.team === 'red' ? 580 : 20;
    const opposingPlayers = this.players.filter(p => p.team !== player.team);

    let scores = [-1, 0, 1].map(direction => {
      let testX = player.x + Math.cos(Math.atan2(goalX - player.x, this.ballPosition.y + direction * 100 - player.y) * 50);
      let testY = player.y + Math.sin(Math.atan2(goalX - player.x, this.ballPosition.y + direction * 100 - player.y) * 50);
      return opposingPlayers.reduce((score, opp) => {
        let dist = Math.sqrt((testX - opp.x) ** 2 + (testY - opp.y) ** 2);
        if (dist < 50) {
          return score - 1;
        }
        return score;
      }, 0);
    });

    let bestDirection = scores.indexOf(Math.max(...scores)) - 1;
    const dy = bestDirection * (Math.random() * 2.5 + 2.5);

    return { dx: (goalX - this.ballPosition.x) * 0.03, dy: dy };
  }

  simulateMatch() {
    if (this.showGoalMessage) return;

    // Ball dynamics when not controlled
    if (!this.ballPosition.controlledBy) {
        this.ballPosition.x += this.ballPosition.dx;
        this.ballPosition.y += this.ballPosition.dy;

        // Introduce friction
        this.ballPosition.dx *= 0.98;
        this.ballPosition.dy *= 0.98;

        // Ball collision with top and bottom
        if (this.ballPosition.y <= 0 || this.ballPosition.y >= 400) {
            this.ballPosition.dy = -this.ballPosition.dy;
        }

        // Check if ball is at the edge
        if (this.ballPosition.x <= 10 || this.ballPosition.x >= 590 || this.ballPosition.y <= 10 || this.ballPosition.y >= 390) {
            this.ballEdgeTimer += (1000 / 60); // Assuming 60 fps

            if (this.ballEdgeTimer >= 3000) { // 3 seconds
                this.ballPosition.x = 300;
                this.ballPosition.y = 200;
                this.ballPosition.dx = 0;
                this.ballPosition.dy = 0;
                this.ballEdgeTimer = 0;
                this.ballCooldown = 1000; // 1 second cooldown
            }
        } else {
            this.ballEdgeTimer = 0;
        }

        // Sample ball collision with goals
        if (this.ballPosition.x <= 0 && this.ballPosition.y >= 160 && this.ballPosition.y <= 240) {
            this.showGoalMessage = true;
            this.simulation$.unsubscribe();
        }
        if (this.ballPosition.x <= 0 && (this.ballPosition.y < 160 || this.ballPosition.y > 240)) {
            this.ballPosition.dx = -this.ballPosition.dx;
        }

        if (this.ballPosition.x >= 600 && (this.ballPosition.y < 160 || this.ballPosition.y > 240)) {
            this.ballPosition.dx = -this.ballPosition.dx;
        }
        
        if (this.ballPosition.x >= 600 && this.ballPosition.y >= 160 && this.ballPosition.y <= 240) {
            this.showGoalMessage = true;
            this.simulation$.unsubscribe();
        }
    } else {
        // Ball controlled by player
        let player = this.players[this.ballPosition.controlledBy];
        this.ballPosition.x = player.x + 10;
        this.ballPosition.y = player.y;
    }

    if (this.ballCooldown > 0) {
        this.ballCooldown -= (1000 / 60);
    }

    // Update player positions and behaviors
    for (let i = 0; i < this.players.length; i++) {
      const player = this.players[i];
      
      // If ball is in cooldown, skip the player-ball interaction logic
      if (this.ballCooldown > 0) continue;

      let dx = this.ballPosition.x - player.x;
      let dy = this.ballPosition.y - player.y;
      let dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 15 && !this.ballPosition.controlledBy) {
          const shot = this.shootTowardsGoal(player);
          this.ballPosition.dx = shot.dx;
          this.ballPosition.dy = shot.dy;
          this.ballPosition.controlledBy = null;
      } else {
          switch (player.role) {
              case 'defender':
                  if (this.ballPosition.x < 300 && player.team === 'red' || this.ballPosition.x > 300 && player.team === 'blue') {
                      player.x += (dx / dist) * player.speed;
                      player.y += (dy / dist) * player.speed;
                  } else {
                      // Defensive positioning when ball is on the opponent's side
                      let defaultPosition = (player.team === 'red') ? { x: 100, y: 200 } : { x: 500, y: 200 };
                      dx = defaultPosition.x - player.x;
                      dy = defaultPosition.y - player.y;
                      dist = Math.sqrt(dx * dx + dy * dy);
                      player.x += (dx / dist) * player.speed;
                      player.y += (dy / dist) * player.speed;
                  }
                  break;
              case 'midfielder':
                  player.x += (dx / dist) * player.speed;
                  player.y += (dy / dist) * player.speed;
                  break;
              case 'attacker':
                  if (this.ballPosition.x > 300 && player.team === 'red' || this.ballPosition.x < 300 && player.team === 'blue') {
                      player.x += (dx / dist) * player.speed;
                      player.y += (dy / dist) * player.speed;
                  } else {
                      // Get closer to opponent's goal
                      let goalSide = (player.team === 'red') ? 500 : 100;
                      dx = goalSide - player.x;
                      player.x += (dx / Math.abs(dx)) * player.speed;
                  }
                  break;
              case 'goalkeeper':
                  if (dist < 100) {
                      player.x += (dx / dist) * player.speed;
                      player.y += (dy / dist) * player.speed;
                  } else {
                      // Stay close to the goal and adjust based on ball's y position
                      dx = 0;
                      player.y += (dy / dist) * player.speed;
                  }
                  if (player.team === 'red') {
                      player.x = Math.min(Math.max(player.x, 0), 60);
                      player.y = Math.min(Math.max(player.y, 140), 260);
                  } else if (player.team === 'blue') {
                      player.x = Math.min(Math.max(player.x, 540), 600);
                      player.y = Math.min(Math.max(player.y, 140), 260);
                  }
                  break;
          }
      }
      // Ensure players stay within the boundary
      player.x = Math.min(Math.max(player.x, 0), 600);
      player.y = Math.min(Math.max(player.y, 0), 400);
    }

    // Ensure players don't overlap with each other
    for (let i = 0; i < this.players.length; i++) {
      for (let j = i + 1; j < this.players.length; j++) {
        const player1 = this.players[i];
        const player2 = this.players[j];

        const dx = player2.x - player1.x;
        const dy = player2.y - player1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 30) {
          const angle = Math.atan2(dy, dx);
          const overlap = 30 - distance;

          player1.x -= (overlap / 2) * Math.cos(angle);
          player1.y -= (overlap / 2) * Math.sin(angle);

          player2.x += (overlap / 2) * Math.cos(angle);
          player2.y += (overlap / 2) * Math.sin(angle);
        }
      }
    }
  }

  ngOnDestroy() {
    if (this.simulation$) {
      this.simulation$.unsubscribe();
    }
  }
}
