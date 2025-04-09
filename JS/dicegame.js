class Bonesball {
    constructor() {
        this.teams = { "Red Team": 0, "Green Team": 0 };
        this.runners = [];
        this.outs = 0;
        this.inning = 1;
        this.half_inning = "Top";
        this.gameLog = [];
        this.rollCount = 0;
        this.current_team = this.determineFirstBatter();
        this.game_over = false;
    }

    rollDice() {
        return [Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1];
    }

    determineFirstBatter() {
        while (true) {
            const redRoll = this.rollDice().reduce((a, b) => a + b, 0);
            const greenRoll = this.rollDice().reduce((a, b) => a + b, 0);
            this.gameLog.push(`<span class="text-danger">Red Team</span> rolled: ${redRoll}`);
            this.gameLog.push(`<span class="text-success">Green Team</span> rolled: ${greenRoll}`);
            if (redRoll !== greenRoll) {
                if (redRoll < greenRoll) {
                    this.half_inning = "Top";
                    this.gameLog.push(`<span class="text-danger">Red Team</span> is up to Bat first.`);
                    this.gameLog.push(`<span class="text-success">Green Team</span> has Home Field advantage.`);
                    this.gameLog.push(`Moving into the Top of the 1st Inning...`);
                    this.gameLog.push(`<span class="text-limegreen">*****************************************************</span>`);
                    return "Red Team";
                } else {
                    this.half_inning = "Top";
                    this.gameLog.push(`<span class="text-success">Green Team</span> is up to Bat first.`);
                    this.gameLog.push(`<span class="text-danger">Red Team</span> has Home Field advantage.`);
                    this.gameLog.push(`Moving into the Top of the 1st Inning...`);
                    this.gameLog.push(`<span class="text-limegreen">*****************************************************</span>`);
                    return "Green Team";
                }
            } else {
                this.gameLog.push("It's a tie! Rolling again.");
            }
        }
    }

    processPlay() {
        if (this.outs >= 3) {
            this.switchInning();
            return true;
        }

        this.rollCount++;
        const [d1, d2] = this.rollDice();
        const rollSum = d1 + d2;
        this.gameLog.push(`${this.current_team === "Red Team" ? '<span class="text-danger">Red Team</span>' : '<span class="text-success">Green Team</span>'} rolled ${d1} and ${d2} (Total: ${rollSum})`);

        if ([2, 12].includes(rollSum)) {
            this.gameLog.push(`<span class="text-warning">Home run!</span>`);
            this.teams[this.current_team] += this.runners.length + 1;
            this.runners = [];
        } else if (rollSum === 3) {
            this.gameLog.push(`<span class="text-warning">Triple!</span>`);
            this.advanceRunners(3);
        } else if ([4, 10].includes(rollSum)) {
            this.gameLog.push(`<span class="text-warning">Single!</span>`);
            this.advanceRunners(1);
        } else if (rollSum === 11) {
            this.gameLog.push(`<span class="text-warning">Double!</span>`);
            this.advanceRunners(2);
        } else if (rollSum === 5) {
            this.gameLog.push(`<span class="text-warning">Line drive caught by a diving infielder! Batter Out!</span>`);
            this.outs += 1;
        } else if (rollSum === 6) {
            this.gameLog.push(`<span class="text-warning">Strike out!</span>`);
            this.outs += 1;
        } else if (rollSum === 7) {
            this.processWalkOrFoul();
        } else if (rollSum === 8) {
            this.processGroundOut();
        } else if (rollSum === 9) {
            this.processSacrificeFly();
        }

        if (this.half_inning === "Bottom" && this.inning >= 9 &&
            this.teams[this.current_team] > this.teams[this.current_team === "Green Team" ? "Red Team" : "Green Team"]) {
            this.game_over = true;
            this.gameLog.push(`<span class="text-warning">Walk-off victory!</span>`);
            this.gameLog.push(`Game over! ${this.current_team === "Red Team" ? '<span class="text-danger">Red Team</span>' : '<span class="text-success">Green Team</span>'} wins!`);
            this.gameLog.push(`Final Score: <span class="text-danger">Red Team</span> <span class="text-warning">${this.teams["Red Team"]}</span> - <span class="text-success">Green Team</span> <span class="text-warning">${this.teams["Green Team"]}</span>`);
            return false;
        }

        if (this.outs >= 3) {
            this.gameLog.push(`Outs: <span class="text-warning">${this.outs}</span>`);
            this.switchInning();
            return true;
        }
        return false;
    }

    advanceRunners(advancement) {
        const newRunners = [];
        for (const base of this.runners.sort((a, b) => a - b)) {
            const newBase = base + advancement;
            if (newBase > 3) {
                this.teams[this.current_team] += 1;
            } else {
                newRunners.push(newBase);
            }
        }
        if (advancement > 0) {
            newRunners.push(Math.min(advancement, 3));
        }
        this.runners = newRunners.sort((a, b) => a - b);
    }

    advanceWalk() {
        if (this.runners.length < 3) {
            if (!this.runners.includes(1)) {
                this.runners.push(1);
            } else if (!this.runners.includes(2)) {
                this.runners[this.runners.indexOf(1)] = 2;
                this.runners.push(1);
            } else if (!this.runners.includes(3)) {
                this.runners[this.runners.indexOf(2)] = 3;
                this.runners[this.runners.indexOf(1)] = 2;
                this.runners.push(1);
            }
        } else {
            this.teams[this.current_team] += 1;
            this.runners = [1, 2, 3];
        }
        this.runners.sort((a, b) => a - b);
    }

    processSacrificeFly() {
        if (!this.runners.length) {
            this.gameLog.push(`<span class="text-warning">Deep fly out!</span>`);
            this.outs += 1;
        } else if (this.outs === 2) {
            this.gameLog.push(`<span class="text-warning">Sacrifice fly! But with 2 outs, runners do not advance.</span>`);
            this.outs += 1;
        } else {
            this.gameLog.push(`<span class="text-warning">Sacrifice fly! Runners advance, Batter Out!</span>`);
            if (this.runners.includes(3)) {
                this.teams[this.current_team] += 1;
                this.runners.splice(this.runners.indexOf(3), 1);
            }
            if (this.runners.includes(2)) {
                this.runners[this.runners.indexOf(2)] = 3;
            }
            if (this.runners.includes(1)) {
                this.runners[this.runners.indexOf(1)] = 2;
            }
            this.outs += 1;
        }
    }

    processWalkOrFoul() {
        this.gameLog.push(`<span class="text-warning">Rolling again to determine Walk or Foul Ball...</span>`);
        const [d1, d2] = this.rollDice();
        const parityText = (d1 % 2 === 0 && d2 % 2 === 0) ? "Even/Even" :
                          (d1 % 2 === 1 && d2 % 2 === 1) ? "Odd/Odd" :
                          (d1 % 2 === 0 && d2 % 2 === 1) ? "Even/Odd" : "Odd/Even";
        this.gameLog.push(`Re-roll: ${d1} and ${d2} - ${parityText} means...`);
        if (d1 % 2 !== d2 % 2) {
            this.gameLog.push(`<span class="text-warning">Walk! Batter advances to first.</span>`);
            this.advanceWalk();
        } else {
            this.gameLog.push(`<span class="text-warning">Foul ball! Batter gets another swing.</span>`);
            this.processPlay();
        }
    }

    processGroundOut() {
        if (!this.runners.length) {
            this.gameLog.push(`<span class="text-warning">Ground ball… Batter thrown Out at 1st Base!</span>`);
            this.outs += 1;
        } else {
            this.gameLog.push(`<span class="text-warning">Rolling again to determine ground-out outcome...</span>`);
            const [d1, d2] = this.rollDice();
            const parityText = (d1 % 2 === 0 && d2 % 2 === 0) ? "Even/Even" :
                              (d1 % 2 === 1 && d2 % 2 === 1) ? "Odd/Odd" :
                              (d1 % 2 === 0 && d2 % 2 === 1) ? "Even/Odd" : "Odd/Even";
            this.gameLog.push(`Re-roll: ${d1} and ${d2} - ${parityText} means...`);
            if (d1 % 2 === 0 && d2 % 2 === 0) {
                this.gameLog.push(`<span class="text-warning">Lead runner out!</span>`);
                const leadRunner = Math.min(...this.runners);
                this.runners.splice(this.runners.indexOf(leadRunner), 1);
                const newRunners = [];
                for (const base of this.runners) {
                    newRunners.push(base + 1 <= 3 ? base + 1 : base);
                }
                this.runners = newRunners.sort((a, b) => a - b);
                this.runners.push(1);
                this.outs += 1;
            } else if (d1 % 2 === 1 && d2 % 2 === 1) {
                this.gameLog.push(`<span class="text-warning">Batter out! All runners advance by 1 base.</span>`);
                this.outs += 1;
                const newRunners = [];
                for (const base of this.runners.sort((a, b) => a - b)) {
                    const newBase = base + 1;
                    if (newBase > 3) {
                        this.teams[this.current_team] += 1;
                    } else {
                        newRunners.push(newBase);
                    }
                }
                this.runners = newRunners;
            } else {
                this.gameLog.push(`<span class="text-warning">Double play!</span>`);
                if (this.runners.length > 1 && this.outs < 2) {
                    this.outs += 2;
                    this.runners = this.runners.slice(2);
                    if (this.runners.includes(1)) {
                        this.runners[this.runners.indexOf(1)] = 2;
                    } else if (this.outs < 3) {
                        this.runners.push(1);
                    }
                } else {
                    this.outs = Math.min(this.outs + 2, 3);
                    this.runners = [];
                }
            }
        }
    }

    updateScore() {
        this.printBaseStatus();
        this.gameLog.push(`Score: <span class="text-danger">Red Team</span> <span class="text-warning">${this.teams["Red Team"]}</span> - <span class="text-success">Green Team</span> <span class="text-warning">${this.teams["Green Team"]}</span>`);
        this.gameLog.push(`Outs: <span class="text-warning">${this.outs}</span>`);
        if (this.outs < 3) {
            this.gameLog.push(`<span class="text-limegreen">${"*".repeat(this.rollCount)}</span>`);
        }
    }

    printBaseStatus() {
        const bases = ["1st", "2nd", "3rd"];
        if (!this.runners.length) {
            this.gameLog.push("Bases are empty.");
        } else {
            const runnerPositions = this.runners.map(base => bases[base - 1]);
            this.gameLog.push(runnerPositions.length === 1 ? 
                `Runner on ${runnerPositions[0]}` : 
                `Runners on ${runnerPositions.join(" and ")}`);
        }
    }

    switchInning() {
        if (this.inning === 9 && this.half_inning === "Bottom") {
            if (this.teams["Red Team"] !== this.teams["Green Team"]) {
                this.game_over = true;
                this.gameLog.push("Game over!");
                this.gameLog.push(`Final Score: <span class="text-danger">Red Team</span> <span class="text-warning">${this.teams["Red Team"]}</span> - <span class="text-success">Green Team</span> <span class="text-warning">${this.teams["Green Team"]}</span>`);
                return;
            } else {
                this.gameLog.push("\nScore is tied! Game goes into extra innings!");
            }
        } else if (this.inning >= 10 && this.half_inning === "Bottom") {
            if (this.teams["Red Team"] !== this.teams["Green Team"]) {
                this.game_over = true;
                this.gameLog.push("Game over!");
                this.gameLog.push(`Final Score: <span class="text-danger">Red Team</span> <span class="text-warning">${this.teams["Red Team"]}</span> - <span class="text-success">Green Team</span> <span class="text-warning">${this.teams["Green Team"]}</span>`);
                return;
            }
        }

        const battingTeam = this.current_team === "Green Team" ? "Red Team" : "Green Team";
        const fieldingTeam = this.current_team;
        this.gameLog.push(`<span class="text-limegreen">*****************************************************</span>`);
        this.gameLog.push(`Switching Innings!`);
        this.gameLog.push(`${battingTeam === "Red Team" ? '<span class="text-danger">Red Team</span>' : '<span class="text-success">Green Team</span>'} is up to Bat.`);
        this.gameLog.push(`${fieldingTeam === "Red Team" ? '<span class="text-danger">Red Team</span>' : '<span class="text-success">Green Team</span>'} is Pitching and Fielding.`);

        this.outs = 0;
        this.runners = [];
        this.rollCount = 0;

        const ordinal = this.inning === 1 ? "1st" : this.inning === 2 ? "2nd" : this.inning === 3 ? "3rd" : `${this.inning}th`;
        if (this.half_inning === "Top") {
            this.half_inning = "Bottom";
            this.current_team = this.current_team === "Green Team" ? "Red Team" : "Green Team";
            this.gameLog.push(`Moving into the Bottom of the ${ordinal} Inning...`);
        } else {
            this.half_inning = "Top";
            this.inning += 1; // Increment inning only when moving from Bottom to Top
            this.current_team = this.current_team === "Red Team" ? "Green Team" : "Red Team";
            const newOrdinal = this.inning === 1 ? "1st" : this.inning === 2 ? "2nd" : this.inning === 3 ? "3rd" : `${this.inning}th`;
            this.gameLog.push(`Moving into the Top of the ${newOrdinal} Inning...`);
        }

        this.gameLog.push(`Score: <span class="text-danger">Red Team</span> <span class="text-warning">${this.teams["Red Team"]}</span> - <span class="text-success">Green Team</span> <span class="text-warning">${this.teams["Green Team"]}</span>`);
        this.gameLog.push(`<span class="text-warning">*****************************************************</span>`);
    }
}

// Global game instance
let game = new Bonesball();

function rollBones() {
    if (!game.game_over) {
        const didSwitchInning = game.processPlay();
        if (!game.game_over && !didSwitchInning) {
            game.updateScore();
        }
        $("#gameOutput").html(game.gameLog.join("<br>"));
    } else {
        $("#gameOutput").html(game.gameLog.join("<br>") + "<br><br>Game is over! Click 'Roll Your Bones' to start a new game.");
        $("#rollBonesBtn").one("click", function() {
            game = new Bonesball();
            $("#gameOutput").html(game.gameLog.join("<br>"));
        });
    }
    const gameOutput = $("#gameOutput")[0];
    gameOutput.scrollTop = gameOutput.scrollHeight;
}