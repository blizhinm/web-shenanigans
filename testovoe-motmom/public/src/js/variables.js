// будущий массив со всеми мероприятиями
let main_events_arr = undefined;

// начальное время для инициализации блока назначения времени
let beginTime = '08:00';
// конечное время для инициализации блока назначения времени
let finalTime = '16:00';
// период для инициализации блока назначения времени
let periodTime = 30;

// слайдер с начальеым временем
let modifyStartTime_input = document.getElementById('modify-events_options_start-time');
// слайдер с конечным временем
let modifyEndTime_input = document.getElementById('modify-events_options_end-time');
// слайдер с периодом
let modifyPeriod_input = document.getElementById('modify-events_options_period');

// текущее состояние формы для добвления нового мероприятия 
// (чтобы избежать проблем при двойном клике на кнопку вызова формы)
let form_switching = false;

module.exports = {
  main_events_arr,
  beginTime,
  finalTime,
  periodTime,
  modifyStartTime_input,
  modifyEndTime_input,
  modifyPeriod_input,
  form_switching
}