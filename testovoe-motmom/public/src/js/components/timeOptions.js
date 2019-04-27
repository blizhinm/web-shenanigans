// импорт общих функций
const Functions = require('../functions.js');

// импорт переменных
const Variables = require('../variables.js');

// импорт функции инициализации временых блоков
const initModifyEventsForm = require('./timeItemsList.js').initModifyEventsForm;

// ставим слайдерам значения из переменных
Variables.modifyStartTime_input.value = Variables.beginTime.split(':')[0];
Variables.modifyEndTime_input.value = Variables.finalTime.split(':')[0];
Variables.modifyPeriod_input.value = Variables.periodTime;

// обвновляем текст о текущем значении слайдеров
document.getElementById('modify-events_options-info_start-time').children[1].innerHTML = Variables.beginTime;
document.getElementById('modify-events_options-info_end-time').children[1].innerHTML = Variables.finalTime;
document.getElementById('modify-events_options-info_period').children[1].innerHTML = Variables.periodTime;

const initListeners = () => {
  // при изменении значения слайдера, изменяем соответствующий ему текст
  Variables.modifyStartTime_input.addEventListener('input', e => {
    let val = e.target.value;

    document.getElementById('modify-events_options-info_start-time').children[1].innerHTML = val >= 10 ? 
                                                                                                    `${val}:00` : 
                                                                                                    `0${val}:00`;
  });
  // после того, как изменения были сделаны, заново отрисовываем временые элементы
  Variables.modifyStartTime_input.addEventListener('change', e => {
    Variables.beginTime = e.target.value >= 10 ? `${e.target.value}:00` : `0${e.target.value}:00`;

    initModifyEventsForm();
  });

  // при изменении значения слайдера, изменяем соответствующий ему текст
  Variables.modifyEndTime_input.addEventListener('input', e => {
    let val = e.target.value;

    document.getElementById('modify-events_options-info_end-time').children[1].innerHTML = val >= 10 ? 
                                                                                                  `${val}:00` : 
                                                                                                  `0${val}:00`;
  });
  // после того, как изменения были сделаны, заново отрисовываем временые элементы
  Variables.modifyEndTime_input.addEventListener('change', e => {
    Variables.finalTime = e.target.value >= 10 ? `${e.target.value}:00` : `0${e.target.value}:00`;

    initModifyEventsForm();
  });

  // при изменении значения слайдера, изменяем соответствующий ему текст
  Variables.modifyPeriod_input.addEventListener('input', e => {
    let val = e.target.value;

    document.getElementById('modify-events_options-info_period').children[1].innerHTML = val >= 10 ? 
                                                                                                `${val}` : 
                                                                                                `0${val}`;
  });
  // после того, как изменения были сделаны, заново отрисовываем временые элементы
  Variables.modifyPeriod_input.addEventListener('change', e => {
    Variables.periodTime = e.target.value;

    initModifyEventsForm();
  });
}

module.exports = {
  initListeners
}