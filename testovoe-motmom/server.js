// подключение модулей
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

// иницализация express
const app = express();
const PORT = 3000;

// запуск сервера
app.use(express.static('public'));
app.listen(process.env.port || PORT, () => {
	console.log(`Server running on port ${PORT}`);
});

const eventsFilePath = './public/assets/events.json'; // путь к файлу с мероприятиями

// функция чтения файла, возвращающая promise
const readFile = filePath => {
	return new Promise((resolve,reject) => {
		fs.readFile(filePath,'utf8',(err,data) => {
			if(err) reject(err);
			resolve(data);
		});
	});
}

// функция записи в файл, возвращающая promise
const writeFile = (filePath,data) => {
	return new Promise((resolve,reject) => {
		fs.writeFile(filePath,data,'utf8',(err) => {
			if(err) reject(err);
			resolve();
		});
	});
}

// инициализируем bodyParser для POST запросов
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// GET запрос на получение данных
app.get('/getevents', (req,res) => {
	readFile(eventsFilePath).then(data => {
		res.end(data);
	});
});

// POST запрос на обновление данных
app.post('/updateevents', (req,res) => {
	let data = `{"events":${req.body.events}}`;
	console.log('new post entry!!!',data);
	writeFile(eventsFilePath,data).then(() => {
		res.end("Data was successufy written!");
	});
});