
create TABLE player(
    id SERIAL PRIMARY KEY,
    username VARCHAR(255),
   score INTEGER DEFAULT 0 
)