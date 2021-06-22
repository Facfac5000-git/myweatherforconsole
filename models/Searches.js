const fs = require('fs');

const axios = require('axios');

class Searches {
    record = [];
    dbPath = './db/database.json';

    constructor(){
        this.readDB();
    }

    get capitalizedRecord(){
        return this.record.map( location => {
            let words = location.split(' ');
            words = words.map( word => word[0].toUpperCase() + word.substring(1));
            return words.join(' ');
        });
    }

    get paramsMapbox(){
        return {
            'access_token': process.env.MAPBOX_KEY || '',
            'limit': 5,
            'language': 'es'
        }
    }

    get paramsOpenWeather(){
        return {
            'appid': process.env.OPENWEATHER_KEY || '',
            'units': 'metric',
            'lang': 'es',
        }
    }

    async cities( q = ''){
        try{
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${q}.json`,
                params: this.paramsMapbox
            });
            const response = await instance.get();
            return response.data.features.map( location => ({
                id: location.id,
                name: location.place_name,
                lat: location.center[1],
                lng: location.center[1]
            }));

        } catch (error) {
            return [];
        }
    }

    async locationWeather( lat, lon ){
        try{
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: { ...this.paramsOpenWeather, lat, lon}
            });
            const response = await instance.get();
            //return response;
            return {
                'desc': response.data.weather[0].description,
                'min': response.data.main.temp_min,
                'max': response.data.main.temp_max,
                'temp': response.data.main.temp
            };    
        
        } catch (error) {
            console.log(error);
            return {};
        }
    }

    addRecord( location = ''){
        if( this.record.includes( location.toLocaleLowerCase())){
            return;
        }
        this.record = this.record.splice(0,9);
        this.record.unshift( location.toLocaleLowerCase() );
        this.saveDB();

    }

    printRecord(){
        this.capitalizedRecord.forEach( (location, idx) => {
            const idxItem = `${(idx+1).toString()}.`.magenta;
            console.log(`${idxItem} ${location}`);
        });
    }

    saveDB(){
        const payload = {
            record: this.record
        };
        fs.writeFileSync( this.dbPath, JSON.stringify(payload));
    }

    readDB(){
        if(!fs.existsSync(this.dbPath)){
            return;
        }
        const dbRecord = fs.readFileSync(this.dbPath, {encoding: 'utf-8'});
        const data = JSON.parse(dbRecord);
        this.record = data.record;
    }
}

module.exports = Searches;