import odhUploaderHandler from './handler';

const event = JSON.parse(process.argv.slice(2)[0]);

odhUploaderHandler(event)
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
