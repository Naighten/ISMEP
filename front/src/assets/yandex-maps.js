$(function(){
    //Переменная для включения/отключения индикатора загрузки
    let spinner = $('.j-ymap-container').children('.loader');
    //Переменная для определения была ли хоть раз загружена Яндекс.Карта (чтобы избежать повторной загрузки при наведении)
    let check_if_load = false;
    //Необходимые переменные для того, чтобы задать координаты на Яндекс.Карте
    let myMap, myPlacemarkTemp;

    //Функция создания карты сайта и затем вставки ее в блок с идентификатором &#34;map-yandex&#34;
    function init () {

    // Build a route on public transit.
    myMap = new ymaps.Map('map', {
        center: [55.751574, 37.573856],
        zoom: 9,
        controls: []
    });
    
    // Create a route instance.
    var multiRoute = new ymaps.multiRouter.MultiRoute({
        referencePoints: [
            'Россия, Москва, Чертановская улица',
            'Россия, Москва, Нахимовский проспект, 24',
            'Россия, Москва, Коломенский проезд'
        ],
        params: {
            // Route type: on public transit.
        }
        }, {
            // Automatically set the map viewport so that
            // the entire route is visible.
            boundsAutoApply: true
        });

        // Add the route to the map.
        myMap.geoObjects.add(multiRoute);
        let layer = myMap.layers.get(0).get(0);
        // Решение по callback-у для определения полной загрузки карты
        waitForTilesLoad(layer).then(function() {
            // Скрываем индикатор загрузки после полной загрузки карты
            spinner.removeClass('is-active');
        });

    }

    // Функция для определения полной загрузки карты (на самом деле проверяется загрузка тайлов) 
    function waitForTilesLoad(layer) {
        return new ymaps.vow.Promise(function (resolve, reject) {
            let tc = getTileContainer(layer), readyAll = true;
            tc.tiles.each(function (tile, number) {
                if (!tile.isReady()) {
                    readyAll = false;
                }
            });
            if (readyAll) {
                resolve();
            } else {
                tc.events.once("ready", function() {
                    resolve();
                });
            }
        });
    }
    function getTileContainer(layer) {
        for (let k in layer) {
            if (layer.hasOwnProperty(k)) {
            if (
                layer[k] instanceof ymaps.layer.tileContainer.CanvasContainer
                || layer[k] instanceof ymaps.layer.tileContainer.DomContainer
            ) {
                return layer[k];
            }
        }
    }
        return null;
    }

    // Функция загрузки API Яндекс.Карт по требованию (в нашем случае при загрузке страницы)
    function loadScript(url, callback){
        let script = document.createElement("script");

        if (script.readyState){  // IE
          script.onreadystatechange = function(){
            if (script.readyState == "loaded" ||
                    script.readyState == "complete"){
              script.onreadystatechange = null;
              callback();
            }
          };
        } else {  // Другие браузеры
            script.onload = function(){
                callback();
            };
        }

      script.src = url;
      document.getElementsByTagName("head")[0].appendChild(script);
    }

    // Основная функция, которая проверяет загрузку страницы
    let ymap = function() {
        $(window).on('load', function(){
            if (!check_if_load) { // проверяем первый ли раз загружается Яндекс.Карта, если да, то загружаем

                // Чтобы не было повторной загрузки карты, мы изменяем значение переменной
                check_if_load = true; 

                // Показываем индикатор загрузки до тех пор, пока карта не загрузится
                spinner.addClass('is-active');

                // Загружаем API Яндекс.Карт
                loadScript("https://api-maps.yandex.ru/2.1/?apikey=09ef1670-076b-4682-a80a-f830c8b486eb&lang=ru_RU", function(){
                   // Как только API Яндекс.Карт загрузились, сразу формируем карту и помещаем в блок с идентификатором &#34;map-yandex&#34;
                   ymaps.load(init);
                });                
            }
        });
    }

    //Запускаем основную функцию
ymap();
})