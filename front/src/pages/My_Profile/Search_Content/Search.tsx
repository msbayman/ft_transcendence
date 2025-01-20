import search_css from "./Search.module.css"
import Search_s from "../assets/Search.svg";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";


const Search = () => {
    
  type Player_search = {
    id: number;
    username: string;
    profile_image: string;
    level:number;
  };
  const [searchResults, setSearchResults] = useState<Player_search[]>([]);
  const [query, setQuery] = useState("");
  
  const handleSearch = async (query: string) => {
    if (query.length > 0) {
      try {
        const response = await fetch(
          `http://localhost:8000/user_auth/search-users/?q=${query}`
        );
        const data = await response.json();
        setSearchResults(data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    } else {
      setSearchResults([]);
    }
  };
  useEffect(() => {
    handleSearch(query);
  }, [query]);
  
  const navigation = useNavigate();
  const navig_to = (username:string|undefined) => {
    navigation(`/Profile/${username}`)
  }

  const [searchbar, setsearchbar] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  
  const onClickFocus = () => {
    setsearchbar(true);
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setsearchbar(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
          <img src={Search_s} className={search_css.imgg_s} />
          <input
            className={search_css.inside_input}
            ref={inputRef}
            type="search"
            placeholder="Search for Player…"
            onChange={(e) => setQuery(e.target.value)}
            maxLength={50}
            onFocus={onClickFocus}
          />
          {searchbar && (
            <div className={search_css.search_size}>
              {searchResults.length > 1 ? (
                <div className={search_css.player_details_colomns}>
                  {searchResults.map((player) => (
                    <button key={player.id} className={search_css.player_details} onClick={() => {navig_to(player.username)}}>
                      <div key={player.id} className={search_css.player_details}>
                        <img
                          className={search_css.images_search}
                          src={
                            "http://localhost:8000/media/" +
                            player.profile_image
                          }
                          alt={player.username}
                        />
                        <div className={search_css.text}>
                        <span>{player.username}</span>
                        <span className={search_css.lvl_size}>Level {player.level}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className={search_css.player_details_colomns}>
                  No results found  ..
                </div>
              )}
            </div>
          )}
    </>
  )
}

export default Search