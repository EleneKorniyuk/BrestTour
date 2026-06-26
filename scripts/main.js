'use strict';


// ============================================
// 1. БУРГЕР-МЕНЮ
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const burger = document.querySelector('.burger');
    const mobileMenu = document.querySelector('.header__mobile-menu');

    if (burger && mobileMenu) {
        // Открытие
        burger.addEventListener('click', function() {
            const isOpen = !mobileMenu.hasAttribute('hidden');
            if (isOpen) {
                mobileMenu.setAttribute('hidden', '');
                burger.classList.remove('burger--active');
                burger.setAttribute('aria-label', 'Открыть меню');
                document.body.style.overflow = '';
            } else {
                mobileMenu.removeAttribute('hidden');
                burger.classList.add('burger--active');
                burger.setAttribute('aria-label', 'Закрыть меню');
                document.body.style.overflow = 'hidden';
            }
        });

        // Закрытие при клике на ссылку (КРОМЕ "Контакты")
        const links = mobileMenu.querySelectorAll('.mobile-menu__link:not(.mobile-menu__link--dropdown-toggle)');
        links.forEach(function(link) {
            link.addEventListener('click', function() {
                mobileMenu.setAttribute('hidden', '');
                burger.classList.remove('burger--active');
                burger.setAttribute('aria-label', 'Открыть меню');
                document.body.style.overflow = '';
            });
        });
    }
});



// ============================================
// 2. ПЛАВНЫЙ СКРОЛЛ (кнопка "Расписание")
// ============================================
const scheduleBtn = document.querySelector('.hero__btn');
const scheduleSection = document.getElementById('schedule');

if (scheduleBtn && scheduleSection) {
    scheduleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = scheduleSection.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    });
}



// ============================================================
// 3. СТРЕЛКИ — ПЛАВНЫЙ СКРОЛЛ
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    const scrollIndicator = document.getElementById('scrollIndicator');
    const scheduleSection = document.getElementById('schedule');

    if (scrollIndicator && scheduleSection) {
        scrollIndicator.addEventListener('click', function(e) {
            e.preventDefault();
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = scheduleSection.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    }
});



// ============================================
// 4. СЛАЙДЕР ОТЗЫВОВ
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const track = document.getElementById('reviewsTrack');
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');
    
    if (!track) return;
    
    const slides = Array.from(track.querySelectorAll('.slider__slide'));
    let currentSlide = 0;
    let slidesPerView = 1;
    let totalSlides = slides.length;
    
    function updateSlidesPerView() {
        if (window.innerWidth >= 768) {
            slidesPerView = 2;
        } else {
            slidesPerView = 1;
        }
        totalSlides = Math.ceil(slides.length / slidesPerView);
    }
    
    function goTo(index) {
        if (index < 0) index = totalSlides - 1;
        if (index >= totalSlides) index = 0;
        
        currentSlide = index;
        
        const start = index * slidesPerView;
        const end = start + slidesPerView;
        
        slides.forEach(function(slide, i) {
            if (i >= start && i < end) {
                slide.style.display = 'block';
            } else {
                slide.style.display = 'none';
            }
        });
        
        if (prevBtn) {
            prevBtn.disabled = index === 0;
        }
        if (nextBtn) {
            nextBtn.disabled = index === totalSlides - 1;
        }
    }
    
    updateSlidesPerView();
    goTo(0);
    
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            goTo(currentSlide - 1);
        });
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            goTo(currentSlide + 1);
        });
    }
    
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            updateSlidesPerView();
            goTo(currentSlide);
        }, 250);
    });
});



// ============================================
// 5. РАСКРЫТИЕ ТЕКСТА ОТЗЫВА
// ============================================
document.querySelectorAll('[data-expand]').forEach(btn => {
    btn.addEventListener('click', () => {
        const card = btn.closest('.review-card');
        const text = card.querySelector('.review-card__text');
        
        if (text) {
            text.classList.toggle('review-card__text--expanded');
            btn.textContent = text.classList.contains('review-card__text--expanded') 
                ? 'свернуть' 
                : 'далее...';
        }
    });
});



// ============================================
// 6. КАЛЕНДАРЬ (Flatpickr)
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    if (typeof flatpickr !== 'undefined') {
        // Дата "с"
        const dateFrom = document.getElementById('dateFrom');
        if (dateFrom) {
            flatpickr(dateFrom, {
                locale: 'ru',
                dateFormat: 'd.m.Y',
                placeholder: 'Дд.Мм.Гггг',
                onChange: (selectedDates, dateStr) => {
                    // Обновляем дату "по"
                    const dateTo = document.getElementById('dateTo');
                    if (dateTo && selectedDates[0]) {
                        const minDate = new Date(selectedDates[0]);
                        minDate.setDate(minDate.getDate() + 1);
                        dateTo._flatpickr?.set('minDate', minDate);
                    }
                }
            });
        }

        // Дата "по"
        const dateTo = document.getElementById('dateTo');
        if (dateTo) {
            flatpickr(dateTo, {
                locale: 'ru',
                dateFormat: 'd.m.Y',
                placeholder: 'Дд.Мм.Гггг'
            });
        }
    }
});



