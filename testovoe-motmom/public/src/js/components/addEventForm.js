// импорт общих фукнций
const Functions = require('../functions.js');

// импорт переменных
const Variables = require('../variables.js');

// функция анимации при вызове формы добавления
const animateForm = (el1 ,el2, val) => {
  Variables.form_switching = true; // анимация началась

  $(el2).animate({"left":`-=${val}px`});
  $(el1).animate({"left":`-=${val}px`},() => {
    Variables.form_switching = false; // анимация закончилась 
  });
}

// добавляем событие, когда происходит отправка формы
const initListeners = () => {
  // при нажатии на кнопку добавления нового мероприятия, вызываем форму
  document.getElementById('events-add_button').addEventListener('click', e => {
    let el2 = document.getElementById('add-event-form_container');
    let el1 = document.getElementById('events-form_wrapper');

    if(!Variables.form_switching) {
      animateForm(el1, el2, el2.offsetLeft);
    }
  });

  document.getElementById('add-event-form').addEventListener('submit', e => {
    // блокируем действие по-умолчанию
    e.preventDefault();

    let events_array = Functions.sortEventsByID(Variables.main_events_arr);

    // генерируем новое мероприятие
    let new_id = parseInt(events_array[events_array.length-1].id) + 1;
    let new_name = document.getElementById('add-event-form_event-name-input');
    let new_time = document.getElementById('add-event-form_event-time-input');
    let new_event = { id:new_id, name:new_name.value, time:new_time.value };

    // проверяем, пустые ли значения
    if(new_name.value && new_time.value) {
      // проверяем, является ли веденное значение временем в формате HH:MM
      if((/\d{2}:\d{2}/).test(new_time.value) && parseInt(new_time.value.split(':')[0]) <= 23 
          && parseInt(new_time.value.split(':')[1]) <= 59) {
      // добавлем новое мероприятие
      Functions.addNewEvent(new_event, Variables.main_events_arr);

      // закрываем форму и возвращаемся обратно к списку мероприятий
      let el2 = document.getElementById('add-event-form_container');
      let el1 = document.getElementById('events-form_wrapper');

      animateForm(el1, el2, el1.offsetLeft);

      } else {
        new_time.focus();
      }
    } else {
      // если данные не были введены, то делаем фокусировку на соответствующем поле ввода
      if(!new_name.value) {
        new_name.focus();
      } else if(!new_time.value) {
        new_time.focus();
      }
    }
  });

  // при нажатии на кнопку отмены, закрываем форму и очищаем поля ввода, если было что-то введено
  document.getElementById('add-event-form_cancel-btn').addEventListener('click', e => {
    e.preventDefault();

    let el2 = document.getElementById('add-event-form_container');
    let el1 = document.getElementById('events-form_wrapper');

    if(!Variables.form_switching) {
      animateForm(el1, el2, el1.offsetLeft);
    }

    document.getElementById('add-event-form_event-name-input').value = '';
    document.getElementById('add-event-form_event-time-input').value = '';
  });
}

module.exports = {
  initListeners
}