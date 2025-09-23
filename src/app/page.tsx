'use client'
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { pokemonDetailsQuery } from "./shared/gql/pokemon-details";
import { PokemonDetails, PokemonSearchParameter } from "./shared/types/pokemon-details-types";
import { fetchPokemonFromGraphQL } from "./shared/utils/details-utils";


export default function Home() {
  /*
  The react useEffect hook is utilized to manage side effects within the Javascript / React lifecycle. 
  Often times this is used in conjunction with useState hook in order to update date or listen to events.
  It is also used to fetch data from internal or external API endpoints, publish and listen to subscriptions, 
  or making changes to the DOM. 
  useEffect renders based on on changes, the one main pitfall that can happen is when the dependency array always sees 
  changes and infinitely rerenders.
  I setup a small Next.js project to show a few example of this using the Pokemon API. 
  Few examples is to search for pokemon and update the selected Pokemon. This could be extended to take an input from a for,
  but for the sake of this example I will just be giving it a list of data to search on. 
  useEffect takes two parameters the method or function and the dependency array.
  At its root in this example it watches the nameToSearch dependency
    -> if the dependency shape/value changes the useEffect runs and the component is rerendered.
    Note: In this case we have a fixed value on the dependency so this pattern is fairly safe, but if the side effect is more complex
    Often times this needs to be a useCallback or a useMemo which prevents the infinite loop issue with complex dependencies based on 
    how React responds to side effects.
    
  This example fetches the Pokemon data from an external API from the Pokemon graphQL endpoint and then updates the state.
  */
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonDetails | null>()
  const [nameToSearch,] = useState<PokemonSearchParameter>({
    "name": "charizard"
  })

  const query = pokemonDetailsQuery;

  useEffect(() => {
      (async () => {
        try {
          // Await the results and set them to state or throw an error
          const pokemonResults = await fetchPokemonFromGraphQL(query, nameToSearch);
          if (pokemonResults) {
            setSelectedPokemon(pokemonResults)
          }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch(e: any ) {
          // Catch any errors and throw
          e.errors.map((error: { message: unknown; }) => {
            throw new Error(`Could Not Retrieve Pokemon. Error: ${error.message}`)
          })
        }
        // This second set of brackets is import because it immediatly invokes the ansyc function that was created
      })()
      // Define the dependency(s) that should be watched to trigger the userEffect in this case if the query or the variables changes
      // The userEffect will run and re-render
    }, [query, nameToSearch])

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <>
          {
            selectedPokemon?.species.map(
              (pokemon, id) => (
                // Since this is mapped the DOM element needs a unique key
                <div key={`pokemon-name-${pokemon.name}`}>
                  <h1 style={{ textTransform: "uppercase" }}>
                    {pokemon.name}
                  </h1>
                  <h3>
                    {pokemon.flavorText.length ? pokemon.flavorText[id].flavor_text : 'No Flavor Text'}
                  </h3>
                </div>
              )
            )
          }
          </>
      </main>
    </div>
  );
}
