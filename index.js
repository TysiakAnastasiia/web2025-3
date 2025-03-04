const fs = require('fs');

function processArgs() {
    const args = process.argv.slice(2);

    let inputFile = null;
    let outputFile = null;
    let displayConsole = false;

    for (let i = 0; i < args.length; i++) {
        switch (args[i]) {
            case '-i':
            case '--input':
                if (i + 1 < args.length) {
                    inputFile = args[++i];
                }
                break;
            case '-o':
            case '--output':
                if (i + 1 < args.length) {
                    outputFile = args[++i];
                }
                break;
            case '-d':
            case '--display':
                displayConsole = true;
                break;
        }
    }

    // Перевірка на обов'язковий параметр
    if (!inputFile) {
        console.error('Please, specify input file');
        process.exit(1);
    }

    // Перевірка, чи існує вказаний файл
    try {
        fs.accessSync(inputFile, fs.constants.F_OK);
    } catch (err) {
        console.error('Cannot find input file');
        process.exit(1);
    }

    try {
        const rawData = fs.readFileSync(inputFile, 'utf8');
        const data = JSON.parse(rawData);

        // Фільтрація та обробка даних
        const filteredValues = data
            .filter(item => item.ku === 13 && item.value > 5)
            .map(item => item.value);

        // Виведення у консоль, якщо вказано
        if (displayConsole) {
            if (filteredValues.length > 0) {
                console.log(filteredValues.join(' '));
            } else {
                console.log('There is no items matching the filter conditions');
            }
        }

        // Запис у файл, якщо вказано
        if (outputFile) {
            try {
                fs.writeFileSync(outputFile, filteredValues.join(' '));
                console.log(`Results saved to ${outputFile}`);
            } catch (err) {
                console.error('Error writing to output file:', err.message);
                process.exit(1);
            }
        }

    } catch (err) {
        console.error('Error processing file:', err.message);
        process.exit(1);
    }
}

processArgs();
