// импорт общих функций
const Functions = require('../functions.js');

// импорт переменных
const Variables = require('../variables.js');

// Функция инициализации блока назначения времени
const initModifyEventsForm = () => {
  // очистка списка времени
  document.getElementById('modify-events-form_ul').innerHTML = '';

  let start = {
    hours:parseInt(Variables.beginTime.split(':')[0]), 
    minutes:parseInt(Variables.beginTime.split(':')[1])
  };
  let end = {
    hours:parseInt(Variables.finalTime.split(':')[0]), 
    minutes:parseInt(Variables.finalTime.split(':')[1])
  };

  // перевод полученного время в минуты
  let startTime = start.hours * 60 + start.minutes;
  let endTime = end.hours * 60 + end.minutes;

  // нахождене кол-ва временых элементов
  let time_amount = Math.floor((endTime - startTime) / Variables.periodTime);

  // генерирование временых элементов
  for(let i = 0; i <= time_amount; i++) {
    let time = startTime + Variables.periodTime * i;
    let hours = Math.floor(time / 60);

    if(hours <= 23) {
      hours = hours >= 10 ? hours : `0${hours}`;
    } else {
      continue;
    }

    let minutes = time % 60 >= 10 ? time % 60 : `0${time % 60}`;

    let fullTime = `${hours}:${minutes}`;

    // функция для проверки, все ли выделенные мероприятия имеют одинаковое время
    const activesTimeIsSame = (time) => {
      let isSame = true;

      if(Functions.getActiveEvents().length > 0) {
        for(let el of Functions.getActiveEvents()) {
          if(time !== el.querySelector('span.event-item_time').innerHTML) {
            isSame = false;
            break;
          }
        }
      } else {
        isSame = false;
      }

      return isSame;
    }

    // создание элемента со временем
    let li = Functions.createNewDomElement({
      element:'li',
      // если все выделенные мероприятия имееют одинаковое время, то выделеям данный временой элемент
      className: activesTimeIsSame(fullTime) ? 
                 'modify-events-form_ul_item active disabled' : 
                 'modify-events-form_ul_item',
      text:fullTime
    });

    document.getElementById('modify-events-form_ul').appendChild(li);

    li.addEventListener('click', e => {
      let ids = Functions.getActiveEvents().map(el => parseInt(el.id.split('*')[1]));

      if(Functions.getActiveEvents().length > 0 && !e.target.className.includes(' disabled')) {
        // обновляем мероприятия
        Functions.updateEventsById(ids, e.target.innerHTML, Variables.main_events_arr);

        // убираем у текущего временого элемента класс "active" и "disabled"
        if(e.target.parentElement.querySelector('li.modify-events-form_ul_item.active')) {
          let el = e.target.parentElement.querySelector('li.modify-events-form_ul_item.active');

          el.className = el.className.replace(' active', '');
          el.className = el.className.replace(' disabled', '');
        }

        // делаем текущий временой элемент активным и блокируем его
        e.target.className = e.target.className + ' active disabled';
      } else if(Functions.getActiveEvents().length === 0 && !e.target.className.includes(' disabled')) {
        // убираем у текущего временого элемента класс "active"
        if(e.target.parentElement.querySelector('li.modify-events-form_ul_item.active')) {
          let el = e.target.parentElement.querySelector('li.modify-events-form_ul_item.active');

          el.className = el.className.replace(' active', '');
        }

        // делаем текущий временой элемент активным
        e.target.className = e.target.className + ' active';

        // ищем все мероприятия с таким же временем как у выбранного временого элемента
        Functions.getEventsElements().forEach(el => {
          // выделяем элементы
          if(el.querySelector('span.event-item_time').innerHTML === e.target.innerHTML) {
            el.className = el.className + ' active';
            el.querySelector('input[type=checkbox]').checked = true;
          }
        });

        // если есть выделенные мероприятия с таким же временем, то блокируем их
        if(Functions.getActiveEvents().length > 0) {
          e.target.className = e.target.className + ' disabled';
        }
      }
    });
  }
}

initModifyEventsForm();

module.exports = {
  initModifyEventsForm
};