//запис у базу даних
const db = require("../db");

class UserController {
    async createUser(req, res) {
        //отримуємо дані
        const { username, score } = req.body;
        const newPlayer = await db.query(
            "INSERT INTO player (username, score) VALUES ($1, COALESCE($2, 0)) RETURNING *",
            [username, score]
        );

        res.json(newPlayer.rows[0]);
    }
    async getUsers(req, res) {
        try {
            const query = "SELECT * FROM player ORDER BY score DESC LIMIT 10";
            const users = await db.query(query);
            res.json(users.rows);
        } catch (error) {
            console.error("Error fetching users:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
    async getOneUser(req, res) {
        const id = req.params.id;
        const user = await db.query("SELECT * FROM  player where id= $1", [id]);
        res.json(user.rows[0]);
    }
    async updateUserScore(req, res) {
        const { id, score } = req.body;
        const user = await db.query(
            "UPDATE player SET score=$1 WHERE id=$2 RETURNING *",
            [score, id]
        );
        res.json(user.rows[0]);
    }
    async deleteUser(req, res) {
        const id = req.params.id;
        const user = await db.query("DELETE FROM player where id= $1", [id]);
        res.json(user.rows[0]);
    }
}
module.exports = new UserController();