// ============================================
// 7. ВАЛЮТА - ВЫПАДАЮЩИЙ СПИСОК
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const toggles = document.querySelectorAll('.currency-selector__toggle');
    
    toggles.forEach(function(toggle) {
        toggle.addEventListener('click', function(e) {
            e.stopPropagation();
            
            const dropdown = toggle.parentElement.querySelector('.currency-selector__dropdown');
            if (!dropdown) return;
            
            // ЗАПОМИНАЕМ состояние ДО закрытия всех
            const wasOpen = !dropdown.hasAttribute('hidden');
            
            // Закрываем ВСЕ дропдауны
            closeAllDropdowns();
            
            // Если дропдаун был закрыт - открываем его
            if (!wasOpen) {
                dropdown.removeAttribute('hidden');
                toggle.setAttribute('aria-expanded', 'true');
            }
            // Если был открыт - он уже закрыт через closeAllDropdowns()
        });
    });

    // Переключение валюты
    const currencyLinks = document.querySelectorAll('.currency-selector__dropdown li a');
    currencyLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const parentDropdown = link.closest('.currency-selector__dropdown');
            const toggle = parentDropdown.parentElement.querySelector('.currency-selector__toggle');
            
            parentDropdown.querySelectorAll('li a').forEach(function(item) {
                item.classList.remove('active');
            });
            
            link.classList.add('active');
            
            if (toggle) {
                const currencyText = link.textContent.trim();
                toggle.innerHTML = currencyText + ' <i class="fas fa-chevron-down"></i>';
            }
            
            parentDropdown.setAttribute('hidden', '');
            if (toggle) toggle.setAttribute('aria-expanded', 'false');
            
            console.log('Валюта выбрана:', link.textContent.trim());
        });
    });
});



// ============================================================
// 8. ЯЗЫК - ВЫПАДАЮЩИЙ СПИСОК
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    const langToggles = document.querySelectorAll('.language-selector__toggle');
    
    langToggles.forEach(function(toggle) {
        toggle.addEventListener('click', function(e) {
            e.stopPropagation();
            
            const dropdown = toggle.parentElement.querySelector('.language-selector__dropdown');
            if (!dropdown) return;
            
            // ЗАПОМИНАЕМ состояние ДО закрытия всех
            const wasOpen = !dropdown.hasAttribute('hidden');
            
            // Закрываем ВСЕ дропдауны
            closeAllDropdowns();
            
            // Если дропдаун был закрыт - открываем его
            if (!wasOpen) {
                dropdown.removeAttribute('hidden');
                toggle.setAttribute('aria-expanded', 'true');
            }
            // Если был открыт - он уже закрыт через closeAllDropdowns()
        });
    });

    // Переключение языка
    const langLinks = document.querySelectorAll('.language-selector__dropdown li a');
    langLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const parentDropdown = link.closest('.language-selector__dropdown');
            const toggle = parentDropdown.parentElement.querySelector('.language-selector__toggle');
            
            parentDropdown.querySelectorAll('li a').forEach(function(item) {
                item.classList.remove('active');
            });
            
            link.classList.add('active');
            
            if (toggle) {
                const langText = link.textContent.trim();
                toggle.innerHTML = langText + ' <i class="fas fa-chevron-down"></i>';
            }
            
            parentDropdown.setAttribute('hidden', '');
            if (toggle) toggle.setAttribute('aria-expanded', 'false');
            
            console.log('Язык выбран:', link.textContent.trim());
        });
    });
});



// ============================================================
// 9. КОНТАКТЫ - ВЫПАДАЮЩИЙ СПИСОК
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    const contactToggles = document.querySelectorAll('.contacts-selector__toggle');
    
    contactToggles.forEach(function(toggle) {
        toggle.addEventListener('click', function(e) {
            e.stopPropagation();
            e.preventDefault();
            
            const dropdown = toggle.parentElement.querySelector('.contacts-selector__dropdown');
            if (!dropdown) return;
            
            // ЗАПОМИНАЕМ состояние ДО закрытия всех
            const wasOpen = !dropdown.hasAttribute('hidden');
            
            // Закрываем ВСЕ дропдауны
            closeAllDropdowns();
            
            // Если дропдаун был закрыт - открываем его
            if (!wasOpen) {
                dropdown.removeAttribute('hidden');
                toggle.setAttribute('aria-expanded', 'true');
            }
            // Если был открыт - он уже закрыт через closeAllDropdowns()
        });
    });
});



