var fitness_insight_Keyboard_loop = function (elem) {
  var fitness_insight_tabbable = elem.find('select, input, textarea, button, a').filter(':visible');
  var fitness_insight_firstTabbable = fitness_insight_tabbable.first();
  var fitness_insight_lastTabbable = fitness_insight_tabbable.last();
  fitness_insight_firstTabbable.focus();

  fitness_insight_lastTabbable.on('keydown', function (e) {
    if ((e.which === 9 && !e.shiftKey)) {
        e.preventDefault();
        fitness_insight_firstTabbable.focus();
    }
  });

  fitness_insight_firstTabbable.on('keydown', function (e) {
    if ((e.which === 9 && e.shiftKey)) {
        e.preventDefault();
        fitness_insight_lastTabbable.focus();
    }
  });

  elem.on('keyup', function (e) {
    if (e.keyCode === 27) {
        elem.hide();
    };
  });
};