import { createContext } from "react";

interface TournInterface {
  p1: string;
  p2: string;
  p3: string;
  p4: string;
  semi1: string;
  semi2: string;
  final: string;
}

const defaultValue: TournInterface = {
  p1: "player1",
  p2: "player2",
  p3: "player3",
  p4: "player4",
  semi1: "",
  semi2: "",
  final: "",
};

export const TournContext = createContext<TournInterface>(defaultValue);
