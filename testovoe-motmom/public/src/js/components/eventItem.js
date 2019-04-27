// импорт общих функций
const Functions = require('../functions.js');

// импорт переменных
const Variables = require('../variables.js');

// импорт функции инициализации временых блоков
const initModifyEventsForm = require('./timeItemsList.js').initModifyEventsForm;

// Функция создания и добавления HTML элемента для мероприятия
const createNewEventElement = (event, ...params) => {
  // создаем необходимые HTML элементы для мероприятия
  let checkbox_el = Functions.createNewDomElement({
    element:'input',
    inputType:'checkbox',
    className:'event-item_checkbox'
  });
  let time_el = Functions.createNewDomElement({
    element:'span',
    className:'event-item_time',
    text:event.time
  });
  let text_el = Functions.createNewDomElement({
    element:'span',
    className:'event-item_text',
    text:event.name
  });
  let deleteBtn_el = Functions.createNewDomElement({
    element:'button',
    className:'event-item_delete-btn',
    text:'x'
  });

  // если был передан дополнительный параметр с идентификаторами, то делаем подходящие элементы активными
  let li_class_name = '';
  if(params[0] && params[0].indexOf( parseInt(event.id) ) !== -1) {
    li_class_name = 'main-ul_item event-item active';
    checkbox_el.checked = true;
  } else {
    li_class_name = 'main-ul_item event-item';
  }
  let li_el = Functions.createNewDomElement({
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
    // проверяем, на какой элемент было произведено нажатие
    // (на главный целый элемент мероприятия или на его дочерние элементы)
    if(e.target.children.length > 0) {
      let checkbox = e.target.querySelector('input[type=checkbox]');
      checkbox.checked = !checkbox.checked;
      let el = e.target;
      let key_word = ' active';

      // выделяем мероприятие
      el.className = el.className.includes(key_word) ? 
                     el.className.replace(key_word,'') : 
                     el.className+key_word;

      // перерисовываем временые блоки
      initModifyEventsForm();
    } else {
      let checkbox = e.target.parentElement.querySelector('input[type=checkbox]');

      if(e.target != checkbox) {
        checkbox.checked = !checkbox.checked;
      }

      let el = e.target.parentElement;
      let key_word = ' active';

      // выделяем мероприятие
      el.className = el.className.includes(key_word) ? 
                     el.className.replace(key_word,'') : 
                     el.className+key_word;

      // перерисовываем временые блоки
      initModifyEventsForm();
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
    if(confirm(`Удалить "${pretty_event_info}"?`)) {
      Functions.deleteEvent(id, Variables.main_events_arr);
    }

    // отмена "всплытия", чтобы избежать срабатывания обработчиков событий на остальных элементах
    e.stopPropagation();
  });
}

// Функция отрисовки мероприятий
window.renderEvents = (events, ...params) => {
  document.getElementById('main-ul').innerHTML = ''; // удаление всех элементов из списка

  events = Functions.sortEventsByTime(events); // сортировка мероприятий по времени

  // отрисовка элементов
  for(let event of events){
    createNewEventElement(event,params[0]);
  }
}

module.exports = {
   createNewEventElement
};