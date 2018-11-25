class Tools {
	/*
	 * rand( min, max ) - случайное число от min до max, если не указывать, то даст от 0 до 1000
	 * getCookie( name ) - вернет в виде строки содержимое кукиса
	 * setCookie( name, value, props ) - установит куку, props задавайте в виде объекта
	 * deleteCookie( name ) - удалит куку
	 * getParameterByName( name, url ) - получит параметр с именем name из ссылки url
	*/

	rand( min: number = 0, max: number = 1000 ): number {
		return Math.floor( Math.random() * ( max - min + 1 ) ) + min;
	}
	getCookie( name: string ): string {

		let matches = document.cookie.match( new RegExp(
		  "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
		) );
		return matches ? decodeURIComponent( matches[ 1 ] ) : undefined;
	}
	setCookie( name: string, value: string, props ): void {

		props = props || {};
	
		let exp = props.expires;
	
		if ( typeof exp == "number" && exp ) {
	
			let d = new Date();
	
			d.setTime( d.getTime() + exp * 1000 );
	
			exp = props.expires = d;
	
		}
	
		if( exp && exp.toUTCString ) { props.expires = exp.toUTCString(); }
	
		value = encodeURIComponent( value );
	
		let updatedCookie = name + "=" + value;
	
		for( let propName in props ) {
	
			updatedCookie += "; " + propName;
	
			let propValue = props[ propName ];
	
			if ( propValue !== true ) { updatedCookie += "=" + propValue; }
		}
	
		document.cookie = updatedCookie;
	
	}
	deleteCookie( name: string ) {

		this.setCookie( name, null, { expires: -1 } );
	
	}

	getParameterByName( name, url ) {
		if (!url) url = window.location.href;
		name = name.replace( /[\[\]]/g, '\\$&' );
		var regex = new RegExp( '[?&]' + name + '(=([^&#]*)|&|#|$)' ),
			results = regex.exec( url );
		if ( ! results ) return null;
		if ( ! results[ 2 ] ) return '';
		return decodeURIComponent( results[2].replace( /\+/g, ' ' ) );
	}
}

declare let ajax_url, PhotoSwipeUI_Default; // Так надо!
declare function axios( options ): Promise<any>; // Тоже так надо )
declare function Inputmask( mask: string ): void;
declare function PhotoSwipe( pswp: HTMLElement, PhotoSwipeUI_Default: any, items: Array<Object>, options: Object ): void;
let tools = new Tools(); // Глобальный объект пусть будет, функции должны быть доступны везде

