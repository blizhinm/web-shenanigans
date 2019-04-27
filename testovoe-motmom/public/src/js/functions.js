// Функция создания нового HTML элемента
const createNewDomElement = (options) => {
  // Деструктуризация параметра с информацией о элементе
  let { element, inputType, className, id, text } = options;

  // создание нового элемента и присваивание ему нужных свойств
  let newEl = document.createElement(element); 

  if(className) {
    newEl.setAttribute('class',className);
  }

  if(id) {
    newEl.setAttribute('id',id);
  }

  if(inputType) {
    newEl.setAttribute('type',inputType);
  }

  if(text) {
    let textNode = document.createTextNode(text);
    newEl.appendChild(textNode);
  }

  return newEl;
}

// Функция отправки данных о мероприятиях на сервер для их обновления с помощью AJAX
const updateEventsJSON = events => {
  return new Promise((resolve, reject) => {
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
const deleteEvent = (id, arr) => {
  // удаление мероприятия с переданным идентификатором из общего массива
  arr = arr.filter(el => parseInt(el.id) !== id);

  // отправка информации о мероприятиях на сервер для их обновления
  updateEventsJSON(arr).then(data => {
    // удаление HTML элемента с мероприятием
    document.getElementById('main-ul').removeChild(document.getElementById(`main-ul_item*${id}`));

    // отменить выделение элемента назначения времени после удаления мероприятия
    if(document.getElementById('modify-events-form').querySelector('li.modify-events-form_ul_item.active.disabled')) {
      document.getElementById('modify-events-form').querySelector('li.modify-events-form_ul_item.active.disabled').className = document.getElementById('modify-events-form').querySelector('li.modify-events-form_ul_item.active.disabled').className.replace(' active disabled', '');
    }

    // отрисовка измененного списка мероприятий
    window.renderEvents(arr);
  });
}

// Функция для получения HTML элементов выделенных мероприятий
const getActiveEvents = () => {
  let activeEvents = Array.from(document.getElementsByClassName('event-item')).filter(el => {
    return el.querySelector('input[type=checkbox]').checked;
  });

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

// Функция сортировки мероприятий по времени
const sortEventsByTime = events => {
  let events_copy = events.slice(); // делаем копию мероприятий

  events_copy.sort((cur, next) => {
    // сравниваем текущее время мероприятия и следующее, и возвращаем соответствующее значение
    let time_cur = parseInt(cur.time.split(':')[0]) * 60 + parseInt(cur.time.split(':')[1]);
    let time_next = parseInt(next.time.split(':')[0]) * 60 + parseInt(next.time.split(':')[1]);

    if(time_cur >= time_next) {
      return 1;
    } else {
      return -1;
    }
  });

  return events_copy;
}

// Функция сортировки мероприятий по индетификатору
const sortEventsByID = events => {
  let events_copy = events.slice(); // делаем копию мероприятий

  events_copy.sort((cur, next) => {
    // сравниваем текущий индетификатор мероприятия и следующий, и возвращаем соответствующее значение
    let id_cur = parseInt(cur.id);
    let id_next = parseInt(next.id);

    if(id_cur >= id_next) {
      return 1;
    } else {
      return -1;
    }
  });

  return events_copy;
}

// Функция добавления нового мероприятия
const addNewEvent = (event, arr) => {
  arr.push(event); // добавлем новое мероприятие в общий массив

  // отправляем новые данные на сервер для обновления
  updateEventsJSON(arr).then(data => {
    // чистим поля ввода в форме добавления 
    document.getElementById('add-event-form_event-name-input').value = '';
    document.getElementById('add-event-form_event-time-input').value = '';

    // переотрисовываем мероприятия
    window.renderEvents(arr);
  });
}


// Функция обновления мероприятий
const updateEventsById = (ids, time, arr) => {
  // каждому подходящему мероприятию присваиваем новое время
  arr = arr.map(el => {
    if(ids.indexOf( parseInt(el.id) ) !== -1) {
      el.time = time;
    }

    return el;
  });

  // обновляем данные
  updateEventsJSON(arr).then(data => {
    window.renderEvents(arr, ids);
  });
}

// Запрос данных с сервера с помощью AJAX
const loadData = () => {
  return new Promise((resolve) => {
    $.ajax({
      type: "GET",
      url: "/getevents",
      success: data => {
        resolve(JSON.parse(data).events);
      }
    });
  });
}

module.exports = {
  createNewDomElement,
  updateEventsJSON,
  deleteEvent,
  getActiveEvents,
  getEventsElements,
  getModifyEventsTimeElements,
  sortEventsByTime,
  sortEventsByID,
  addNewEvent,
  updateEventsById,
  loadData
};