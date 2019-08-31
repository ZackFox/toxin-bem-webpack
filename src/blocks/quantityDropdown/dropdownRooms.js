import "./quantityDropdown.js";
import pluralize from "../../utils/pluralize.js";

$(document).ready(function() {
  $(".rooms-dropdown").iqDropdown({
    selectionText: "Удобства номера",
    plurals: {
      bedrooms: ["спальня", "спальни", "спален"],
      beds: ["кровать", "кровати", "кроватей"],
      baths: ["ванная комната", "ванных комнаты", "ванных комнат"],
    },
    onChange: function(total, counts, plurals) {
      let selectionText = "";
      const props = Object.keys(counts);
      let countOption = 0;
      for (let key of props) {
        if (counts[key] === 0) {
          continue;
        }
        ++countOption;
        if (countOption > 2) {
          selectionText += "...";
          break;
        }
        selectionText += `${selectionText ? ", " : ""}`;
        selectionText += `${pluralize(counts[key], plurals[key])}`;
      }
      return selectionText;
    },
  });
});
