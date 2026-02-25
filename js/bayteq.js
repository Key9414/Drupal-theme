/**
 * @file
 * Bayteq Developer Portal - Main JavaScript.
 *
 * Handles interactivity for:
 * - Password visibility toggle (Login)
 * - API catalog filtering
 * - API detail tabs
 * - Code block copy to clipboard
 * - Docs sidebar toggle
 * - Environment/Plan card selection (Create App)
 * - Navigation active state
 * - Mobile menu toggle
 */

(function (Drupal, once) {
  'use strict';

  /**
   * Password visibility toggle on login page.
   */
  Drupal.behaviors.bayteqPasswordToggle = {
    attach: function (context) {
      once('password-toggle', '.password-toggle', context).forEach(function (btn) {
        btn.addEventListener('click', function () {
          var input = btn.closest('.form-password-wrapper').querySelector('.form-input');
          if (input) {
            var isPassword = input.type === 'password';
            input.type = isPassword ? 'text' : 'password';
            btn.setAttribute('aria-label', isPassword ? Drupal.t('Hide password') : Drupal.t('Show password'));
          }
        });
      });
    }
  };

  /**
   * Copy to clipboard for code blocks.
   */
  Drupal.behaviors.bayteqCodeCopy = {
    attach: function (context) {
      once('code-copy', '.code-block__copy', context).forEach(function (btn) {
        btn.addEventListener('click', function () {
          var targetId = btn.getAttribute('data-copy-target');
          var codeEl = document.getElementById(targetId);
          if (codeEl) {
            var text = codeEl.textContent;
            navigator.clipboard.writeText(text).then(function () {
              btn.classList.add('is-copied');
              var originalHTML = btn.innerHTML;
              btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg> ' + Drupal.t('Copiado');
              setTimeout(function () {
                btn.classList.remove('is-copied');
                btn.innerHTML = originalHTML;
              }, 2000);
            });
          }
        });
      });
    }
  };

  /**
   * API Detail tabs switching.
   */
  Drupal.behaviors.bayteqTabs = {
    attach: function (context) {
      once('api-tabs', '.api-tabs', context).forEach(function (tabContainer) {
        var tabs = tabContainer.querySelectorAll('.api-tab');
        tabs.forEach(function (tab) {
          tab.addEventListener('click', function () {
            // Remove active from all tabs
            tabs.forEach(function (t) { t.classList.remove('is-active'); });
            // Set active on clicked tab
            tab.classList.add('is-active');

            // Show/hide tab content
            var tabName = tab.getAttribute('data-tab');
            var contents = document.querySelectorAll('[data-tab-content]');
            contents.forEach(function (content) {
              if (content.getAttribute('data-tab-content') === tabName) {
                content.style.display = '';
              } else {
                content.style.display = 'none';
              }
            });
          });
        });
      });
    }
  };

  /**
   * Docs sidebar collapsible sections.
   */
  Drupal.behaviors.bayteqDocsSidebar = {
    attach: function (context) {
      once('docs-toggle', '.docs-sidebar__header', context).forEach(function (header) {
        header.addEventListener('click', function () {
          var section = header.closest('.docs-sidebar__section');
          if (section) {
            section.classList.toggle('is-open');
            var list = section.querySelector('.docs-sidebar__list');
            if (list) {
              list.style.display = section.classList.contains('is-open') ? '' : 'none';
            }
          }
        });
      });
    }
  };

  /**
   * API Catalog filter items.
   */
  Drupal.behaviors.bayteqCatalogFilter = {
    attach: function (context) {
      once('catalog-filter', '.filter-list', context).forEach(function (filterList) {
        var items = filterList.querySelectorAll('.filter-item');
        items.forEach(function (item) {
          item.addEventListener('click', function () {
            items.forEach(function (i) { i.classList.remove('is-active'); });
            item.classList.add('is-active');
          });
        });
      });
    }
  };

  /**
   * Environment card selection (Create App).
   */
  Drupal.behaviors.bayteqEnvSelect = {
    attach: function (context) {
      once('env-select', '.env-grid', context).forEach(function (grid) {
        var cards = grid.querySelectorAll('.env-card');
        cards.forEach(function (card) {
          card.addEventListener('click', function () {
            cards.forEach(function (c) { c.classList.remove('is-selected'); });
            card.classList.add('is-selected');
          });
        });
      });
    }
  };

  /**
   * Plan card selection (Create App).
   */
  Drupal.behaviors.bayteqPlanSelect = {
    attach: function (context) {
      once('plan-select', '.plan-grid', context).forEach(function (grid) {
        var cards = grid.querySelectorAll('.plan-card');
        cards.forEach(function (card) {
          card.addEventListener('click', function () {
            cards.forEach(function (c) { c.classList.remove('is-selected'); });
            card.classList.add('is-selected');
          });
        });
      });
    }
  };

  /**
   * API checkbox card selection visual (Create App).
   */
  Drupal.behaviors.bayteqApiSelectCard = {
    attach: function (context) {
      once('api-select', '.api-select-card', context).forEach(function (card) {
        var checkbox = card.querySelector('input[type="checkbox"]');
        if (checkbox) {
          checkbox.addEventListener('change', function () {
            card.classList.toggle('is-selected', checkbox.checked);
          });
        }
      });
    }
  };

  /**
   * Navigation active state based on current path.
   */
  Drupal.behaviors.bayteqNavActive = {
    attach: function (context) {
      once('nav-active', '.main-nav', context).forEach(function (nav) {
        var currentPath = window.location.pathname;
        var links = nav.querySelectorAll('.main-nav__link');

        links.forEach(function (link) {
          link.classList.remove('is-active');
          var href = link.getAttribute('href');
          if (href && currentPath.indexOf(href) === 0 && href !== '/') {
            link.classList.add('is-active');
          } else if (href === '/' && currentPath === '/') {
            link.classList.add('is-active');
          }
        });
      });
    }
  };

  /**
   * Smooth scroll for docs sidebar anchor links.
   */
  Drupal.behaviors.bayteqSmoothScroll = {
    attach: function (context) {
      once('smooth-scroll', '.docs-sidebar__link[href^="#"]', context).forEach(function (link) {
        link.addEventListener('click', function (e) {
          e.preventDefault();
          var targetId = link.getAttribute('href').substring(1);
          var targetEl = document.getElementById(targetId);
          if (targetEl) {
            var headerHeight = document.querySelector('.site-header')
              ? document.querySelector('.site-header').offsetHeight
              : 0;
            var targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });

            // Update active state
            var allLinks = document.querySelectorAll('.docs-sidebar__link');
            allLinks.forEach(function (l) { l.classList.remove('is-active'); });
            link.classList.add('is-active');
          }
        });
      });
    }
  };

  /**
   * Search input functionality for API catalog.
   */
  Drupal.behaviors.bayteqSearch = {
    attach: function (context) {
      once('api-search', '.filter-sidebar .form-input', context).forEach(function (input) {
        var debounceTimer;
        input.addEventListener('input', function () {
          clearTimeout(debounceTimer);
          debounceTimer = setTimeout(function () {
            var query = input.value.toLowerCase().trim();
            var apiCards = document.querySelectorAll('.api-card');

            apiCards.forEach(function (card) {
              var title = card.querySelector('.api-card__title');
              var desc = card.querySelector('.api-card__desc');
              var text = (title ? title.textContent : '') + ' ' + (desc ? desc.textContent : '');
              card.style.display = text.toLowerCase().indexOf(query) !== -1 ? '' : 'none';
            });

            // Update count
            var visibleCount = document.querySelectorAll('.api-card:not([style*="display: none"])').length;
            var countEl = document.querySelector('.catalog-results-count');
            if (countEl) {
              countEl.textContent = Drupal.t('Mostrando @count APIs', {'@count': visibleCount});
            }
          }, 300);
        });
      });
    }
  };

})(Drupal, once);
