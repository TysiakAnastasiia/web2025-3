const fs = require('fs');

// Функція для обробки аргументів командного рядка
function processArgs() {
    // Отримання аргументів командного рядка
    const args = process.argv.slice(2);

    // Змінні для зберігання параметрів
    let inputFile = null;
    let outputFile = null;
    let displayConsole = false;

    // Парсинг аргументів
    for (let i = 0; i < args.length; i++) {
        switch (args[i]) {
            case '-i':
            case '--input':
                // Перевірка наявності значення після прапорця
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

    // Перевірка обов'язкового параметру вводу
    if (!inputFile) {
        console.error('Please, specify input file');
        process.exit(1);
    }

    // Перевірка існування вхідного файлу
    try {
        fs.accessSync(inputFile, fs.constants.F_OK);
    } catch (err) {
        console.error('Cannot find input file');
        process.exit(1);
    }

    // Якщо не вказано жодного додаткового параметру - виходимо
    if (!outputFile && !displayConsole) {
        process.exit(0);
    }

    // Читання та обробка файлу
    try {
        const rawData = fs.readFileSync(inputFile, 'utf8');
        const data = JSON.parse(rawData);

        // Запис у файл, якщо вказано
        if (outputFile) {
            fs.writeFileSync(outputFile, JSON.stringify(data, null, 2), 'utf8');
        }

        // Виведення у консоль, якщо вказано
        if (displayConsole) {
            console.log(JSON.stringify(data, null, 2));
        }
    } catch (err) {
        console.error('Error processing file:', err.message);
        process.exit(1);
    }
}

// Виклик функції обробки аргументів
processArgs();