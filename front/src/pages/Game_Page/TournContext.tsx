import { createContext, useState, ReactNode } from "react";

interface TournInterface {
  p1: string;
  p2: string;
  p3: string;
  p4: string;
  semi1: string;
  semi2: string;
  final: string;
  finish: boolean;
}

interface TournContextType {
  tournamentState: TournInterface;
  setTournamentState: React.Dispatch<React.SetStateAction<TournInterface>>;
}

const defaultValue: TournInterface = {
  p1: "def-1",
  p2: "def-2",
  p3: "def-3",
  p4: "def-4",
  semi1: "",
  semi2: "",
  final: "",
  finish: false,
};

export const TournContext = createContext<TournContextType>({
  tournamentState: defaultValue,
  setTournamentState: () => {},
});

export const TournProvider = ({ children }: { children: ReactNode }) => {
  const [tournamentState, setTournamentState] = useState<TournInterface>(defaultValue);

  return (
    <TournContext.Provider value={{ tournamentState, setTournamentState }}>
      {children}
    </TournContext.Provider>
  );
}