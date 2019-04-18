window.onload = function(){
	let main_events_arr = undefined; // будущий массив со всеми мероприятиями

	let beginTime = '08:00'; // начальное время для инициализации блока назначения времени
	let finalTime = '16:00'; // конечное время для инициализации блока назначения времени
	let periodTime = 30; // период для инициализации блока назначения времени

	let modifyStartTime_input = document.getElementById('modify-events_options_start-time'); // слайдер с начальеым временем
	let modifyEndTime_input = document.getElementById('modify-events_options_end-time'); // слайдер с конечным временем
	let modifyPeriod_input = document.getElementById('modify-events_options_period'); // слайдер с периодом

	let form_switching = false; // текущее состояние формы для добвления нового мероприятия (чтобы избежать проблем при двойном клике на кнопку вызова формы)

	// Функция создания нового HTML элемента
	const createNewDomElement = (options) => {
		let {element,inputType,className,id,text} = options; // Деструктуризация параметра с информацией о элементе
		
		// создание нового элемента и присваивание ему нужных свойств
		let newEl = document.createElement(element); 
		if(className) newEl.setAttribute('class',className);
		if(id) newEl.setAttribute('id',id);
		if(inputType) newEl.setAttribute('type',inputType);
		if(text){
			let textNode = document.createTextNode(text);
			newEl.appendChild(textNode);
		}
		return newEl;
	}

	// Функция отправки данных о мероприятиях на сервер для их обновления с помощью AJAX
	const updateEventsJSON = events => {
		return new Promise((resolve,reject) => {
			$.ajax({
				type: 'POST',
				url: '/updateevents',
				data: {
					events: JSON.stringify(events)
				},
				success: data => {
					resolve(data);
				}
			});
		});
	}

	// Функция удаления мероприятия
	const deleteEvent = id => {
		// удаление мероприятия с переданным идентификатором из общего массива
		main_events_arr = main_events_arr.filter(el => el.id !== id);
		
		// отправка информации о мероприятиях на сервер для их обновления
		updateEventsJSON(main_events_arr).then(data => {
			// удаление HTML элемента с мероприятием
			document.getElementById('main-ul').removeChild(document.getElementById(`main-ul_item*${id}`));
			
			// отменить выделение элемента назначения времени после удаления мероприятия
			if(document.getElementById('modify-events-form').querySelector('li.modify-events-form_ul_item.active.disabled')) document.getElementById('modify-events-form').querySelector('li.modify-events-form_ul_item.active.disabled').className = document.getElementById('modify-events-form').querySelector('li.modify-events-form_ul_item.active.disabled').className.replace(' active disabled','');
			
			// отрисовка измененного списка мероприятий
			renderEvents(main_events_arr);
		});
	}

	// Функция для получения HTML элементов выделенных мероприятий
	const getActiveEvents = () => {
		let activeEvents = Array.from(document.getElementsByClassName('event-item')).filter(el => el.querySelector('input[type=checkbox]').checked);
		return activeEvents;
	}

	// Функция для получения HTML элементов мероприятий
	const getEventsElements = () => {
		let events_els = Array.from(document.getElementsByClassName('event-item'));
		return events_els;
	}

	// Функция для получения временых элементов
	const getModifyEventsTimeElements = () => {
		let time_els = Array.from(document.getElementsByClassName('modify-events-form_ul_item'));
		return time_els;
	}

	// Функция создания и добавления HTML элемента для мероприятия
	const createNewEventElement = (event,...params) => {
		// создаем необходимые HTML элементы для мероприятия
		let checkbox_el = createNewDomElement({
			element:'input',
			inputType:'checkbox',
			className:'event-item_checkbox'
		});
		let time_el = createNewDomElement({
			element:'span',
			className:'event-item_time',
			text:event.time
		});
		let text_el = createNewDomElement({
			element:'span',
			className:'event-item_text',
			text:event.name
		});
		let deleteBtn_el = createNewDomElement({
			element:'button',
			className:'event-item_delete-btn',
			text:'x'
		});

		// если был передан дополнительный параметр с идентификаторами, то делаем подходящие элементы активными
		let li_class_name = '';
		if(params[0] && params[0].indexOf(event.id) !== -1){
			li_class_name = 'main-ul_item event-item active';
			checkbox_el.checked = true;
		}else {
			li_class_name = 'main-ul_item event-item';
		}
		let li_el = createNewDomElement({
			element:'li',
			className:li_class_name,
			id:`main-ul_item*${event.id}`
		});

		// добавляем все созданные элементы к основному элементу
		li_el.appendChild(checkbox_el);
		li_el.appendChild(time_el);
		li_el.appendChild(text_el);
		li_el.appendChild(deleteBtn_el);
		document.getElementById('main-ul').appendChild(li_el);

		// добавляем действие при клике на данный элемент, при котором будет выделяться мероприятие
		li_el.addEventListener('click', e => {
			// проверяем, на какой элемент было произведено нажатие (на главный целый элемент мероприятия или на его дочерние элементы)
			if(e.target.children.length > 0){
				let checkbox = e.target.querySelector('input[type=checkbox]');
				checkbox.checked = !checkbox.checked;
				let el = e.target;
				let key_word = ' active';

				// выделяем мероприятие
				el.className = el.className.includes(key_word) ? el.className.replace(key_word,'') : el.className+key_word;

				// перерисовываем временые блоки
				initModifyEventsForm(beginTime,finalTime,periodTime);
			}else {
				let checkbox = e.target.parentElement.querySelector('input[type=checkbox]');
				if(e.target != checkbox) checkbox.checked = !checkbox.checked;
				let el = e.target.parentElement;
				let key_word = ' active';
				
				// выделяем мероприятие
				el.className = el.className.includes(key_word) ? el.className.replace(key_word,'') : el.className+key_word;

				// перерисовываем временые блоки
				initModifyEventsForm(beginTime,finalTime,periodTime);
			}
		});

		// дабавлеям дейсвие при нажатии на кнопку удаления
		deleteBtn_el.addEventListener("click", e => {
			// собираем информацию о мероприятии, который собираемся удалить
			let id = parseInt(e.target.parentElement.id.split("*")[1]);
			let time = e.target.parentElement.querySelector('.event-item_time').innerHTML;
			let value = e.target.parentElement.querySelector('.event-item_text').innerHTML;
			let pretty_event_info = `${time} - ${value}`;
			
			// подтверждаем удаление и вызываем функцию удаления
			if(confirm(`Удалить "${pretty_event_info}"?`)) deleteEvent(id);
			
			// отмена "всплытия", чтобы избежать срабатывания обработчиков событий на остальных элементах
			e.stopPropagation();
		});
	}

	// Функция отрисовки мероприятий
	const renderEvents = (events,...params) => {
		document.getElementById('main-ul').innerHTML = ''; // удаление всех элементов из списка
		events = sortEventsByTime(events); // сортировка мероприятий по времени
		
		// отрисовка элементов
		for(let event of events){
			createNewEventElement(event,params[0]);
		}
	}

	// Функция сортировки мероприятий по времени
	const sortEventsByTime = events => {
		let events_copy = events.slice(); // делаем копию мероприятий
		events_copy.sort((cur,next) => {
			// сравниваем текущее время мероприятия и следующее, и возвращаем соответствующее значение
			let time_cur = parseInt(cur.time.split(':')[0])*60+parseInt(cur.time.split(':')[1]);
			let time_next = parseInt(next.time.split(':')[0])*60+parseInt(next.time.split(':')[1]);
			if(time_cur >= time_next) return 1;
			else return -1;
		});
		return events_copy;
	}

	// Функция добавления нового мероприятия
	const addNewEvent = event => {
		main_events_arr.push(event); // добавлем новое мероприятие в общий массив

		// отправляем новые данные на сервер для обновления
		updateEventsJSON(main_events_arr).then(data => {
			// чистим поля ввода в форме добавления 
			document.getElementById('add-event-form_event-name-input').value = '';
			document.getElementById('add-event-form_event-time-input').value = '';
			
			// переотрисовываем мероприятия
			renderEvents(main_events_arr);
		});
	}

	// Функция обновления мероприятий
	const updateEventsById = (ids,time) => {
		// каждому подходящему мероприятию присваиваем новое время
		main_events_arr = main_events_arr.map(el => {
			if(ids.indexOf(el.id) !== -1){
				el.time = time;
			}
			return el;
		});

		// обновляем данные
		updateEventsJSON(main_events_arr).then(data => {
			renderEvents(main_events_arr,ids);
		});
	}

	// Функция инициализации блока назначения времени
	const initModifyEventsForm = (timeStart,timeEnd,timePeriod) => {
		document.getElementById('modify-events-form_ul').innerHTML = ''; // очистка списка времени

		let start = {hours:parseInt(timeStart.split(':')[0]),minutes:parseInt(timeStart.split(':')[1])};
		let end = {hours:parseInt(timeEnd.split(':')[0]),minutes:parseInt(timeEnd.split(':')[1])};

		// перевод полученного время в минуты
		let startTime = start.hours*60+start.minutes;
		let endTime = end.hours*60+end.minutes;

		// нахождене кол-ва временых элементов
		let time_amount = Math.floor((endTime-startTime)/timePeriod);

		// генерирование временых элементов
		for(let i = 0; i <= time_amount; i++){
			let time = startTime+timePeriod*i;
			let hours = Math.floor(time/60);
			if(hours <= 23){
				hours = hours >= 10 ? hours : `0${hours}`;
			}else {
				continue;
			}
			let minutes = time%60 >= 10 ? time%60 : `0${time%60}`;

			let fullTime = `${hours}:${minutes}`;

			// функция для проверки, все ли выделенные мероприятия имеют одинаковое время
			const activesTimeIsSame = (time) => {
				let isSame = true;
				if(getActiveEvents().length > 0){
					for(let el of getActiveEvents()){
						if(time !== el.querySelector('span.event-item_time').innerHTML){
							isSame = false;
							break;
						}
					}
				}else isSame = false;
				return isSame;
			}

			// создание элемента со временем
			let li = createNewDomElement({
				element:'li',
				// если все выделенные мероприятия имееют одинаковое время, то выделеям данный временой элемент
				className: (activesTimeIsSame(fullTime)) ? 'modify-events-form_ul_item active disabled' : 'modify-events-form_ul_item',
				text:fullTime
			});
			document.getElementById('modify-events-form_ul').appendChild(li);

			li.addEventListener('click', e => {
				let ids = getActiveEvents().map(el => parseInt(el.id.split('*')[1]));

				if(getActiveEvents().length > 0 && !e.target.className.includes(' disabled')){
					// обновляем мероприятия
					updateEventsById(ids,e.target.innerHTML);

					// убираем у текущего временого элемента класс "active" и "disabled"
					if(e.target.parentElement.querySelector('li.modify-events-form_ul_item.active')){
						let el = e.target.parentElement.querySelector('li.modify-events-form_ul_item.active');
						el.className = el.className.replace(' active','');
						el.className = el.className.replace(' disabled','');
					}
					// делаем текущий временой элемент активным и блокируем его
					e.target.className = e.target.className+' active disabled';
				}else if(getActiveEvents().length === 0 && !e.target.className.includes(' disabled')){
					// убираем у текущего временого элемента класс "active"
					if(e.target.parentElement.querySelector('li.modify-events-form_ul_item.active')){
						let el = e.target.parentElement.querySelector('li.modify-events-form_ul_item.active');
						el.className = el.className.replace(' active','');
					}
					// делаем текущий временой элемент активным
					e.target.className = e.target.className+' active';

					// ищем все мероприятия с таким же временем как у выбранного временого элемента
					getEventsElements().forEach(el => {
						// выделяем элементы
						if(el.querySelector('span.event-item_time').innerHTML === e.target.innerHTML){
							el.className = el.className+' active';
							el.querySelector('input[type=checkbox]').checked = true;
						}
					});
					// если есть выделенные мероприятия с таким же временем, то блокируем их
					if(getActiveEvents().length > 0) e.target.className = e.target.className+' disabled';
				}
			});
		}
	}

	// Функция инициализации приложения
	const loadApp = () => {
		// отрисовываем мероприятия, если мероприятий нет - уведомляем об этом
		if(main_events_arr.length > 0) renderEvents(main_events_arr);
		else document.getElementById('main-ul').appendChild(createNewDomElement({element:'h1',id:'main-ul_info-text',text:'Мероприятий нет'}));

		// ставим слайдерам значения из переменных
		modifyStartTime_input.value = beginTime.split(':')[0];
		modifyEndTime_input.value = finalTime.split(':')[0];
		modifyPeriod_input.value = periodTime;

		// обвновляем текст о текущем значении слайдеров
		document.getElementById('modify-events_options-info_start-time').children[1].innerHTML = beginTime;
		document.getElementById('modify-events_options-info_end-time').children[1].innerHTML = finalTime;
		document.getElementById('modify-events_options-info_period').children[1].innerHTML = periodTime;

		// инициализируем временой блок
		initModifyEventsForm(beginTime,finalTime,periodTime);

		// добавляем событие, когда происходит отправка формы
		document.getElementById('add-event-form').addEventListener('submit', e => {
			// блокируем действие по-умолчанию
			e.preventDefault();

			// генерируем новое мероприятие
			let new_id = main_events_arr[main_events_arr.length-1].id+1;
			let new_name = document.getElementById('add-event-form_event-name-input');
			let new_time = document.getElementById('add-event-form_event-time-input');
			let new_event = {id:new_id,name:new_name.value,time:new_time.value};

			// проверяем, пустые ли значения
			if(new_name.value && new_time.value){
				// проверяем, является ли веденное значение временем в формате HH:MM
				if((/\d{2}:\d{2}/).test(new_time.value) && parseInt(new_time.value.split(':')[0]) <= 23 && parseInt(new_time.value.split(':')[1]) <= 59){
					// добавлем новое мероприятие
					addNewEvent(new_event);

					// закрываем форму и возвращаемся обратно к списку мероприятий
					let el2 = document.getElementById('add-event-form_container');
					let el1 = document.getElementById('events-form_wrapper');
					animateForm(el1,el2,el1.offsetLeft);

				}else new_time.focus();
			}else {
				// если данные не были введены, то делаем фокусировку на соответствующем поле ввода
				if(!new_name.value) new_name.focus();
				else if(!new_time.value) new_time.focus();
			}
		});

		// при изменении значения слайдера, изменяем соответствующий ему текст
		modifyStartTime_input.addEventListener('input',e => {
			let val = e.target.value;
			document.getElementById('modify-events_options-info_start-time').children[1].innerHTML = val >= 10 ? `${val}:00` : `0${val}:00`;
		});
		// после того, как изменения были сделаны, заново отрисовываем временые элементы
		modifyStartTime_input.addEventListener('change',e => {
			beginTime = e.target.value >= 10 ? `${e.target.value}:00` : `0${e.target.value}:00`;
			initModifyEventsForm(beginTime,finalTime,periodTime);
		});

		// при изменении значения слайдера, изменяем соответствующий ему текст
		modifyEndTime_input.addEventListener('input',e => {
			let val = e.target.value;
			document.getElementById('modify-events_options-info_end-time').children[1].innerHTML = val >= 10 ? `${val}:00` : `0${val}:00`;
		});
		// после того, как изменения были сделаны, заново отрисовываем временые элементы
		modifyEndTime_input.addEventListener('change',e => {
			finalTime = e.target.value >= 10 ? `${e.target.value}:00` : `0${e.target.value}:00`;
			initModifyEventsForm(beginTime,finalTime,periodTime);
		});

		// при изменении значения слайдера, изменяем соответствующий ему текст
		modifyPeriod_input.addEventListener('input',e => {
			let val = e.target.value;
			document.getElementById('modify-events_options-info_period').children[1].innerHTML = val >= 10 ? `${val}` : `0${val}`;
		});
		// после того, как изменения были сделаны, заново отрисовываем временые элементы
		modifyPeriod_input.addEventListener('change',e => {
			periodTime = e.target.value;
			initModifyEventsForm(beginTime,finalTime,periodTime);
		});

		// функция анимации при вызове формы добавления
		const animateForm = (el1,el2,val) => {
			form_switching = true; // анимация началась
			$(el2).animate({"left":`-=${val}px`});
			$(el1).animate({"left":`-=${val}px`},() => {
				form_switching = false; // анимация закончилась 
			});
		}
		
		// при нажатии на кнопку добавления нового мероприятия, вызываем форму
		document.getElementById('events-add_button').addEventListener('click', e => {
			let el2 = document.getElementById('add-event-form_container');
			let el1 = document.getElementById('events-form_wrapper');
			if(!form_switching) animateForm(el1,el2,el2.offsetLeft);
		});

		// при нажатии на кнопку отмены, закрываем форму и очищаем поля ввода, если было что-то введено
		document.getElementById('add-event-form_cancel-btn').addEventListener('click', e => {
			e.preventDefault();
			let el2 = document.getElementById('add-event-form_container');
			let el1 = document.getElementById('events-form_wrapper');
			if(!form_switching) animateForm(el1,el2,el1.offsetLeft);
			document.getElementById('add-event-form_event-name-input').value = '';
			document.getElementById('add-event-form_event-time-input').value = '';
		});
	}

	// Запрос данных с сервера с помощью AJAX
	const loadData = () => {
		return new Promise((resolve) => {
			$.ajax({
				type: "GET",
				url: "/getevents",
				success: data => {
					main_events_arr = JSON.parse(data).events;
					resolve();
				}
			});
		});
	}

	// После получения данных, инициализируем приложение
	loadData().then(loadApp);
}