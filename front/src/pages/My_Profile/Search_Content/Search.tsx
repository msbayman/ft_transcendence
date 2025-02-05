import search_css from "./Search.module.css";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { usePlayer } from "../PlayerContext";
import Cookies from "js-cookie";
import axios from "axios";
import { config } from "../../../config";

const Search = () => {
  const my_data = usePlayer();

  type Player_search = {
    id: number;
    username: string;
    profile_image: string;
    level: number;
  };
  const [searchResults, setSearchResults] = useState<Player_search[]>([]);
  const [query, setQuery] = useState("");
const { HOST_URL } = config;
  useEffect(() => {
    const handleSearch = async (query: string) => {
      const token = Cookies.get("access_token");
      const minLength = 2; // Set your desired minimum length

      // Only proceed if query meets minimum length
      if (query.length >= minLength) {
        try {
          const response = await axios.get(
            `${HOST_URL}/api/user_auth/search-users/?q=${query}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (response.status === 200) {
            setSearchResults(response.data);
          }
        } catch (error) {
          console.error("Error fetching search results:", error);
        }
      } else {
        setSearchResults([]);
      }
    };

    handleSearch(query);
  }, [query]);

  const searchResults1 = searchResults.filter(
    (data) => data.username !== my_data.playerData?.username
  );

  const navigation = useNavigate();
  const navig_to = (username: string | undefined) => {
    setQuery("");
    setsearchbar(false);
    navigation(`/Profile/${username}`);
  };

  const [searchbar, setsearchbar] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const onClickFocus = () => {
    setsearchbar(true);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setsearchbar(false);
        setQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <img src="/Navbar/Search.svg" className={search_css.imgg_s} />
      <input
        className={search_css.inside_input}
        ref={inputRef}
        type="search"
        placeholder="Search for Player…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        maxLength={50}
        onFocus={onClickFocus}
      />
      {searchbar && (
        <div className={search_css.search_size} ref={dropdownRef}>
          {searchResults1.length > 0 ? (
            <div className={search_css.player_details_colomns}>
              {searchResults1.map((player) => (
                <button
                  key={player.id}
                  className={search_css.player_details}
                  onClick={() => {
                    navig_to(player.username);
                  }}
                >
                  <div key={player.id} className={search_css.player_details}>
                    <img
                      className={search_css.images_search}
                      src={player.profile_image}
                      alt={player.username}
                    />
                    <div className={search_css.text}>
                      <span>{player.username}</span>
                      <span className={search_css.lvl_size}>
                        Level {player.level}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className={search_css.player_details_colomns}>
              {query.length < 2 ? "" : "No results found."}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Search;
