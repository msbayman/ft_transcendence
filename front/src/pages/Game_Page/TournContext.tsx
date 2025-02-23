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

interface SelectedId {
  mode: number | null;
  board: number | null;
  paddel: number | null;
  ball: number | null;
  selectedStatus: {
    mode: number[];
    board: number[];
    paddel: number[];
    ball: number[];
  };
}

interface TournContextType {
  tournamentState: TournInterface;
  setTournamentState: React.Dispatch<React.SetStateAction<TournInterface>>;
  selectedId: SelectedId;
  setSelectedId: React.Dispatch<React.SetStateAction<SelectedId>>;
}

const defaultTournamentState: TournInterface = {
  p1: "def-1",
  p2: "def-2",
  p3: "def-3",
  p4: "def-4",
  semi1: "",
  semi2: "",
  final: "",
  finish: false,
};

const defaultSelectedId: SelectedId = {
  mode: null,
  board: null,
  paddel: null,
  ball: null,
  selectedStatus: {
    mode: [],
    board: [],
    paddel: [],
    ball: [],
  },
};

export const TournContext = createContext<TournContextType>({
  tournamentState: defaultTournamentState,
  setTournamentState: () => {},
  selectedId: defaultSelectedId,
  setSelectedId: () => {},
});

export const TournProvider = ({ children }: { children: ReactNode }) => {
  const [tournamentState, setTournamentState] = useState<TournInterface>(defaultTournamentState);
  const [selectedId, setSelectedId] = useState<SelectedId>(defaultSelectedId);

  return (
    <TournContext.Provider value={{ tournamentState, setTournamentState, selectedId, setSelectedId }}>
      {children}
    </TournContext.Provider>
  );
};
