import { PokemonDetails, PokemonSearchParameter } from "../types/pokemon-details-types";

  // Fetch method to be used for fetching from the page or fetching from the API
  export async function fetchPokemonFromGraphQL(query: string, variables: PokemonSearchParameter) {
    const response = await fetch(
      "https://graphql.pokeapi.co/v1beta2",
      {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: query,
          variables: variables,
          operationName: "pokemon_details"
        })
      }
    )
    // Handle request error (the request itself failed, 400, 403 the response status)
    if(!response.ok) {
      throw new Error(`GraphQL Fetch Failed: ${response.status}`)
    }

    // Wait for the promise to resolve then set the response data to result object
    const results = await response.json();
    if(results.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(results.errors)}`);
    }

    return results.data as PokemonDetails
  }