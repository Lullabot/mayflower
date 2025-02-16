export default (function (window, document, $) {
  
  $('.js-main-nav').each(function () {
    let openClass = "is-open",
      hasFocus = "has-focus",
      closeClass = "is-closed",
      submenuClass = "show-submenu",
      $mainNavList = $(this),
      $mainNavItems = $mainNavList.find('.js-main-nav-toggle'), // li
      $mainNavItemsToggle = $mainNavList.find('.js-main-nav-toggle > button'); // button

    $mainNavItems.on('keydown mouseleave', function (e) {
      // Grab all the DOM info we need...
      let $topLevelItem = $(this), // li
        // open = $topLevelItem.hasClass(openClass),
        $openContent = $mainNavList.find('.js-main-nav-content.' + openClass),
        $focusedElement = $(document.activeElement),
        // Easy access to the key that was pressed.
        key = e.key,
        action = {
          'tab': key === "Tab", // tab
          'close': key === "Esc" || key === "Escape", // esc
          'left': key === "Left" || key === "ArrowLeft", // left arrow
          'right': key === "Right" || key === "ArrowRight", // right arrow
          'up': key === "Up" || key === "ArrowUp", // up arrow
          'down': key === "Down" || key === "ArrowDown"
        },
        // relevant if open..
        $topLevelButton = $topLevelItem.find('.ma__main-nav__top-link'), // button
        $dropdownContent = $topLevelItem.find('.js-main-nav-content'), // div
        $dropdownLinks = $dropdownContent.find('a'),
        dropdownLinksLength = $dropdownLinks.length,
        focusIndexInDropdown = $dropdownLinks.index($focusedElement);
          
      // Default behavior is prevented for all actions except 'tab'.
      if (action.close || action.left || action.right || action.up || action.down) {
        e.preventDefault();
      }

      if (action.left || action.right) {
        let index = $mainNavItems.index($topLevelItem),
          prev = action.left,
          linkCount = $mainNavItems.length;
        // hide content
        // If menubar focus
        //  - Change menubar item
        //
        // If dropdown focus
        //  - Open previous pull down menu and select first item
        hide($openContent);
        $topLevelButton.attr('aria-expanded', 'false');
        $topLevelItem.removeClass(hasFocus);
        // Get previous item if left arrow, next item if right arrow.
        index += (prev ? -1 : 1);
        // Wrap around if at the end of the set of menus.
        index = ((index % linkCount) + linkCount) % linkCount;
        $mainNavItemsToggle[index].focus();
        // return;
      }

      if (action.up || action.down) {
        // If submenu is not open already
        if ($openContent.length === 0) {
          // Open the submenu
          show($dropdownContent);
          $topLevelButton.attr('aria-expanded', 'true');
          $topLevelItem.addClass(openClass);
          if (action.up) {
            focusIndexInDropdown = dropdownLinksLength - 1;
          } else {
            focusIndexInDropdown = 0;
          }  
          $dropdownLinks[focusIndexInDropdown].focus(); 
        }
        else {
          // Adjust index of active menu item based on performed action.
          focusIndexInDropdown += (action.up ? -1 : 1);
          // Wrap around if at the end of the submenu.
          focusIndexInDropdown = ((focusIndexInDropdown % dropdownLinksLength) + dropdownLinksLength) % dropdownLinksLength;
          $dropdownLinks[focusIndexInDropdown].focus();
        }
      }

      // Close previous menu after tabbing through the submenu to the next menu item
      if (action.tab && dropdownLinksLength === (focusIndexInDropdown + 1)) {
        hide($openContent);
        $topLevelButton.attr('aria-expanded', 'false');
        $topLevelItem.removeClass(hasFocus);
        return;
      }

      // Close menu and return focus to menubar
      if (action.close) {
        hide($openContent);
        $topLevelItem.removeClass(openClass);
        $topLevelItem.removeClass(hasFocus);
        $topLevelButton.focus().attr('aria-expanded', 'false');
        return;
      }

      if (e.type === 'mouseleave') {
        hide($dropdownContent);
        $topLevelButton.attr('aria-expanded', 'false');
        $topLevelItem.removeClass('is-open');
      }
    })

 
    // mouse events + space and enter keyboard events
    $mainNavItemsToggle.on('click mouseenter', function (e) {
      let $topLevelButton = $(this), // button
        $topLevelItem = $topLevelButton.parent(), // li
        $dropdownContent = $topLevelItem.find('.js-main-nav-content'),
        isOpen = $dropdownContent.hasClass(openClass);

        switch(e.type) {
          case 'click':
            if (isOpen) {
              hide($dropdownContent);
              $topLevelButton.attr('aria-expanded', 'false');
              $topLevelItem.removeClass('is-open');
            } else {
              show($dropdownContent);
              $topLevelButton.attr('aria-expanded', 'true');
              $topLevelItem.addClass('is-open');
            }
            break;
          case 'mouseenter':
            show($dropdownContent);
            $topLevelButton.attr('aria-expanded', 'true');
            $topLevelItem.addClass('is-open');
            break;
        }
    });

    function hide($dropdownContent) {
      $('body').removeClass(submenuClass);
      $mainNavList.find("." + openClass).removeClass(openClass);
      $dropdownContent
      .stop(true, true)
      .slideUp('fast', function () {
        $dropdownContent
          .addClass(closeClass)
          .slideDown(0);
      });
    }

    function show($dropdownContent) {
      $('body').addClass(submenuClass);
      $dropdownContent
      .stop(true, true)
      .slideUp(0, function () {
        $dropdownContent
          .addClass(openClass)
          .removeClass(closeClass)
          .slideDown('fast');
      });
    }
  });

})(window, document, jQuery);
