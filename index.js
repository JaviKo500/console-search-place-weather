require('dotenv').config()
const { readInput, inquirerMenu, pause, listPlaces } = require("./helpers/inquirer");
const Search = require("./models/searchs");
const colors = require('colors');

const main = async () => {
    const searchs = new Search();
    let opt ;
    do {
        opt = await inquirerMenu();
        switch ( opt ) {
            case 1:
                const place = await readInput('City: ');
                const places = await searchs.searchCity( place );
                const id = await listPlaces( places );
                if ( id ===  '0') continue;
                const selectedPlace = places.find( place => place.id === id);
                const weather = await searchs.weatherByPlace( selectedPlace.lat, selectedPlace.lng );
                searchs.addHistory( selectedPlace.name );
                console.clear();
                console.log('\nCity information \n'.green);
                console.log(`City: ${selectedPlace.name.green}`);
                console.log(`Lat:  ${selectedPlace.lat.toString().green}`);
                console.log(`Lng:  ${selectedPlace.lng.toString().green}`);
                console.log(`Temp: ${weather.temp.toString().green} C°`);
                console.log(`Max:  ${weather.max.toString().green} C°`);
                console.log(`Min:  ${weather.min.toString().green} C°`);
                console.log(`Desc: ${weather.description.green}`);
            break;
            case 2:
                searchs.historyCapitalize.forEach( (place, i ) => {
                    const idx = `${ i + 1 }`.green;
                     console.log( `${ idx } ${ place }` );
                }) ;
            break;
        }
        if ( opt !== 0 ) await pause();
    } while ( opt !== 0);
}

main();