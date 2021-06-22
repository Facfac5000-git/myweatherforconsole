require('dotenv').config();

const { inquirerMenu, 
        pause, 
        readInput, 
        completeTodoList, 
        locationList, 
        deleteTodoConfirm } 
        = require('./helpers/inquirer');
const Searches = require('./models/Searches');


const main = async() => {

    const searches = new Searches();
    let option;
    while(option !== 0) {
        option = await inquirerMenu();

        switch (option){
            case 1:
                const q = await readInput('Ingresa una ciudad: ');
                const locations = await searches.cities(q);
                const id = await locationList(locations);
                if(id === '0') continue;
                const selectedLocation = locations.find( l => l.id === id);
                searches.addRecord( selectedLocation.name );
                const locationWeather = await searches.locationWeather(selectedLocation.lat, selectedLocation.lng);
                console.log('\nInformación de la ciudad\n'.magenta);
                console.log('Ciudad: ', selectedLocation.name);
                console.log('Latitud: ', selectedLocation.lat);
                console.log('Longitud: ', selectedLocation.lng);
                console.log('Temperatura: ', locationWeather.temp);
                console.log('Mínima: ', locationWeather.min);
                console.log('Máxima: ', locationWeather.max);
                console.log('Nota: ', locationWeather.desc.magenta);
                break;
            case 2:
                searches.printRecord();
                break;
            default:
                break;
        }

        if(option !== '0') await pause();
    }
}

main();