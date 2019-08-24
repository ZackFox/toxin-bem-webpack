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
        const minCount = Number($item.data("mincount"));
        const maxCount = Number($item.data("maxcount"));

        settings.items[id] = {
          minCount: Number.isNaN(Number(minCount)) ? 0 : minCount,
          maxCount: Number.isNaN(Number(maxCount)) ? Infinity : maxCount,
        };

        itemCount[id] = settings.items[id].minCount;
        totalItems += itemCount[id];
      }

      function addControls(id, $item, items) {
        const $controls = $("<div />").addClass(settings.controls.controlsCls);
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

        const $counter = $(`<span>${items[id].minCount}</span>`).addClass(
          settings.controls.counterCls,
        );

        $item.children("div").addClass(settings.controls.displayCls);
        $controls.append($decrementButton, $counter, $incrementButton);

        if (settings.controls.position === "right") {
          $item.append($controls);
        } else {
          $item.prepend($controls);
        }

        $decrementButton.click(event => {
          const { items, minItems, plurals, beforeDecrement, onChange } = settings;
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
          const { items, maxItems, plurals, beforeIncrement, onChange } = settings;
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
        addControls(id, $item, settings.items);
      });

      updateSelectionText();
    });

    return this;
  };
})(jQuery);
