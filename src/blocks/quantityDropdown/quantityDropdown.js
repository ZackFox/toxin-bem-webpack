(function($) {
  const defaults = {
    minItems: 0,
    maxItems: Infinity,
    selectionText: "How many item",
    plurals: ["item", "items"],
    controls: false,
    items: {},
    onChange: undefined,
    beforeDecrement: () => true,
    beforeIncrement: () => true,
  };

  $.fn.iqDropdown = function(options) {
    this.each(function() {
      const $this = $(this);
      const $selection = $this.find("p.iqdropdown-selection").last();
      const $menu = $this.find("div.iqdropdown-menu");
      const $items = $menu.find("div.iqdropdown-menu-option");
      const settings = $.extend(true, {}, defaults, options);
      const itemCount = {};
      let totalItems = 0;

      function updateSelectionText() {
        const { onChange, plurals } = settings;
        if (totalItems === 0) {
          $selection.text(settings.selectionText);
        } else if (onChange === undefined) {
          $selection.text(`${totalItems} ${totalItems == 1 ? plurals[0] : plurals[1]}`);
        } else {
          $selection.text(onChange(itemCount, totalItems, plurals));
        }
      }

      function setItemSettings(id, $item) {
        const min = Number($item.data("mincount"));
        const max = Number($item.data("maxcount"));
        const counter = Number($item.find(".counter").text());

        const minCount = Number.isNaN(min) ? 0 : min;
        const maxCount = Number.isNaN(max) ? Infinity : max;
        const value = !Number.isNaN(counter) && counter >= minCount ? counter : minCount;

        settings.items[id] = { minCount, maxCount, value };
        itemCount[id] = value;
        totalItems += itemCount[id];
      }

      function addControls(id, $item) {
        const $counter = $item.find(".counter");
        $counter.text(itemCount[id]).wrap(`<div class="iqdropdown-item-controls">`);

        const $controls = $counter.parent();

        const $hiddenInput = $(`
          <input type="hidden" name="${id}" value="${itemCount[id]}">            
        `);

        const $decrementButton = $(`
          <button class="button-decrement">
            <i class="icon-decrement"></i>
          </button>
        `);

        const $incrementButton = $(`
          <button class="button-increment">
            <i class="icon-decrement icon-increment"></i>
          </button>
        `);

        $item.prepend($hiddenInput);
        $controls.prepend($decrementButton);
        $controls.append($incrementButton);

        const disableButtons = () => {
          $decrementButton.attr(
            "disabled",
            itemCount[id] === settings.items[id].minCount,
          );
          $incrementButton.attr(
            "disabled",
            itemCount[id] === settings.items[id].maxCount,
          );
        };

        $decrementButton.click(event => {
          event.preventDefault();

          const { items, minItems, beforeDecrement } = settings;
          const allowClick = beforeDecrement(id, itemCount);
          const targetOption = event.currentTarget.closest(".iqdropdown-menu-option");

          if (allowClick && totalItems > minItems && itemCount[id] > items[id].minCount) {
            itemCount[id] -= 1;
            totalItems -= 1;
            $counter.html(itemCount[id]);
            $hiddenInput.val(itemCount[id]);
            targetOption.dataset.value = itemCount[id];

            updateSelectionText();
          }

          disableButtons();
        });

        $incrementButton.click(event => {
          event.preventDefault();

          const { items, maxItems, beforeIncrement } = settings;
          const allowClick = beforeIncrement(id, itemCount);
          const targetOption = event.currentTarget.closest(".iqdropdown-menu-option");
          console.log(event.currentTarget);
          if (allowClick && totalItems < maxItems && itemCount[id] < items[id].maxCount) {
            itemCount[id] += 1;
            totalItems += 1;
            $counter.html(itemCount[id]);
            $hiddenInput.val(itemCount[id]);
            targetOption.dataset.value = itemCount[id];
            updateSelectionText();
          }

          disableButtons();
        });

        disableButtons();
        $item.click(event => event.stopPropagation());
        return $item;
      }

      $this.click(() => {
        $this.toggleClass("menu-open");
      });

      $items.each(function() {
        const $item = $(this);
        const id = $item.data("id");

        setItemSettings(id, $item);
        addControls(id, $item);
      });

      updateSelectionText();
    });

    return this;
  };
})(jQuery);
