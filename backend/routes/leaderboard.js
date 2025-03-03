import { Router } from "express";
import * as playerFunctions from "../data/players.js";
const router = Router();

router.route("/").get(async (req, res) => {
    let players = await playerFunctions.getAllPlayers();
    for (let i = 0; i < players.length; i++) {
        players[i]._id = players[i]._id.toString();
    }
    players.sort((a, b) => {
        return b.singlesRating - a.singlesRating;
    });

    return res.json(players);
});
export default router;