// ============================================================
// 10. ФУНКЦИЯ ЗАКРЫТИЯ ВСЕХ ДРОПДАУНОВ
// ============================================================
function closeAllDropdowns() {
    // Закрываем валюту
    const currencyDropdowns = document.querySelectorAll('.currency-selector__dropdown:not([hidden])');
    currencyDropdowns.forEach(function(dropdown) {
        dropdown.setAttribute('hidden', '');
        const toggle = dropdown.parentElement.querySelector('.currency-selector__toggle');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
    });
    
    // Закрываем контакты
    const contactDropdowns = document.querySelectorAll('.contacts-selector__dropdown:not([hidden])');
    contactDropdowns.forEach(function(dropdown) {
        dropdown.setAttribute('hidden', '');
        const toggle = dropdown.parentElement.querySelector('.contacts-selector__toggle');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
    });
    
    // Закрываем язык
    const langDropdowns = document.querySelectorAll('.language-selector__dropdown:not([hidden])');
    langDropdowns.forEach(function(dropdown) {
        dropdown.setAttribute('hidden', '');
        const toggle = dropdown.parentElement.querySelector('.language-selector__toggle');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
    });
}



// ============================================================
// 11. ЗАКРЫТИЕ ВСЕХ ДРОПДАУНОВ ПРИ КЛИКЕ ВНЕ
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('click', function(e) {
        // Проверяем, что клик НЕ по кнопке-триггеру и НЕ внутри дропдауна
        const isToggle = e.target.closest('.currency-selector__toggle') || 
                         e.target.closest('.language-selector__toggle') || 
                         e.target.closest('.contacts-selector__toggle');
        const isDropdown = e.target.closest('.currency-selector__dropdown') || 
                           e.target.closest('.language-selector__dropdown') || 
                           e.target.closest('.contacts-selector__dropdown');
        
        if (!isToggle && !isDropdown) {
            closeAllDropdowns();
        }
    });
});



// ============================================
// 12. ОБРАБОТКА ФОРМЫ ПОИСКА
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.getElementById('searchForm');
    
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(searchForm);
            const data = {
                dateFrom: formData.get('dateFrom') || 'Дд.Мм.Гггг',
                dateTo: formData.get('dateTo') || 'Дд.Мм.Гггг',
                adults: formData.get('adults') || '1',
                children: formData.get('children') || '0'
            };

            console.log('Поиск экскурсий:', data);
            
            const btn = searchForm.querySelector('.search-form__btn');
            const originalText = btn.textContent;
            btn.textContent = 'Ищем...';
            btn.disabled = true;
            
            setTimeout(function() {
                btn.textContent = originalText;
                btn.disabled = false;
                alert('Поиск выполнен (демо-режим).\n\nДанные:\n' + 
                    'Дата с: ' + data.dateFrom + '\n' +
                    'Дата по: ' + data.dateTo + '\n' +
                    'Взрослых: ' + data.adults + '\n' +
                    'Детей: ' + data.children
                );
            }, 800);
        });
    }
});



// ============================================
// 13. КНОПКИ "БРОНИРОВАТЬ"
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const bookBtns = document.querySelectorAll('.tour-card__btn:not(:disabled)');
    
    bookBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            const card = btn.closest('.tour-card');
            const dateEl = card ? card.querySelector('.tour-card__date') : null;
            const date = dateEl ? dateEl.textContent.trim() : 'неизвестно';
            alert('Бронирование экскурсии на ' + date);
        });
    });
});



// ============================================
// 14. АКТИВНАЯ ССЫЛКА В НАВИГАЦИИ (скролл)
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav__link:not(.nav__link--dropdown-toggle), .mobile-menu__link:not(.mobile-menu__link--dropdown-toggle)');
    const sections = {
        'program': document.getElementById('program'),
        'schedule': document.getElementById('schedule'),
        'reviews': document.getElementById('reviews'),
        'contacts': document.getElementById('contacts')
    };
    
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(function() {
            const scrollPos = window.scrollY + 150;
            let activeId = 'schedule';
            
            for (const [id, el] of Object.entries(sections)) {
                if (el && el.offsetTop <= scrollPos) {
                    activeId = id;
                }
            }
            
            navLinks.forEach(function(link) {
                link.classList.remove('nav__link--active', 'mobile-menu__link--active');
                if (link.getAttribute('href') === '#' + activeId) {
                    link.classList.add('nav__link--active', 'mobile-menu__link--active');
                }
            });
        }, 100);
    });
});


console.log('Вёрстка загружена!');