( dom => {

	/*
	 * Перехватываем все хеш-ссылки и убираем с них клик, ниже уже назначаем новые хендлеры.
	 * Сделано исключительно для удобства и для красоты.
	 */
	let hashlinks = dom.querySelectorAll( 'a[href="#"]' );
	if ( hashlinks ) {
		hashlinks.forEach( ( hashlink, i, array ) => {
			( <HTMLAnchorElement> hashlink ).onclick = e => {
				e.preventDefault();
				return true;
			};
		} );
	}

	/*
	 * Подхватываем обработку поля Количество, при условии,
	 * что доверстали к элементу две кнопки прибавления и вычитания.
	 * !!! Внимание!!! Подхватываются только те, что уже существуют,
	 * новорожденные лучше обработать отдельно, а еще лучше не создавать
	 * таких ситуаций, пусть элементы уже существуют изначально
	 */
	let quantities = dom.querySelectorAll( '.quantity' );
	if ( quantities ) {
		quantities.forEach( quantity => {
			let add = quantity.querySelector( 'button.add' ),
				sub = quantity.querySelector( 'button.sub' ),
				qty = quantity.querySelector( 'input.qty' ),
				val = parseInt( ( <HTMLInputElement> qty ).value ),
				max = parseInt( qty.getAttribute( 'max' ) ) || 999999,
				min = parseInt( qty.getAttribute( 'min' ) ) || 0;
			
			( <HTMLButtonElement> add ).onclick = e => {
				val = val + 1 <= max ? ++val : max;
				( <HTMLInputElement> qty ).value = String( val );
			};
			( <HTMLButtonElement> sub ).onclick = e => {
				val = val - 1 >= min ? ++val : min;
				( <HTMLInputElement> qty ).value = String( val );
			};
		} );
	}

	/*
	 * Подхватываем все формы с классом ajax, обрабатывать их будем
	 * через axios, его необходимо декларировать выше, проверьте,
	 * что установили его в ноде
	 */
	let ajaxforms = dom.querySelectorAll( 'form.ajax' );
	if ( ajaxforms ) {
		ajaxforms.forEach( ajaxform => {
			let button = ajaxform.querySelector( '[type=submit]' );
			( <HTMLFormElement> ajaxform ).onsubmit = e => {
				e.preventDefault();
				( <HTMLButtonElement> button ).disabled = true;
				( <HTMLButtonElement> button ).innerText = 'В процессе';
				let data = new FormData( ( <HTMLFormElement> ajaxform ) );
				data.set( 'captcha', String( tools.rand( 120000, 500000 ) ) ); // Не забудьте сделать проверку поля captcha в беке, минимальная капча, убережет ваши нервы на первое время.
				axios( {
					url: ajax_url,
					data: data,
					method: 'post'
				} ).then( response => {
					( <HTMLButtonElement> button ).disabled = false;
					if ( response.data ) {
						( <HTMLButtonElement> button ).innerText = 'Отправлено';
						( <HTMLFormElement> ajaxform ).reset();
					} else {
						( <HTMLButtonElement> button ).innerText = 'Ошибка';
					}					
				} ).catch( error => {
					( <HTMLButtonElement> button ).disabled = false;
					( <HTMLButtonElement> button ).innerText = 'Критическая ошибка';
					( <HTMLFormElement> ajaxform ).reset();
				} );
				return true;
			};
		} );
	}

	/*
	 * Хитрое решение клика в область вне нужного элемента,
	 * например у самопального сайдбара выдвигающегося, либо модала,
	 * по типу magnific-popup
	 */
	let over = dom.getElementById( 'over' );
	if ( over ) {
		over.onclick = e => {
			dom.body.classList.remove( 'is-modal' );
			dom.body.classList.remove( 'is-side' );
			let actives = dom.querySelectorAll( '.active' );
			if ( actives ) {
				actives.forEach( active => {
					active.classList.remove( 'active' );
				} );
			}
		};
	}

	/*
	 * Простенькое решение показа модала
	 */
	let modal_inits = dom.querySelectorAll( '.modal-init' );
	if ( modal_inits ) {
		modal_inits.forEach( modal_initiator => {
			let hash = ( <HTMLElement> modal_initiator ).getAttribute( 'href' ) || ( <HTMLElement> modal_initiator ).getAttribute( 'data-modal' ),
				modal = dom.querySelector( hash );
			( <HTMLElement> modal_initiator ).onclick = e => {
				e.preventDefault();
				modal.classList.add( 'active' );
				dom.body.classList.add( 'is-modal' );
				return true;
			};
		} );
	}

	/**
	 * Woocomerce рендерит в футере элемент для галереи от photoswipe,
	 * давайте положим его в переменную и будем использовать по необходимости
	 */
	let pswp = dom.querySelector( '.pswp' );

	/**
	 * Пример использования, все ссылки содержащие картинки будут подхвачены photoswipe
	 */
	let images = dom.querySelectorAll( 'article .entry-content a img' ); // Следите за селектором, у вас ссылки могут оказаться не картиночными и вести куда угодно
	if ( images ) {
		let items = [];
		images.forEach( ( image, i ) => {
			let link 	= image.closest( 'a' ), // Получаем родителя-ссылку, которая ведет на большую картинку
				src		= link.getAttribute( 'href' ); // Получаем из ссылки путь на большую картинку
			let img = new Image(); // Создаем объект картинки
			img.src = src;
			/**
			 * До того как картинка прогружена, мы не знаем ее размеров, это может быть картинка в посте
			 * или в статье. Если картинка заведена в сождержимое вручную, то у нее не будет нужных нам
			 * атрибутов, поэтому мы просто ее прогрузим и посмотрим результат, это порождает нагрузку,
			 * но позволяет заранее прогрузить картинки для галереи. До того как картинки прогрузились,
			 * ссылки на них будут просто открывать окно с картинкой, а после - будут приводить к 
			 * инициализации галереи Photoswipe
			 * 
			 * !!! НЕ ИСПОЛЬЗУЙТЕ ЭТОТ КОД, ЕСЛИ ПЛАНИРУЕТЕ ОТЛОЖЕННУЮ ЗАГРУЗКУ И ЕСЛИ У ВАС МНОГО КАРТИНОК В ПОСТАХ !!!
			 */
			img.onload = () => {
				items.push( {
					src: src,
					w: img.width,
					h: img.height
				} );
				link.onclick = e => {
					e.preventDefault();
					let gallery = new PhotoSwipe( ( <HTMLElement> pswp ), PhotoSwipeUI_Default, items, {
						index: i
					} );
					gallery.init();
					return true;
				};
			};
		} );
	}

	let phoneim = new Inputmask( "+7 (999) 999-99-99" );
	phoneim.mask( 'input[name="phone"]' );
	let emailim = new Inputmask( "email" );
	emailim.mask( 'input[name="email"]' );
	
} )( document );
