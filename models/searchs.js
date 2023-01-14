const fs = require('fs');
const axios = require('axios');
class Search {
    historyData = [];
    dbPath = './db/database.json'
    constructor( ) {
        this.readDB();
    }

    get paramsMapBox () {
        return {
            'access_token': process.env.MAPBOX || '',
            'language': 'es',
            'proximity': 'ip'
        };
    }
    searchCity = async ( place = '' ) => {
        try {
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${place}.json`,
                params: this.paramsMapBox
            });
            const resp = await instance.get();
            return resp.data.features.map( place => ({
                id: place.id,
                name: place.place_name,
                lng: place.center[0],
                lat: place.center[1],
                
            }));
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    get weatherParams () {
        return {
            'appid': process.env.OPENWEATHER_KEY,
            'units': 'metric',
            'lang': 'es'
        }
    }

    get historyCapitalize () {
        return this.historyData.map( history => {
            let placeArr = history.split(' ');
            placeArr = placeArr.map( p => `${p.charAt(0).toUpperCase()}${p.slice(1)}` );
            return placeArr.join(' ');
        } );
    }

    weatherByPlace = async (lat = 0, lon = 0) => {
        try {
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: {
                    lat,
                    lon,
                    ...this.weatherParams
                }
            });
            const resp = await instance.get();
            console.log(resp.data);
            const { description } = resp.data.weather[0];
            const { temp_min, temp_max, temp} = resp.data.main;
            return {
                description,
                min: temp_min,
                max: temp_max,
                temp,
            };
        } catch (error) {
            console.log(error);
        }
    }

    
    addHistory = ( place = '' ) => {
        if ( this.historyData.includes( place.toLocaleLowerCase() ) ) {
            return;
        }
        this.historyData = this.historyData.splice(0,5);
        this.historyData.unshift( place.toLocaleLowerCase() );
        this.saveDB();
    }

    saveDB = () => {
        const payload = {
            history: this.historyData
        };
        fs.writeFileSync( this.dbPath, JSON.stringify( payload ));
    }

    readDB = () => {
        if ( !fs.existsSync( this.dbPath ) ) {
            return;
        }
        const info = fs.readFileSync( this.dbPath, { encoding: 'utf-8' } );
        const data = JSON.parse( info );
        this.historyData = data.history;
    }
}

module.exports = Search;