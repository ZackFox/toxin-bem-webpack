(function($) {
  const defaults = {
    minItems: 0,
    maxItems: Infinity,
    selectionText: "How many item",
    plurals: ["item", "items"],
    controls: {
      position: "right",
      displayCls: "iqdropdown-content",
      controlsCls: "iqdropdown-item-controls",
      counterCls: "counter",
    },
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
        const counter = Number($item.find(".iqdropdown-counter").text());

        const minCount = Number.isNaN(min) ? 0 : min;
        const maxCount = Number.isNaN(max) ? Infinity : max;
        const value = !Number.isNaN(counter) && counter >= minCount ? counter : minCount;

        settings.items[id] = { minCount, maxCount, value };
        itemCount[id] = value;
        totalItems += itemCount[id];
      }

      function addControls(id, $item) {
        const $counter = $item.find(".iqdropdown-counter");
        $counter
          .addClass(settings.controls.counterCls)
          .text(itemCount[id])
          .wrap(`<div class="${settings.controls.controlsCls}">`);

        const $controls = $counter.parent();

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

        $controls.prepend($decrementButton);
        $controls.append($incrementButton);

        $decrementButton.click(event => {
          const { items, minItems, beforeDecrement } = settings;
          const allowClick = beforeDecrement(id, itemCount);
          const targetOption = event.currentTarget.closest(".iqdropdown-menu-option");

          if (allowClick && totalItems > minItems && itemCount[id] > items[id].minCount) {
            itemCount[id] -= 1;
            totalItems -= 1;
            $counter.html(itemCount[id]);
            targetOption.dataset.count = itemCount[id];

            updateSelectionText();
          }

          event.preventDefault();
        });

        $incrementButton.click(event => {
          const { items, maxItems, beforeIncrement } = settings;
          const allowClick = beforeIncrement(id, itemCount);
          const targetOption = event.currentTarget.closest(".iqdropdown-menu-option");

          if (allowClick && totalItems < maxItems && itemCount[id] < items[id].maxCount) {
            itemCount[id] += 1;
            totalItems += 1;
            $counter.html(itemCount[id]);
            targetOption.dataset.count = itemCount[id];
            updateSelectionText();
          }

          event.preventDefault();
        });

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
