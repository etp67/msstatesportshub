CREATE TABLE sport (
	sport_id INT PRIMARY KEY,
	sport VARCHAR(255) NOT NULL UNIQUE
);
CREATE TABLE team (
	team_id INT PRIMARY KEY,
	sport_id INT NOT NULL REFERENCES sport(sport_id),
	team_year VARCHAR(16) NOT NULL,
	wins INT,
	losses INT,
	win_perc DEC,
	conf_wins INT,
	conf_losses INT,
	conf_win_perc DEC,
	streak_type BOOL,
	streak_num INT,
	home_wins INT,
	home_losses INT,
	away_wins INT,
	away_losses INT,
	neutral_wins INT,
	neutral_losses INT
);
CREATE TABLE game (
	game_id SERIAL PRIMARY KEY,
	team_id INT NOT NULL REFERENCES team(team_id),
	game_date DATE,
	game_time TIME,
	game_at CHAR(1),
	opponent VARCHAR(255),
	game_location VARCHAR(255),
	tournament VARCHAR(255),
	game_result CHAR(1),
	canceled_reason VARCHAR(255),
	team_score INT,
	opponent_score INT
);