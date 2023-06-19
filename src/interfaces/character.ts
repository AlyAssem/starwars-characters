declare global {

    interface ICharacter {

        key: number,
        name: string,
        eyeColor: string,
        gender: string,
        height: number,
        mass: number,
        homeworld: {
            name: string;
        };
        species: ISpecies | null;
        filmTitle: string;
    }

    interface ICharacterApi {
        node: ICharacter & {
            filmConnection: {
                films: IFilm[];
            };
        };
    }

}
export { };