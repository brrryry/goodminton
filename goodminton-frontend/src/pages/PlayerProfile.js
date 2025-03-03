import React, { useState, useEffect } from "react";
import axios from "axios";

import { isValidString } from "./client_typecheck.js";

import { useParams } from "react-router-dom";

import Error from "./Error.js";

const PlayerProfile = ({ auth }) => {
  const { id } = useParams();
  const [error, setError] = useState("");
  const [requesting, setRequesting] = useState(false); //this will be used to check if a request is currently being made (to prevent concurrent requests)
  const [player, setPlayer] = useState(null);

  const handleDataChange = () => {
    let newData;
    let errorList = [];

    let error = document.getElementById("error");
    let success = document.getElementById("success");

    const tags = ["playerName", "email", "phone", "password"];

    let dataCollected = false;
    let targetTag;

    for (let tag of tags) {
      try {
        newData = isValidString(document.getElementById(tag).value);
        if (tag === "password") {
          let confirmData = isValidString(
            document.getElementById("confirmPassword").value
          );
          if (confirmData !== newData)
            errorList.push("Passwords do not match.");
        }
        targetTag = tag;
        dataCollected = true;
      } catch (e) {
        continue;
      }
    }

    if (!dataCollected) errorList.push("Blank/Invalid data.");
    if (requesting) errorList.push("The server is processing your previous request! Please don't spam.");

    if (errorList.length > 0) {
      success.hidden = true;
      error.hidden = false;
      error.innerHTML = errorList.join("<br>");
    } else {
      error.hidden = true;

      let updatedData = {};
      updatedData[targetTag] = newData;

      let axiospatch = (callback) => {
        setRequesting(true);
        axios.patch(`${process.env.REACT_APP_BACKENDAPI}/players/${id}`, updatedData, { withCredentials: true }).then((response) => {
          callback(true, "Player updated successfully.");
        }).catch((error) => {
          console.log(error)
          callback(false, error.response.data.error);
        });
      };

      axiospatch((result, data) => {
        error.hidden = result;
        success.hidden = !result;

        if (!result) error.innerHTML = data;
        else {
          document.getElementById(targetTag).value = "";
          if (targetTag === "password")
            document.getElementById("confirmPassword").value = "";
          document.getElementById(targetTag).placeholder =
            targetTag === "password" ? "********" : newData;
          success.innerHTML = data;
          setRequesting(false);
        }
      });
    }
  };


  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKENDAPI}/players/${id}`, {
        withCredentials: true,
      })
      .then((response) => {
        const player = response.data;
        setPlayer(player);
      })
      .catch((error) => {
        setError(error.response.data);
      });
  }, [id]);

  if (error) {
    const err = {
      referrer: `/players/${id}`,
      error: error.error,
    };
    return <Error error={err} />;
  }

  if (player) {
    let isOwner = auth._id.toString() === id;

    return (
      <section>
        <div className="profilePage">
          {isOwner ? (
            <React.Fragment>
              <div id="profileForm">
                <div className="formItem">
                  <label className="formTitle" htmlFor="playerName">Player Name</label>
                  <input className="formInput" type="text" id="playerName" name="playerName" placeholder={player.playerName} />
                </div>
                <div className="formItem">
                  <label className="formTitle" htmlFor="email">
                    Email
                  </label>
                  <input className="formInput" type="text" id="email" name="email" placeholder={player.email} />
                </div>
                <div className="formItem">
                  <label className="formTitle" htmlFor="password">
                    Password
                  </label>
                  <input className="formInput" type="password" id="password" name="password" placeholder="********" />
                </div>
                <div className="formItem">
                  <label className="formTitle" htmlFor="confirmPassword">
                    Confirm Password
                  </label>
                  <input className="formInput" type="password" id="confirmPassword" name="confirmPassword" placeholder="********" />
                </div>
                <div className="formItem">
                  <label className="formTitle" htmlFor="phone">
                    Phone Number
                  </label>
                  <input className="formInput" type="text" id="phone" name="phone" placeholder={player.phone} />
                </div>
                <button className="profileChangeButton" id="emailChangeButton" onClick={handleDataChange}>Update Player Data</button>
                <p id="error" className="error" hidden>
                  This is an error.
                </p>
                <p id="success" className="success" hidden>
                  Success?
                </p>
              </div>
              <div className="profileRating">
                <div className="ratingBox">
                  <h3>Single Rating</h3>
                  <p id="singlesRatingText">{player.singlesRating}</p>
                </div>
                <div className="ratingBox">
                  <h3>Double Rating</h3>
                  <p id="doublesRatingText">{player.doublesRating}</p>
                </div>
              </div>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <div className="profileInfo">
                <h1>Profile</h1>
                <h3>Username:</h3>
                <p>{player.playerName}</p>
                <h3>Phone Number:</h3>
                <p>{player.phone}</p>
                <h3>Email:</h3>
                <p>{player.email}</p>
              </div>
              <div className="profileRating">
                <div className="ratingBox">
                  <h3>Single Rating</h3>
                  <p>{player.singlesRating}</p>
                </div>
                <div className="ratingBox">
                  <h3>Double Rating</h3>
                  <p>{player.doublesRating}</p>
                </div>
              </div>
            </React.Fragment>
          )}
          <div className="matchHistory">
            <h1>Match History</h1>
            <table>
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Round</th>
                  <th>Match Time</th>
                  <th>Team 1</th>
                  <th>Team 1 Score</th>
                  <th>Team 2</th>
                  <th>Team 2 Score</th>
                </tr>
              </thead>
              <tbody>
                {player.matchhistory.map((match, i) => {
                  return (
                    <tr key="{i}" className="winner-{{this.didWin}}">
                      <td>{match.eventName}</td>
                      <td>{match.in_round}</td>
                      <td>{match.eventTime}</td>
                      <td>{match.team1}</td>
                      <td>{match.team1Score}</td>
                      <td>{match.team2}</td>
                      <td>{match.team2Score}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <script src="https://code.jquery.com/jquery-2.2.4.min.js" integrity="sha256-BbhdlvQf/xTY9gja0Dq3HiwQF8LaCRTXxZKRutelT44=" crossOrigin="anonymous"></script>
            <script src="../public/js/profile_update.js"></script>
          </div>
        </div>
      </section>
    );
  }
};

export default PlayerProfile;
