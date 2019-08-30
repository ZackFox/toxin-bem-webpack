(function($) {
  const defaults = {
    minItems: 0,
    maxItems: Infinity,
    selectionText: "How many item",
    plurals: ["item", "items"],
    buttons: {
      visible: false,
      resetButton: "reset",
      applyButton: "apply",
    },
    onChange: undefined,
    onReset: () => {},
    onApply: () => {},
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
      settings.limits = {};
      const itemState = {};
      let totalItems = 0;

      let $buttonReset = undefined;
      let $buttonApply = undefined;

      if (settings.buttons.visible) {
        $buttonReset = $(
          `<button class="iqdropdown-btn-reset">${settings.buttons.resetButton}</button>`,
        );
        $buttonApply = $(
          `<button class="iqdropdown-btn-apply">${settings.buttons.applyButton}</button>`,
        );
      }

      function setItemState(id, $item) {
        const min = Number($item.data("mincount"));
        const max = Number($item.data("maxcount"));
        const counter = Number($item.find(".counter").text());

        const minCount = Number.isNaN(min) ? 0 : min;
        const maxCount = Number.isNaN(max) ? Infinity : max;
        const value = !Number.isNaN(counter) && counter >= minCount ? counter : minCount;

        settings.limits[id] = { minCount, maxCount, value };
        itemState[id] = value;
        totalItems += itemState[id];
      }

      function updateSelectionText() {
        const { onChange, plurals } = settings;
        if (totalItems === 0) {
          $selection.text(settings.selectionText);
        } else if (onChange === undefined) {
          $selection.text(`${totalItems} ${totalItems == 1 ? plurals[0] : plurals[1]}`);
        } else {
          $selection.text(onChange(totalItems, itemState, plurals));
        }
      }

      function updateItemLayout(id, item) {
        item.attr("data-value", itemState[id]);
        item
          .children()
          .eq(0)
          .val(itemState[id]);
        item
          .children()
          .eq(2)
          .children()
          .eq(1)
          .html(itemState[id]);
      }

      function updateControlsDisabled(id, decrBtn, incrBtn) {
        decrBtn.attr("disabled", itemState[id] === settings.limits[id].minCount);
        incrBtn.attr("disabled", itemState[id] === settings.limits[id].maxCount);
      }

      function updateResetDisabled(resetBtn) {
        resetBtn.attr("disabled", totalItems === 0);
      }

      function addControls(id, $item) {
        const $counter = $item
          .find(".counter")
          .wrap(`<div class="iqdropdown-item-controls">`);
        const $controls = $counter.parent();

        const $hiddenInput = $(`
          <input type="hidden" name="${id}" value="${itemState[id]}">            
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

        $decrementButton.click(event => {
          event.preventDefault();
          const { limits, minItems, beforeDecrement } = settings;
          const allowClick = beforeDecrement(id, itemState);

          if (
            allowClick &&
            totalItems > minItems &&
            itemState[id] > limits[id].minCount
          ) {
            itemState[id] -= 1;
            totalItems -= 1;
            updateItemLayout(id, $item);
            updateSelectionText();
            updateControlsDisabled(id, $decrementButton, $incrementButton);

            if (settings.buttons.visible) {
              updateResetDisabled($buttonReset);
            }
          }
        });

        $incrementButton.click(event => {
          event.preventDefault();
          const { limits, maxItems, beforeIncrement } = settings;
          const allowClick = beforeIncrement(id, itemState);

          if (
            allowClick &&
            totalItems < maxItems &&
            itemState[id] < limits[id].maxCount
          ) {
            itemState[id] += 1;
            totalItems += 1;
            updateItemLayout(id, $item);
            updateSelectionText();
            updateControlsDisabled(id, $decrementButton, $incrementButton);

            if (settings.buttons.visible) {
              updateResetDisabled($buttonReset);
            }
          }
        });

        updateControlsDisabled(id, $decrementButton, $incrementButton);
        $menu.click(event => event.stopPropagation());
        return $item;
      }

      function addMenuButtons() {
        const $container = $('<div class="iqdropdown-control-buttons" >');

        updateResetDisabled($buttonReset);

        $buttonReset.click(event => {
          event.preventDefault();
          totalItems = 0;

          $items.each(function() {
            const $item = $(this);
            const id = $item.data("id");

            itemState[id] = settings.limits[id].minCount;
            totalItems += settings.limits[id].minCount;
            updateItemLayout(id, $item);
          });

          updateSelectionText();
          updateResetDisabled($buttonReset);
        });

        $container.append($buttonReset, $buttonApply);
        $menu.append($container);
      }

      $this.click(() => {
        $this.toggleClass("menu-open");
      });

      $items.each(function() {
        const $item = $(this);
        const id = $item.data("id");
        setItemState(id, $item);
        addControls(id, $item);
      });

      if (settings.buttons.visible) {
        addMenuButtons();
      }
      updateSelectionText();
    });

    return this;
  };
})(jQuery);
