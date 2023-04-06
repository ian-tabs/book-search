import React, { useState, useEffect } from "react";
import usePokeApi from "../../custom-hooks/usePokeApi";
import { Input, Loader } from "semantic-ui-react"
import PokemonCard from "../../components/PokemonCard";
import { debounce, isEqual, findIndex } from "lodash";
import './PokemonCheckList.css';


function PokemonCheckList() {
    const defaultQuery = "";
    const [query, setQuery] = useState(defaultQuery);
    const [pokemons, setPokemons] = useState([]);

    const debouncedSearch = debounce((pokemonName) => {
        setQuery(pokemonName);
    }, 500)

    function handleInputChange(event) {
        const { value } = event.target;
        debouncedSearch(value);
    }

    const { loading, error, pokemonData } = usePokeApi(query);

    function findPokemonIndex(pokemonToFind) {
        return pokemons.findIndex(pokemon => isEqual(pokemon, pokemonToFind));
    }

    function addToCheckList(newPokemon) {

        const noDuplicate = findPokemonIndex(newPokemon) <= -1;

        if (noDuplicate) {
            setPokemons(prevPokemons => {
                return [...prevPokemons, newPokemon]
            })
            setQuery(defaultQuery);
        }
        console.log(pokemons)
    }

    function removeFromList(pokemon) {
        console.log(pokemon.id);

        setPokemons(prevPokemons => {
            return prevPokemons.filter(prevPokemon => !isEqual(prevPokemon.id, pokemon.id))
        })

        console.log(pokemons)
    }

    useEffect(() => {
        console.log(pokemons)
    }, [pokemons])

    return (
        <>
            <Input
                type="text"
                className="search-bar"
                onChange={handleInputChange}
                placeholder="Search Pokemon"
            />

            {loading && <Loader active inline='centered' />}

            {(error && (query !== defaultQuery)) && <div inline='centered'> No Pokemon found </div>}

            {(!error && pokemonData !== null && !loading) && <PokemonCard
                isResult
                onButtonClick={() => addToCheckList(pokemonData)}
                pokemonData={pokemonData}
            />}

            {(pokemons.length > 0) && pokemons.map((pokemon) => {
                return (
                    <PokemonCard
                        isResult={false}
                        refKey={pokemon.id}
                        onButtonClick={() => removeFromList(pokemon)}
                        pokemonData={pokemon}
                    />)
            })}




        </>

    );
}

export default PokemonCheckList