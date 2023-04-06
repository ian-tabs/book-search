import React from "react";
import { isEmpty } from "lodash";
import { Button, Container, Image, Ref } from "semantic-ui-react"



function PokemonCard({ pokemonData, onButtonClick, isResult = "false", refKey }) {

    if (pokemonData === null) return (<></>)

    const { name, types, game_indices, sprites } = pokemonData

    const gameIndicesLength = game_indices.length
    const halfLength = Math.ceil(gameIndicesLength / 2)
    const firstHalf = game_indices.slice(0, halfLength);
    const secondHalf = game_indices.slice(halfLength, gameIndicesLength);

    return (
        <Ref key={refKey}>
            <Container className={`pokemon-card ${isResult ? "result" : "list"}`}>

                <Container className={`upper`}>
                    <h1>{name}</h1>
                    <Button onClick={onButtonClick} />
                </Container>
                <h3>Types:</h3>
                <ul className={`types`}>
                    {types.map((type) => {
                        const typeName = type.type.name
                        return (<li key={typeName}>{typeName}</li>);
                    })}

                </ul>
                <h3>Versions:</h3>

                <Container className={`versions`}>
                    <ul className={`left`}>
                        {firstHalf.map((game_indice) => {
                            const versionName = game_indice.version.name
                            return (<li key={versionName} >{versionName}</li>);
                        })}
                    </ul>
                    <ul className={`right`}>
                        {secondHalf.map((game_indice) => {
                            const versionName = game_indice.version.name
                            return (<li key={versionName} >{versionName}</li>);
                        })}
                    </ul>
                </Container>

                <Container className={`sprites`}>
                    {!isEmpty(sprites) && (Object.keys(sprites).map((sprite) => {
                        const imageUrl = sprites[sprite];
                        const isURL = (imageUrl != null && (typeof imageUrl === 'string' || imageUrl instanceof String))
                        if (isURL) return (
                            <Ref key={imageUrl}>
                                <Image src={imageUrl} />
                            </Ref>
                        );
                    }))}
                </Container>


            </Container>
        </Ref>
    );
}

export default PokemonCard;