import React, { useState, useEffect, useRef, memo, useCallback } from "react";
import {
  Animated,
  StyleSheet,
  Image,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  SafeAreaView,
  Clipboard,
  ImageBackground,
  I18nManager,
} from "react-native";
import { Dimensions, Platform, AsyncStorage } from "react-native";
import { isTablet } from "react-native-device-detection";
import { Icon } from "react-native-elements";
import { AnimateTictactoeCell } from "../component/AnimateTictactoeCell";
import { AnimateTictactoePlayerView } from "../component/AnimateTictactoePlayerView";
import { AnimateTictactoeStart } from "../component/AnimateTictactoeStart";
import { ColumnAnimateButton } from "../component/ColumnAnimateButton";
import { BackButton } from "../component/BackButton";

import {
  AdMobBanner,
  AdMobInterstitial,
  PublisherBanner,
  AdMobRewarded,
  setTestDeviceIDAsync,
} from "expo-ads-admob";

import * as Analytics from "expo-firebase-analytics";

const screen = Dimensions.get("window");
const screenW = screen.width;
const screenH = screen.height;
const padding = 15;
let tictactoeViewWidth =
  screenW < screenH ? screenW - padding : screenH - padding;
tictactoeViewWidth = isTablet ? tictactoeViewWidth / 1.2 : tictactoeViewWidth;
tictactoeViewWidth =
  screenH <= 667 && screenW < screenH
    ? screenW / 1.05 - padding
    : tictactoeViewWidth;

