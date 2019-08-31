import "./quantityDropdown.js";
import pluralize from "../../utils/pluralize.js";

$(document).ready(function() {
  $(".guests-dropdown").iqDropdown({
    selectionText: "Сколько гостей",
    plurals: {
      guests: ["гость", "гостя", "гостей"],
      babies: ["младенец", "младенца", "младенцев"],
    },
    buttons: {
      visible: true,
      resetButton: "очистить",
      applyButton: "применить",
    },
    onChange: function(total, counts, plurals) {
      counts = {
        guests: counts.adults + counts.children,
        babies: counts.babies,
      };

      let selectionText = "";
      const props = Object.keys(counts);
      for (let key of props) {
        if (counts[key] === 0) {
          continue;
        }
        selectionText += `${selectionText ? ", " : ""}`;
        selectionText += `${pluralize(counts[key], plurals[key])}`;
      }
      return selectionText;
    },
  });
});
