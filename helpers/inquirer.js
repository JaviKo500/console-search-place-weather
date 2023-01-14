// const inquirer = require('inquirer');
const inquirer = require('inquirer');

const colors = require('colors');

const questions = [
    {
        type: 'list',
        name: 'option',
        message: 'What would you like do? \n',
        choices: [
            {
                value: 1,
                name: `${ '1.'.green } Search city`
            },
            {
                value: 2,
                name: `${ '2.'.green } History`
            },
            {
                value: 0,
                name: `${ '0.'.green } Exit`
            },
        ] 
    }
];

const inquirerMenu = async () => {
    // console.clear();
    console.log('=============================='.green);
    console.log(' Select a option '.yellow);
    console.log('==============================\n'.green);

    const {option} = await inquirer.prompt( questions );
    return option;
};

const pause = async () => {
    const { key } = await inquirer.prompt({
        type: 'input',
        name: 'key',
        message: `Press ${ 'ENTER'.green } to continue`,
    });
    console.log('\n');
    return key;
}

const readInput = async ( message ) => {
    const question = [
        {
            type: 'input',
            name: 'description',
            message,
            validate( value ) {
                if ( value.length === 0 ) {
                    return 'Please enter a value';
                }
                return true;
            }
        }
    ];

    const { description } = await inquirer.prompt( question );
    return description;
}

const listPlaces = async ( places = [] ) => {
    const choices = places.map( (place, idx) => {
        return {
            value: place.id,
            name: `${ (idx + 1).toString().green } ${ place.name }` 
        }
    });
    choices.unshift({
        value: '0',
        name: `${'0.'.green} Cancel.`
    });
    const questions = [
        {
            type: 'list',
            name: 'id',
            message: 'Selected',
            choices
        }
    ]
    const { id } = await inquirer.prompt( questions );
    return id;
}

const confirmMessage = async ( message ) => {
    const question = [
        {
            type: 'confirm',
            name: 'ok',
            message
        }
    ];
    const { ok } = await inquirer.prompt( question );
    return ok;
}

const showListCheckList = async ( tasks = [] ) => {
    const choices = tasks.map( (task, idx) => {
        return {
            value: task.id,
            name: `${ (idx + 1).toString().green } ${ task.description }`,
            checked: task.completeIn ? true : false 
        }
    });
    const questions = [
        {
            type: 'checkbox',
            name: 'ids',
            message: 'Selected: ',
            choices
        }
    ]
    const { ids } = await inquirer.prompt( questions );
    return ids;
}

module.exports = {
    inquirerMenu,
    pause,
    readInput,
    listPlaces,
    confirmMessage,
    showListCheckList
};