export default function GameScreen({ navigation, route }) {
  const { mode, ai, p1, p2, game, id, turn, p1History, p2History, gamedRound } =
    route.params;
  const com = 0;
  const vs = 1;
  const player1 = 1;
  const player2 = 2;
  const [row, setRow] = useState(3);
  const [collect, setCollect] = useState(3);
  const [tictactoeRow, setTictactoeRow] = useState(3);
  const [tictactoeCollect, setTictactoeCollect] = useState(3);
  const selectScrollView = useRef(null);
  const [cell, setCell] = useState([]);
  const [cellCell, setCellCell] = useState([]);
  const [gameHistory, setGameHistory] = useState([]);
  const [player1GameHistory, setPlayer1GameHistory] = useState({});
  const [player2GameHistory, setPlayer2GameHistory] = useState({});
  const [comLevel, setComLevel] = useState(0);
  const [playerTurn, setPlayerTurn] = useState(player1);
  const [round, setRound] = useState([]);
  const [lastSelect, setLastSelect] = useState(null);
  const [lastSelectCell, setLastSelectCell] = useState(null);
  const [zoomInCell, setZoomInCell] = useState(true);
  const [zoomingCell, setZoomingCell] = useState(null);
  const zoomInDuration = 888;
  const [gameLevel, setGameLevel] = useState(2);
  const [lastSelectGameLevel, setLastSelectGameLevel] = useState(null);
  const [player1Img, setPlayer1Img] = useState(null);
  const [player2Img, setPlayer2Img] = useState(null);
  const [player1Name, setPlayer1Name] = useState("Player1");
  const [player2Name, setPlayer2Name] = useState("Player2");
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [gameId, setGameId] = useState(null);
  const [endGame, setEndGame] = useState(false);
  const [startGame, setStartGame] = useState(false);
  const [cellCollected, setCellCollected] = useState({});

  const Anim1 = useRef(new Animated.Value(1)).current;
  const Anim2 = useRef(new Animated.Value(0)).current;
  const Anim3 = useRef(new Animated.Value(0)).current;
  const Anim4 = useRef(new Animated.Value(1)).current;

  // ios banner id: ca-app-pub-xxxxxxx/xxxxxx
  // android banner id: ca-app-pub-xxxxxxx/xxxxxx
  const bannerID =
    Platform.OS === "ios"
      ? "ca-app-pub-xxxxxxx/xxxxxx"
      : "ca-app-pub-xxxxxxx/xxxxxx";
  // ios interstitial id: ca-app-pub-xxxxxxx/xxxxxx
  // android interstitial id: ca-app-pub-xxxxxxx/xxxxxx
  const interstitialID =
    Platform.OS === "ios"
      ? "ca-app-pub-xxxxxxx/xxxxxx"
      : "ca-app-pub-xxxxxxx/xxxxxx";

  async function asyncCall() {
    await Analytics.setCurrentScreen("GameScreen");
  }

  const setRecord = (objData) => {
    AsyncStorage.getItem("history", (err, result) => {
      if (result !== null) {
        var obj = JSON.parse(result);
        var newObj = { ...obj, ...objData };
        AsyncStorage.setItem("history", JSON.stringify(newObj));
      } else {
        AsyncStorage.setItem("history", JSON.stringify(objData));
      }
    });
  };

  useEffect(() => {
    asyncCall();

    let tmp_gameHistory = {
      mode: mode,
      ai: ai,
      p1: p1,
      p2: p2,
      game: game,
      player1GameHistory: {},
      player2GameHistory: {},
      id: id,
      turn: turn,
      gamedRound: gamedRound,
    };
    let tmp_cell = [];
    let tmp_player1gameHistory = {};
    let tmp_player2gameHistory = {};
    for (let i = 0; i < tictactoeRow * tictactoeRow; i++) {
      tmp_cell.push(i);
      tmp_player1gameHistory[i] = [];
      tmp_player2gameHistory[i] = [];
      if (i == tictactoeRow * tictactoeRow - 1) {
        tmp_player1gameHistory["win"] = [];
        tmp_player2gameHistory["win"] = [];
      }
    }
    tmp_gameHistory["player1GameHistory"] = tmp_player1gameHistory;
    tmp_gameHistory["player2GameHistory"] = tmp_player2gameHistory;
    if (p1History) {
      tmp_player1gameHistory = p1History;
      tmp_player2gameHistory = p2History;
      tmp_gameHistory.player1GameHistory = p1History;
      tmp_gameHistory.player2GameHistory = p2History;
      setLastSelectCell(game.lastSelectCell);
      setZoomingCell(game.zoomingCell);
      setEndGame(game.endGame);
      setCellCollected(game.cellCollected);
    }
    if (game.gameLevel == 1) {
      tmp_cell = [0];
      setTictactoeCollect(1);
      setLastSelectCell(0);
      setZoomingCell(0);
      tmp_gameHistory["game"]["lastSelectCell"] = 0;
      tmp_gameHistory["game"]["zoomingCell"] = 0;
      tmp_gameHistory["game"]["lastSelectGameLevel"] = 1;
    }
    setGameId(id);
    setPlayerTurn(turn);
    setPlayer1GameHistory({ ...player1GameHistory, ...tmp_player1gameHistory });
    setPlayer2GameHistory({ ...player2GameHistory, ...tmp_player2gameHistory });
    setGameHistory({ ...gameHistory, ...tmp_gameHistory });
    setCell(tmp_cell);
    setPlayer1Img(p1.img);
    setPlayer2Img(p2.img);
    setPlayer1Name(p1.name);
    setPlayer2Name(p2.name);
    setPlayer1Score(p1.score);
    setPlayer2Score(p2.score);
    setComLevel(ai.level);
    setRound(gamedRound);
    let tmp_cell_cell = [];
    for (let i = 0; i < game.row * game.row; i++) {
      tmp_cell_cell.push(i);
    }
    setCellCell(tmp_cell_cell);
    setRow(game.row);
    setCollect(game.collect);
    setGameLevel(game.gameLevel);
    setLastSelectGameLevel(game.lastSelectGameLevel);

    navigation.addListener("beforeRemove", (e) => {
      if (e.data.action.payload.name != "Index") {
        e.preventDefault();
      } else {
        navigation.dispatch(e.data.action);
      }
    });
  }, []);

  useEffect(() => {
    if (lastSelectCell == null || startGame == false) {
    } else {
      let updatePlayer1GameHistory = {
        player1GameHistory: player1GameHistory,
        turn: playerTurn,
      };
      setGameHistory({ ...gameHistory, ...updatePlayer1GameHistory });
      if (checkWin(player1GameHistory[lastSelectCell], collect, player1)) {
        goLevel(2, false);
        playerWin(player1GameHistory, setPlayer1GameHistory, lastSelectCell);
        setRound([...round, lastSelectCell]);
      } else if (
        checkDraw(
          player1GameHistory[lastSelectCell],
          player2GameHistory[lastSelectCell]
        )
      ) {
        goLevel(2, false);
        setRound([...round, lastSelectCell]);
      } else {
        //computer
        checkIsComputerTurn();
      }
    }
  }, [player1GameHistory]);

  useEffect(() => {
    if (lastSelectCell == null || startGame == false) {
    } else {
      let updatePlayer2GameHistory = {
        player2GameHistory: player2GameHistory,
        turn: playerTurn,
      };
      setGameHistory({ ...gameHistory, ...updatePlayer2GameHistory });
      if (checkWin(player2GameHistory[lastSelectCell], collect, player2)) {
        goLevel(2, false);
        playerWin(player2GameHistory, setPlayer2GameHistory, lastSelectCell);
        setRound([...round, lastSelectCell]);
      } else if (
        checkDraw(
          player1GameHistory[lastSelectCell],
          player2GameHistory[lastSelectCell]
        )
      ) {
        goLevel(2, false);
        setRound([...round, lastSelectCell]);
      } else {
      }
    }
  }, [player2GameHistory]);

  useEffect(() => {
    if (round.length != 0) {
      if (checkWin(player1GameHistory["win"], tictactoeCollect, player1)) {
        setPlayer1Score(player1Score + 1);
        setEndGame(true);
      } else if (
        checkWin(player2GameHistory["win"], tictactoeCollect, player2)
      ) {
        setPlayer2Score(player2Score + 1);
        setEndGame(true);
      } else if (round.length >= tictactoeCollect * tictactoeCollect) {
        setEndGame(true);
      }
    }
  }, [round]);

  useEffect(() => {
    if (startGame) {
      AsyncStorage.getItem("playerScore", (err, result) => {
        var objData = { [id]: { p1: player1Score, p2: player2Score } };
        if (result !== null) {
          var obj = JSON.parse(result);
          var newObj = { ...obj, ...objData };
          console.log(newObj);
          AsyncStorage.setItem("playerScore", JSON.stringify(newObj));
        } else {
          AsyncStorage.setItem("playerScore", JSON.stringify(objData));
        }
      });
    }
  }, [player1Score, player2Score]);

  useEffect(() => {
    if (startGame) {
      let updateGameHistory = {};
      updateGameHistory["game"] = {
        ...gameHistory.game,
        ...{
          endGame: endGame,
          row: gameHistory.game.row,
          collect: gameHistory.game.collect,
          gameLevel: gameHistory.game.gameLevel,
          lastSelectCell: lastSelectCell,
          lastSelectGameLevel: lastSelectCell == null ? 2 : 1,
          zoomingCell: lastSelectCell,
        },
      };
      updateGameHistory["gamedRound"] = round;
      updateGameHistory["player1GameHistory"] = player1GameHistory;
      updateGameHistory["player2GameHistory"] = player2GameHistory;
      setGameHistory({ ...gameHistory, ...updateGameHistory });
    }
  }, [endGame]);

  useEffect(() => {
    checkIsComputerTurn();
  }, [startGame]);

  useEffect(() => {
    if (gameId) {
      setRecord({ [gameId]: gameHistory });
    }
  }, [gameHistory]);

  useEffect(() => {
    if (startGame) {
      AsyncStorage.getItem("cellCollected", (err, result) => {
        var objData = { [gameId]: cellCollected };
        if (result !== null) {
          var obj = JSON.parse(result);
          var newObj = { ...obj, ...objData };
          console.log(newObj);
          AsyncStorage.setItem("cellCollected", JSON.stringify(newObj));
        } else {
          AsyncStorage.setItem("cellCollected", JSON.stringify(objData));
        }
      });
    }
  }, [cellCollected]);

  useEffect(() => {
    pointCell();
  }, [lastSelectGameLevel]);

  useEffect(() => {
    if (startGame) {
      AsyncStorage.getItem("lastSelectCell", (err, result) => {
        var objData = { [gameId]: lastSelectCell };
        if (result !== null) {
          var obj = JSON.parse(result);
          var newObj = { ...obj, ...objData };
          AsyncStorage.setItem("lastSelectCell", JSON.stringify(newObj));
        } else {
          AsyncStorage.setItem("lastSelectCell", JSON.stringify(objData));
        }
      });
    }
  }, [lastSelectCell]);

  Array.prototype.diff = function (a) {
    return this.filter(function (i) {
      return a.indexOf(i) < 0;
    });
  };

  const resetGame = (newPlayerTurn = player1) => {
    Analytics.logEvent("ButtonPress", {
      name: "Play again",
      screen: "GameScreen",
      purpose: "play again",
    }).catch((err) => {
      //err
      console.log(err);
    });

    let tmp_cell = [];
    let tmp_player1gameHistory = {};
    let tmp_player2gameHistory = {};
    for (let i = 0; i < tictactoeRow * tictactoeRow; i++) {
      tmp_cell.push(i);
      tmp_player1gameHistory[i] = [];
      tmp_player2gameHistory[i] = [];
      if (i == tictactoeRow * tictactoeRow - 1) {
        tmp_player1gameHistory["win"] = [];
        tmp_player2gameHistory["win"] = [];
      }
    }
    if (game.gameLevel == 1) {
      tmp_cell = [0];
      // setLastSelectGameLevel(1);
      setLastSelectCell(0);
      setZoomingCell(0);
    }
    setRound([]);
    setEndGame(false);
    setCell(tmp_cell);
    let tmp_cell_cell = [];
    for (let i = 0; i < game.row * game.row; i++) {
      tmp_cell_cell.push(i);
    }
    setCellCollected({});
    setCellCell(tmp_cell_cell);
    setLastSelectGameLevel(game.gameLevel);
    setPlayer1GameHistory({ ...player1GameHistory, ...tmp_player1gameHistory });
    setPlayer2GameHistory({ ...player2GameHistory, ...tmp_player2gameHistory });

    let updateGameHistory = {
      player1GameHistory: tmp_player1gameHistory,
      player2GameHistory: tmp_player2gameHistory,
      turn: newPlayerTurn,
      gamedRound: [],
    };
    setGameHistory({ ...gameHistory, ...updateGameHistory });
  };

  const checkIsComputerTurn = () => {
    if (playerTurn == player2 && mode == com && !endGame && startGame) {
      setTimeout(function () {
        if (lastSelectCell == null && lastSelectGameLevel == 2) {
          let canChoose = cell
            .diff(player1GameHistory["win"])
            .diff(player2GameHistory["win"])
            .diff(round);
          computer(
            player1GameHistory["win"],
            player2GameHistory["win"],
            canChoose,
            tictactoeRow
          );
        } else if (lastSelectCell !== null) {
          let canChoose = cellCell
            .diff(player1GameHistory[lastSelectCell])
            .diff(player2GameHistory[lastSelectCell]);
          computer(
            player1GameHistory[lastSelectCell],
            player2GameHistory[lastSelectCell],
            canChoose,
            row
          );
        }
      }, 222 * 6);
    }
  };

  const computer = (player1History, player2History, canChoose, row) => {
    let choose = null;
    if (comLevel == 1) {
      choose = computerAtk(canChoose, player1History, player2History, row);
    } else if (comLevel == 2) {
      choose = computerDef(canChoose, player1History, row);
      if (choose === false) {
        choose = computerAtk(canChoose, player1History, player2History, row);
      }
    } else if (comLevel == 3) {
      choose = computerAtk(canChoose, player1History, player2History, row);
      if (choose === false) {
        choose = computerDef(canChoose, player1History, row);
      }
    } else {
      choose = canChoose[Math.floor(Math.random() * canChoose.length)];
    }
    if (choose === false || isNaN(choose)) {
      choose = canChoose[Math.floor(Math.random() * canChoose.length)];
    }
    if (lastSelectGameLevel == 1) {
      clickTictactoeCell(choose);
    } else {
      selectCell(choose);
    }
  };

  const computerAtk = (canChoose, player1History, player2History, row) => {
    const mid1 = (row * row) / 2 - row / 2 - 1;
    const mid2 = (row * row) / 2 + row / 2;
    const mid3 = (row * row - 1) / 2;
    const min = 0;
    const max = row * row;
    if ((row * row) % 2 == 0) {
      if (player1History.length <= 1 && canChoose.includes(mid1)) {
        return mid1;
      } else if (player1History.length <= 1 && canChoose.includes(mid2)) {
        return mid2;
      }
    } else {
      if (player1History.length <= 1 && canChoose.includes(mid3)) {
        return mid3;
      }
    }
    for (let value of player2History.sort()) {
      let collected = {
        horizontal: 1,
        vertical: 1,
        left_slash: 1,
        right_slash: 1,
        back_horizontal: 1,
        back_vertical: 1,
        back_left_slash: 1,
        back_right_slash: 1,
      };
      let less = {
        horizontal: null,
        vertical: null,
        left_slash: null,
        right_slash: null,
        back_horizontal: null,
        back_vertical: null,
        back_left_slash: null,
        back_right_slash: null,
      };
      for (let pos = 1; pos < collect; pos++) {
        if (Math.floor((value + pos) / row) == Math.floor(value / row)) {
          if (player2History.includes(value + pos)) {
            collected.horizontal++;
          } else {
            less.horizontal =
              less.horizontal == null ? value + pos : less.horizontal;
          }
        }
        if (Math.floor((value - pos) / row) == Math.floor(value / row)) {
          if (player2History.includes(value - pos)) {
            collected.back_horizontal++;
          } else {
            less.back_horizontal =
              less.back_horizontal == null ? value - pos : less.back_horizontal;
          }
        }
        if (Math.floor((value + pos * row) % row) == Math.floor(value % row)) {
          if (player2History.includes(value + pos * row)) {
            collected.vertical++;
          } else {
            less.vertical =
              less.vertical == null ? value + pos * row : less.vertical;
          }
        }
        if (Math.floor((value - pos * row) % row) == Math.floor(value % row)) {
          if (player2History.includes(value - pos * row)) {
            collected.back_vertical++;
          } else {
            less.back_vertical =
              less.back_vertical == null
                ? value - pos * row
                : less.back_vertical;
          }
        }
        if (
          Math.floor((value + pos * row - pos) / row) ==
            Math.floor(value / row) + pos &&
          Math.floor((value + pos * row - pos) % row) ==
            Math.floor(value % row) - pos
        ) {
          if (player2History.includes(value + pos * row - pos)) {
            collected.left_slash++;
          } else {
            less.left_slash =
              less.left_slash == null
                ? value + pos * row - pos
                : less.left_slash;
          }
        }
        if (
          Math.floor((value - pos * row + pos) / row) ==
            Math.floor(value / row) - pos &&
          Math.floor((value - pos * row + pos) % row) ==
            Math.floor(value % row) + pos
        ) {
          if (player2History.includes(value - pos * row + pos)) {
            collected.back_left_slash++;
          } else {
            less.back_left_slash =
              less.back_left_slash == null
                ? value - pos * row + pos
                : less.back_left_slash;
          }
        }
        if (
          Math.floor((value + pos * row + pos) / row) ==
            Math.floor(value / row) + pos &&
          Math.floor((value + pos * row + pos) % row) ==
            Math.floor(value % row) + pos
        ) {
          if (player2History.includes(value + pos * row + pos)) {
            collected.right_slash++;
          } else {
            less.right_slash =
              less.right_slash == null
                ? value + pos * row + pos
                : less.right_slash;
          }
        }
        if (
          Math.floor((value - pos * row - pos) / row) ==
            Math.floor(value / row) - pos &&
          Math.floor((value - pos * row - pos) % row) ==
            Math.floor(value % row) - pos
        ) {
          if (player2History.includes(value - pos * row - pos)) {
            collected.back_right_slash++;
          } else {
            less.back_right_slash =
              less.back_right_slash == null
                ? value - pos * row - pos
                : less.back_right_slash;
          }
        }
      }
      if (
        collected.horizontal + 1 >= collect &&
        canChoose.includes(less.horizontal) &&
        less.horizontal < max
      ) {
        return parseInt(less.horizontal);
      } else if (
        collected.vertical + 1 >= collect &&
        canChoose.includes(less.vertical) &&
        less.vertical < max
      ) {
        return parseInt(less.vertical);
      } else if (
        collected.left_slash + 1 >= collect &&
        canChoose.includes(less.left_slash) &&
        less.left_slash < max
      ) {
        return parseInt(less.left_slash);
      } else if (
        collected.right_slash + 1 >= collect &&
        canChoose.includes(less.right_slash) &&
        less.right_slash < max
      ) {
        return parseInt(less.right_slash);
      } else if (
        collected.back_horizontal + 1 >= collect &&
        canChoose.includes(less.back_horizontal) &&
        less.back_horizontal < max
      ) {
        return parseInt(less.back_horizontal);
      } else if (
        collected.back_vertical + 1 >= collect &&
        canChoose.includes(less.back_vertical) &&
        less.back_vertical < max
      ) {
        return parseInt(less.back_vertical);
      } else if (
        collected.back_left_slash + 1 >= collect &&
        canChoose.includes(less.back_left_slash) &&
        less.back_left_slash < max
      ) {
        return parseInt(less.back_left_slash);
      } else if (
        collected.back_right_slash + 1 >= collect &&
        canChoose.includes(less.back_right_slash) &&
        less.back_right_slash < max
      ) {
        return parseInt(less.back_right_slash);
      }
    }
    return false;
  };

  const computerDef = (canChoose, player1History, row) => {
    let min = 0;
    let max = row * row;
    let risk = { high: [], medium: [], low: [], trivial: [] };
    for (let value of player1History) {
      let collected = {
        horizontal: 1,
        vertical: 1,
        left_slash: 1,
        right_slash: 1,
      };
      for (let pos = 1; pos < collect; pos++) {
        if (
          player1History.includes(value + pos) &&
          Math.floor((value + pos) / row) == Math.floor(value / row)
        ) {
          collected.horizontal++;
        }
        if (
          player1History.includes(value + pos * row) &&
          Math.floor((value + pos * row) % row) == Math.floor(value % row)
        ) {
          collected.vertical++;
        }
        if (
          player1History.includes(value + pos * row - pos) &&
          Math.floor((value + pos * row - pos) / row) ==
            Math.floor(value / row) + pos &&
          Math.floor((value + pos * row - pos) % row) ==
            Math.floor(value % row) - pos
        ) {
          collected.left_slash++;
        }
        if (
          player1History.includes(value + pos * row + pos) &&
          Math.floor((value + pos * row + pos) / row) ==
            Math.floor(value / row) + pos &&
          Math.floor((value + pos * row + pos) % row) ==
            Math.floor(value % row) + pos
        ) {
          collected.right_slash++;
        }
      }
      //high
      if (collected.horizontal + 1 >= collect) {
        if (
          Math.floor((value - 1) / row) == Math.floor(value / row) &&
          Math.floor(value - 1) >= min
        ) {
          risk["high"].push(Math.floor(value - 1));
        }
        if (comLevel == 3) {
          for (let i = 1; i <= collected.horizontal; i++) {
            if (
              Math.floor((value + i) / row) == Math.floor(value / row) &&
              Math.floor(value + i) < max
            ) {
              risk["high"].push(Math.floor(value + i));
            }
          }
        } else if (
          Math.floor((value + collected.horizontal) / row) ==
            Math.floor(value / row) &&
          Math.floor(value + collected.horizontal) < max
        ) {
          risk["high"].push(Math.floor(value + collected.horizontal));
        }
      }
      if (collected.vertical + 1 >= collect) {
        if (
          Math.floor((value - 1 * row) % row) == Math.floor(value % row) &&
          Math.floor(value - 1 * row) >= min
        ) {
          risk["high"].push(Math.floor(value - 1 * row));
        }
        if (comLevel == 3) {
          for (let i = 1; i <= collected.vertical; i++) {
            if (
              Math.floor((value + i * row) % row) == Math.floor(value % row) &&
              Math.floor(value + i * row) < max
            ) {
              risk["high"].push(Math.floor(value + i * row));
            }
          }
        } else if (
          Math.floor((value + collected.vertical * row) % row) ==
            Math.floor(value % row) &&
          Math.floor(value + collected.vertical * row) < max
        ) {
          risk["high"].push(Math.floor(value + collected.vertical * row));
        }
      }
      if (collected.left_slash + 1 >= collect) {
        if (
          Math.floor((value - 1 * row + 1) / row) ==
            Math.floor(value / row) - 1 &&
          Math.floor((value - 1 * row + 1) / row) >= min
        ) {
          risk["high"].push(Math.floor(value - 1 * row + 1));
        }
        if (comLevel == 3) {
          for (let i = 1; i <= collected.left_slash; i++) {
            if (
              Math.floor((value + i * row - i) / row) ==
                Math.floor(value / row) + i &&
              Math.floor(value + i * row - i) < max
            ) {
              risk["high"].push(Math.floor(value + i * row - i));
            }
          }
        } else if (
          Math.floor(
            (value + collected.left_slash * row - collected.left_slash) / row
          ) ==
            Math.floor(value / row) + collected.left_slash &&
          Math.floor(
            value + collected.left_slash * row - collected.left_slash
          ) < max
        ) {
          risk["high"].push(
            Math.floor(
              value + collected.left_slash * row - collected.left_slash
            )
          );
        }
      }
      if (collected.right_slash + 1 >= collect) {
        if (
          Math.floor((value - 1 * row - 1) / row) ==
            Math.floor(value / row) - 1 &&
          Math.floor((value - 1 * row - 1) / row) >= min
        ) {
          risk["high"].push(Math.floor(value - 1 * row - 1));
        }
        if (comLevel == 3) {
          for (let i = 1; i <= collected.right_slash; i++) {
            if (
              Math.floor((value + i * row + i) / row) ==
                Math.floor(value / row) + i &&
              Math.floor(value + i * row + i) < max
            ) {
              risk["high"].push(Math.floor(value + i * row + i));
            }
          }
        } else if (
          Math.floor(
            (value + collected.right_slash * row + collected.right_slash) / row
          ) ==
            Math.floor(value / row) + collected.right_slash &&
          Math.floor(
            value + collected.right_slash * row + collected.right_slash
          ) < max
        ) {
          risk["high"].push(
            Math.floor(
              value + collected.right_slash * row + collected.right_slash
            )
          );
        }
      }
      //medium
      if (collected.horizontal + 2 >= collect) {
        if (
          Math.floor((value - 1) / row) == Math.floor(value / row) &&
          Math.floor(value - 1) >= min
        ) {
          risk["medium"].push(Math.floor(value - 1));
        }
        if (comLevel == 3) {
          for (let i = 1; i <= collected.horizontal; i++) {
            if (
              Math.floor((value + i) / row) == Math.floor(value / row) &&
              Math.floor(value + i) < max
            ) {
              risk["medium"].push(Math.floor(value + i));
            }
          }
        } else if (
          Math.floor((value + collected.horizontal) / row) ==
            Math.floor(value / row) &&
          Math.floor(value + collected.horizontal) < max
        ) {
          risk["medium"].push(Math.floor(value + collected.horizontal));
        }
      }
      if (collected.vertical + 2 >= collect) {
        if (
          Math.floor((value - 1 * row) % row) == Math.floor(value % row) &&
          Math.floor(value - 1 * row) >= min
        ) {
          risk["medium"].push(Math.floor(value - 1 * row));
        }
        if (comLevel == 3) {
          for (let i = 1; i <= collected.vertical; i++) {
            if (
              Math.floor((value + i * row) % row) == Math.floor(value % row) &&
              Math.floor(value + i * row) < max
            ) {
              risk["medium"].push(Math.floor(value + i * row));
            }
          }
        } else if (
          Math.floor((value + collected.vertical * row) % row) ==
            Math.floor(value % row) &&
          Math.floor(value + collected.vertical * row) < max
        ) {
          risk["medium"].push(Math.floor(value + collected.vertical * row));
        }
      }
      if (collected.left_slash + 2 >= collect) {
        if (
          Math.floor((value - 1 * row + 1) / row) ==
            Math.floor(value / row) - 1 &&
          Math.floor((value - 1 * row + 1) / row) >= min
        ) {
          risk["medium"].push(Math.floor(value - 1 * row + 1));
        }
        if (comLevel == 3) {
          for (let i = 1; i <= collected.left_slash; i++) {
            if (
              Math.floor((value + i * row - i) / row) ==
                Math.floor(value / row) + i &&
              Math.floor(value + i * row - i) < max
            ) {
              risk["medium"].push(Math.floor(value + i * row - i));
            }
          }
        } else if (
          Math.floor(
            (value + collected.left_slash * row - collected.left_slash) / row
          ) ==
            Math.floor(value / row) + collected.left_slash &&
          Math.floor(
            value + collected.left_slash * row - collected.left_slash
          ) < max
        ) {
          risk["medium"].push(
            Math.floor(
              value + collected.left_slash * row - collected.left_slash
            )
          );
        }
      }
      if (collected.right_slash + 2 >= collect) {
        if (
          Math.floor((value - 1 * row - 1) / row) ==
            Math.floor(value / row) - 1 &&
          Math.floor((value - 1 * row - 1) / row) >= min
        ) {
          risk["medium"].push(Math.floor(value - 1 * row - 1));
        }
        if (comLevel == 3) {
          for (let i = 1; i <= collected.right_slash; i++) {
            if (
              Math.floor((value + i * row + i) / row) ==
                Math.floor(value / row) + i &&
              Math.floor(value + i * row + i) < max
            ) {
              risk["medium"].push(Math.floor(value + i * row + i));
            }
          }
        } else if (
          Math.floor(
            (value + collected.right_slash * row + collected.right_slash) / row
          ) ==
            Math.floor(value / row) + collected.right_slash &&
          Math.floor(
            value + collected.right_slash * row + collected.right_slash
          ) < max
        ) {
          risk["medium"].push(
            Math.floor(
              value + collected.right_slash * row + collected.right_slash
            )
          );
        }
      }
      //low
      if (
        Math.floor((value - 1) / row) == Math.floor(value / row) &&
        Math.floor(value - 1) >= min
      ) {
        risk["trivial"].push(Math.floor(value - 1));
      }
      if (
        Math.floor((value + 1) / row) == Math.floor(value / row) &&
        Math.floor(value + 1) < max
      ) {
        risk["trivial"].push(Math.floor(value + 1));
      }
      if (
        Math.floor((value - 1 * row) % row) == Math.floor(value % row) &&
        Math.floor(value - 1 * row) >= min
      ) {
        risk["trivial"].push(Math.floor(value - 1 * row));
      }
      if (
        Math.floor((value + 1 * row) % row) == Math.floor(value % row) &&
        Math.floor(value + 1 * row) < max
      ) {
        risk["trivial"].push(Math.floor(value + 1 * row));
      }
      if (
        Math.floor((value - 1 * row + 1) / row) ==
          Math.floor(value / row) - 1 &&
        Math.floor((value - 1 * row + 1) / row) >= min
      ) {
        risk["low"].push(Math.floor(value - 1 * row + 1));
      }
      if (
        Math.floor((value + 1 * row - 1) / row) ==
          Math.floor(value / row) + 1 &&
        Math.floor(value + 1 * row - 1) < max
      ) {
        risk["low"].push(Math.floor(value + 1 * row - 1));
      }
      if (
        Math.floor((value - 1 * row - 1) / row) ==
          Math.floor(value / row) - 1 &&
        Math.floor((value - 1 * row - 1) / row) >= min
      ) {
        risk["low"].push(Math.floor(value - 1 * row - 1));
      }
      if (
        Math.floor((value + 1 * row + 1) / row) ==
          Math.floor(value / row) + 1 &&
        Math.floor(value + 1 * row + 1) < max
      ) {
        risk["low"].push(Math.floor(value + 1 * row + 1));
      }
    }
    risk["high"] = risk["high"].sort(function () {
      return 0.5 - Math.random();
    });
    for (let index in risk["high"]) {
      if (canChoose.includes(risk["high"][index])) {
        return risk["high"][index];
      }
    }
    let special_check = findMaxDuplicateInArray(risk["medium"], canChoose);
    if (comLevel == 3 && special_check !== false) {
      return special_check;
    }
    risk["medium"] = risk["medium"].sort(function () {
      return 0.5 - Math.random();
    });
    for (let index in risk["medium"]) {
      if (canChoose.includes(risk["medium"][index])) {
        return risk["medium"][index];
      }
    }
    risk["low"] = risk["low"].sort(function () {
      return 0.5 - Math.random();
    });
    for (let index in risk["low"]) {
      if (canChoose.includes(risk["low"][index])) {
        return risk["low"][index];
      }
    }
    risk["trivial"] = risk["trivial"].sort(function () {
      return 0.5 - Math.random();
    });
    for (let index in risk["trivial"]) {
      if (canChoose.includes(risk["trivial"][index])) {
        return risk["trivial"][index];
      }
    }
    return false;
  };

  const findMaxDuplicateInArray = (arr, canChoose) => {
    if (arr.length <= 0) {
      return false;
    }
    arr = arr.sort();
    var max_num,
      max_count = -1;
    var count = {};
    arr.forEach(function (i) {
      count[i] = (count[i] || 0) + 1;
    });
    for (let index in count) {
      if (count[index] >= max_count && canChoose.includes(parseInt(index))) {
        max_num = index;
        max_count = count[index];
      }
    }
    return parseInt(max_num);
  };

  const goLevel = (goto = 2, immediately = true) => {
    setLastSelectCell(null);
    if (gameLevel == 1) {
    } else {
      let time = 222 * 6;
      if (immediately) {
        time = 1;
      }
      setTimeout(function () {
        setLastSelectGameLevel(goto);
      }, time);
    }
  };

  const checkDraw = (player1History, player2History) => {
    if (row * row == player1History.length + player2History.length) {
      return true;
    }
    return false;
  };

  const checkWin = (history, collect) => {
    if (history.length == 0 || startGame == false) {
      return false;
    }
    history = history.sort();
    let collected;
    let pass = false;
    let result = {};
    for (let value of history) {
      collected = {
        horizontal: [value],
        vertical: [value],
        left_slash: [value],
        right_slash: [value],
      };
      for (let pos = 1; pos <= collect - 1; pos++) {
        if (
          history.includes(value + pos) &&
          Math.floor((value + pos) / row) == Math.floor(value / row)
        ) {
          collected.horizontal.push(value + pos);
        }
        if (
          history.includes(value + pos * row) &&
          Math.floor((value + pos * row) % row) == Math.floor(value % row)
        ) {
          collected.vertical.push(value + pos * row);
        }
        if (
          history.includes(value + pos * row - pos) &&
          Math.floor((value + pos * row - pos) / row) ==
            Math.floor(value / row) + pos &&
          Math.floor((value + pos * row - pos) % row) ==
            Math.floor(value % row) - pos
        ) {
          collected.left_slash.push(value + pos * row - pos);
        }
        if (
          history.includes(value + pos * row + pos) &&
          Math.floor((value + pos * row + pos) / row) ==
            Math.floor(value / row) + pos &&
          Math.floor((value + pos * row + pos) % row) ==
            Math.floor(value % row) + pos
        ) {
          collected.right_slash.push(value + pos * row + pos);
        }
      }
      if (collected.horizontal.length >= collect) {
        result["horizontal"] = collected.horizontal;
        pass = true;
      }
      if (collected.vertical.length >= collect) {
        result["vertical"] = collected.vertical;
        pass = true;
      }
      if (collected.left_slash.length >= collect) {
        result["left_slash"] = collected.left_slash;
        pass = true;
      }
      if (collected.right_slash.length >= collect) {
        result["right_slash"] = collected.right_slash;
        pass = true;
      }
    }
    if (pass) {
      console.log(result);
      setCellCollected({ ...cellCollected, ...{ [lastSelectCell]: result } });
      return true;
    }
    return false;
  };

  const playerWin = (history, updateHistory, cell) => {
    let newHistory = history;
    newHistory["win"].push(cell);
    updateHistory({ ...history, ...newHistory });
  };

  const RenderCell = useCallback(() => {
    return cell.map((index) => {
      return (
        <AnimateTictactoeCell
          index={index}
          selectCell={selectCell}
          gameLevel={gameLevel}
          lastSelectGameLevel={lastSelectGameLevel}
          lastSelectCell={lastSelectCell}
          player1GameHistory={player1GameHistory}
          player2GameHistory={player2GameHistory}
          round={round}
          player1Img={player1Img}
          player2Img={player2Img}
          tictactoeViewWidth={tictactoeViewWidth}
          tictactoeRow={tictactoeRow}
          mode={mode}
          cellCell={cellCell}
          row={row}
          lastSelect={lastSelect}
          clickTictactoeCell={clickTictactoeCell}
          playerTurn={playerTurn}
          display={
            zoomingCell != index && lastSelectGameLevel == 1 ? false : true
          }
          displaying={
            lastSelectGameLevel == 1 ||
            zoomingCell == index ||
            zoomingCell == null
              ? true
              : false
          }
          zoomInCell={zoomInCell}
          zoomInDuration={zoomInDuration}
          cellCollected={cellCollected}
        />
      );
    });
  }, [
    lastSelectGameLevel,
    lastSelectCell,
    player1GameHistory,
    player2GameHistory,
    round,
    mode,
    row,
    playerTurn,
    cellCollected,
  ]);

  //android bug fix not plus

  const giveUp = () => {
    if (lastSelectGameLevel == 2) {
      if (playerTurn == player1) {
        setPlayerTurn(player1);
        setPlayer2GameHistory({
          ...player2GameHistory,
          ...{ win: [0, 1, 2, 3, 4, 5, 6, 7, 8] },
        });
      } else {
        setPlayerTurn(player2);
        setPlayer1GameHistory({
          ...player1GameHistory,
          ...{ win: [0, 1, 2, 3, 4, 5, 6, 7, 8] },
        });
      }
      setRound([...round, ...[0, 1, 2, 3, 4, 5, 6, 7, 8]]);
      setEndGame(true);
    } else {
      if (playerTurn == player1) {
        setPlayerTurn(player1);
        playerWin(player2GameHistory, setPlayer2GameHistory, lastSelectCell);
      } else {
        setPlayerTurn(player2);
        playerWin(player1GameHistory, setPlayer1GameHistory, lastSelectCell);
      }
      setRound([...round, lastSelectCell]);
      goLevel(2);
    }
  };

  const draw = () => {
    if (lastSelectGameLevel == 2) {
      //reset game
      if (playerTurn == player1) {
        setPlayerTurn(player2);
        resetGame(player2);
      } else {
        setPlayerTurn(player1);
        resetGame(player1);
      }
    } else {
      if (playerTurn == player1) {
        setPlayerTurn(player2);
      } else {
        setPlayerTurn(player1);
      }
      setRound([...round, lastSelectCell]);
      goLevel(2, false);
    }
  };

  const selectCell = useCallback(
    (index) => {
      setLastSelectCell(index);
      setZoomingCell(index);
      setLastSelectGameLevel(1);
    },
    [lastSelectGameLevel]
  );

  const clickTictactoeCell = (index) => {
    if (!endGame) {
      setLastSelect(index);
      if (playerTurn == player1) {
        let player1History = player1GameHistory;
        player1History[lastSelectCell].push(index);
        setPlayerTurn(player2);
        setPlayer1GameHistory({ ...player1GameHistory, ...player1History });
      } else {
        let player2History = player2GameHistory;
        player2History[lastSelectCell].push(index);
        setPlayerTurn(player1);
        setPlayer2GameHistory({ ...player2GameHistory, ...player2History });
      }
    }
  };

  const pointCell = () => {
    if (lastSelectGameLevel == 2) {
      setZoomInCell(true);
    }
    setLastSelect(null);
    let duration = 222;
    let distance = tictactoeViewWidth;
    let scale, top, left;
    if (lastSelectGameLevel == 2) {
      scale = 1;
      top = 0;
      left = 0;
    } else if (lastSelectCell == 0) {
      scale = 3;
      top = distance;
      left = distance;
    } else if (lastSelectCell == 1) {
      scale = 3;
      top = distance;
      left = 0;
    } else if (lastSelectCell == 2) {
      scale = 3;
      top = distance;
      left = -distance;
    } else if (lastSelectCell == 3) {
      scale = 3;
      top = 0;
      left = distance;
    } else if (lastSelectCell == 4) {
      scale = 3;
      top = 0;
      left = 0;
    } else if (lastSelectCell == 5) {
      scale = 3;
      top = 0;
      left = -distance;
    } else if (lastSelectCell == 6) {
      scale = 3;
      top = -distance;
      left = distance;
    } else if (lastSelectCell == 7) {
      scale = 3;
      top = -distance;
      left = 0;
    } else if (lastSelectCell == 8) {
      scale = 3;
      top = -distance;
      left = -distance;
    } else {
      scale = 99;
      top = 100;
      left = 100;
    }
    Animated.parallel([
      Animated.timing(Anim1, {
        toValue: scale,
        useNativeDriver: false,
        duration: duration,
      }),
      Animated.timing(Anim2, {
        toValue: top,
        useNativeDriver: false,
        duration: duration,
      }),
      Animated.timing(Anim3, {
        toValue: left,
        useNativeDriver: false,
        duration: duration,
      }),
    ]).start(({ finished }) => {
      if (lastSelectGameLevel == 1) {
        setTimeout(function () {
          setZoomInCell(false);
          //for ai choose next level
          checkIsComputerTurn();
        }, zoomInDuration);
      } else if (lastSelectGameLevel == 2) {
        setZoomingCell(null);
        //for ai choose next level
        checkIsComputerTurn();
      }
    });
  };

  const onBack = () => {
    navigation.navigate("Index");
  };

  const RenderGameButton = (Props) => {
    if (!Props.endGame) {
      if (round.includes(lastSelectCell) && lastSelectGameLevel == 1) {
        return (
          <View style={[Props.gameButtonView, { flex: 1 }]}>
            <ColumnAnimateButton
              text="Back"
              offViewValue={1}
              onViewValue={1.2}
              offTextValue={0}
              onTextValue={6}
              call={goLevel}
            />
          </View>
        );
      } else {
        return (
          <View style={[Props.gameButtonView, { flex: 1 }]}>
            <ColumnAnimateButton
              text="Give Up"
              offViewValue={1}
              onViewValue={1.1}
              offTextValue={0}
              onTextValue={6}
              call={giveUp}
            />
            <View style={{ width: padding }}></View>
            <ColumnAnimateButton
              text="Draw"
              offViewValue={1}
              onViewValue={1.1}
              offTextValue={0}
              onTextValue={6}
              call={draw}
            />
          </View>
        );
      }
    } else {
      if (lastSelectGameLevel == 1 && gameLevel == 2) {
        return (
          <View style={[Props.gameButtonView, { flex: 1 }]}>
            <ColumnAnimateButton
              text="Back"
              offViewValue={1}
              onViewValue={1.2}
              offTextValue={0}
              onTextValue={6}
              call={goLevel}
            />
          </View>
        );
      } else {
        return (
          <View style={[Props.gameButtonView, { flex: 1 }]}>
            <ColumnAnimateButton
              text="Play Again"
              offViewValue={1}
              onViewValue={1.2}
              offTextValue={0}
              onTextValue={6}
              call={resetGame}
            />
          </View>
        );
      }
    }
  };

  const bannerError = (err) => {
    console.log(err);
    Analytics.logEvent("BannerError", {
      name: "banner error",
      screen: "GameScreen",
      purpose: err,
    }).catch((error) => {
      console.log(error);
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.main]}>
        <View style={{ flex: 1 }}></View>
        <AnimateTictactoePlayerView
          player1Score={player1Score}
          player2Score={player2Score}
          player1Name={player1Name}
          player2Name={player2Name}
          player1Img={player1Img}
          player2Img={player2Img}
          endGame={endGame}
          playerTurn={playerTurn}
          animateSpeed={222}
        />
        <View
          style={{
            width: tictactoeViewWidth,
            height: tictactoeViewWidth,
            overflow: "visible",
          }}
        >
          <Animated.View
            style={{
              position: "absolute",
              top: Anim2,
              left: Anim3,
              transform: [{ scale: Anim1 }],
            }}
          >
            <View style={styles.tictactoeView}>
              <RenderCell />
            </View>
          </Animated.View>
        </View>
        <View style={{ flex: 1 }}></View>
        <View style={styles.gameButtonView}>
          <RenderGameButton
            endGame={endGame}
            gameButtonView={styles.gameButtonView}
          />
        </View>
        <View style={styles.ads}>
          <AdMobBanner
            // bannerSize="banner"
            adUnitID={bannerID}
            servePersonalizedAds={false}
            onDidFailToReceiveAdWithError={bannerError}
          />
        </View>
        <BackButton text="Back" call={onBack} delayDisplay={500} />
      </View>
      <AnimateTictactoeStart
        player1Img={player1Img}
        player2Img={player2Img}
        player1Name={player1Name}
        player2Name={player2Name}
        setStartGame={setStartGame}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f1123",
    alignItems: "center",
    // justifyContent: 'center',
    justifyContent: "space-between",
  },
  main: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 45,
    color: "#FFF",
    marginBottom: 50,
  },
  prevBtn: {
    position: "absolute",
    left: 0,
  },
  nextBtn: {
    position: "absolute",
    right: 0,
  },
  scrollPage: {
    flex: 1,
    width: screenW,
    justifyContent: "center",
    alignItems: "center",
  },
  tictactoeView: {
    width: tictactoeViewWidth,
    height: tictactoeViewWidth,
    flexWrap: "wrap",
    flexDirection: "row",
  },
  animateView: {
    zIndex: 9,
  },
  gameButtonView: {
    flexDirection: "row",
    paddingLeft: padding / 2,
    paddingRight: padding / 2,
  },
  playersView: {
    flexDirection: "row",
    paddingLeft: padding / 2,
    paddingRight: padding / 2,
    paddingBottom: screenH <= 667 ? 0 : padding,
  },
  ads: {
    // flex:1,
    width: screenW,
    // backgroundColor:"#2e2e2e",
    alignItems: "center",
    alignContent: "center",
    alignSelf: "center",
  },
});
