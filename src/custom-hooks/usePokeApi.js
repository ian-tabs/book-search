import { useState, useEffect } from "react"
import axios from "axios";

function usePokeApi(pokemonName) {

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [pokemonData, setPokemonData] = useState(null);


    useEffect(() => {

        // console.log(pokemonName.length)

        if (pokemonName.length === 0) {
            setError(true);
            setLoading(false);
            return
        }

        setLoading(true);
        setError(false);
        let cancel;

        axios({
            method: "GET",
            url: `https://pokeapi.co/api/v2/pokemon/${pokemonName}`,
            cancelToken: new axios.CancelToken(c => cancel = c)
        }).then((response) => {
            const { sprites, types, game_indices, id } = response.data;

            console.log(response);

            setPokemonData({ sprites, types, game_indices, name: pokemonName, id });
            setLoading(false);
        }).catch(e => {
            // console.log(e)
            setError(true);
            setLoading(false);
            if (axios.isCancel(e)) return
        })

        return () => cancel()
    }, [pokemonName])

    return { loading, error, pokemonData }
}

export default usePokeApi;
