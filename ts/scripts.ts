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
	getCookie( name: string ): any {

		let matches = document.cookie.match( new RegExp(
		  "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
		) );
		return matches ? decodeURIComponent( matches[ 1 ] ) : undefined;
	}
	setCookie( name: string, value: any, props: any ): void {

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

		this.setCookie( name, '', { expires: -1 } );
	
	}

	getParameterByName( name: string, url: string ) {
		if (!url) url = window.location.href;
		name = name.replace( /[\[\]]/g, '\\$&' );
		var regex = new RegExp( '[?&]' + name + '(=([^&#]*)|&|#|$)' ),
			results = regex.exec( url );
		if ( ! results ) return null;
		if ( ! results[ 2 ] ) return '';
		return decodeURIComponent( results[2].replace( /\+/g, ' ' ) );
	}
}

declare let ajax_url: string, PhotoSwipeUI_Default: any; // Так надо!
declare function axios( options: any ): Promise<any>; // Тоже так надо )
declare function Inputmask( mask: string ): void;
declare function PhotoSwipe( pswp: HTMLElement, PhotoSwipeUI_Default: any, items: Array<Object>, options: Object ): void;
let tools = new Tools(); // Глобальный объект пусть будет, функции должны быть доступны везде

( ( wnd, dom, body, ls ) => {

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
			let add = <HTMLButtonElement> quantity.querySelector( 'button.add' ),
				sub = <HTMLButtonElement> quantity.querySelector( 'button.sub' ),
				qty = <HTMLInputElement> quantity.querySelector( 'input.qty' ),
				val = parseInt( qty.value ),
				max = parseInt( String( qty.getAttribute( 'max' ) ) ) || 999999,
				min = parseInt( String( qty.getAttribute( 'min' ) ) ) || 0;
			
			add.onclick = e => {
				val = val + 1 <= max ? ++val : max;
				qty.value = String( val );
			};
			sub.onclick = e => {
				val = val - 1 >= min ? ++val : min;
				qty.value = String( val );
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
			body.classList.remove( 'is-modal' );
			body.classList.remove( 'is-side' );
			let actives = dom.querySelectorAll( '.active' );
			if ( actives ) {
				actives.forEach( active => {
					active.classList.remove( 'active' );
				} );
			}
		};
	}

	/**
	 * Оборачиваем все youtube ролики в div с нужным нам классом,
	 * я делаю это для формирования блока с соотношением 16:9
	 */
	let iframes = dom.querySelectorAll( 'iframe[src*=youtube]' );
	if ( iframes.length > 0 ) {
		iframes.forEach( iframe => {
			let div_iframe = dom.createElement( 'div' );
			div_iframe.classList.add( 'iframe' );
			div_iframe.innerHTML = iframe.outerHTML;
			iframe.outerHTML = div_iframe.outerHTML;
		} );
	}

	/**
	 * Woocommerce рендерит в футере элемент для галереи от photoswipe,
	 * давайте положим его в переменную и будем использовать по необходимости
	 */
	let pswp = dom.querySelector( '.pswp' );

	/**
	 * Пример использования, все ссылки содержащие картинки будут подхвачены photoswipe
	 */
	let images = dom.querySelectorAll( 'article .entry-content a img' ); // Следите за селектором, у вас ссылки могут оказаться не картиночными и вести куда угодно
	if ( images ) {
		let items: any[] = [];
		images.forEach( ( image, i ) => {
			let link 	= <HTMLAnchorElement> image.closest( 'a' ), // Получаем родителя-ссылку, которая ведет на большую картинку
				src		= link.getAttribute( 'href' ); // Получаем из ссылки путь на большую картинку
			let img = new Image(); // Создаем объект картинки
			img.src = String( src );
			/**
			 * До того как картинка прогружена, мы не знаем ее размеров, это может быть картинка в посте
			 * или в статье. Если картинка заведена в содержимое вручную, то у нее не будет нужных нам
			 * атрибутов, поэтому мы просто ее прогрузим и посмотрим результат, это порождает нагрузку,
			 * но позволяет заранее прогрузить картинки для галереи. До того как картинки прогрузились,
			 * ссылки на них будут просто открывать окно с картинкой, а после - будут приводить к 
			 * инициализации галереи Photoswipe
			 * 
			 * !!! НЕ ИСПОЛЬЗУЙТЕ ЭТОТ КОД, ЕСЛИ ПЛАНИРУЕТЕ ОТЛОЖЕННУЮ ЗАГРУЗКУ И ЕСЛИ У ВАС МНОГО КАРТИНОК В ПОСТАХ !!!
			 */
			img.onload = () => {
				items[ i ] = {
					src: src,
					w: img.width,
					h: img.height
				};
				link.onclick = e => {
					e.preventDefault();
					let gallery = new PhotoSwipe( <HTMLElement> pswp, PhotoSwipeUI_Default, items, {
						index: i
					} );
					gallery.init();
					return true;
				};
			};
		} );
	}

	let ims = [ {
		selector	: 'input[name="phone"]',
		mask		: '+7 (999) 999-99-99'
	}, {
		selector	: 'input[name="email"]',
		mask		: 'email'
	} ];
	ims.forEach( el => {
		let im = new Inputmask( el.mask );
		im.mask( el.selector );
	} );

	wnd.onsubmit = e => {
		let target = e.target;

		if ( ( <HTMLFormElement> target ).classList.contains( 'ajax' ) ) {
			e.preventDefault();
			if ( target[ 'process' ] ) return true;
			let submit = ( <HTMLFormElement> target ).querySelector( '[type=submit]' );
			let text = 'В процессе...';
			( <HTMLInputElement> submit ).value = text;
			( <HTMLButtonElement> submit ).innerText = text;
			target[ 'process' ] = true;
			let data = new FormData( ( <HTMLFormElement> target ) );
			data.set( 'captcha', String( tools.rand( 120000, 500000 ) ) ); // Не забудьте сделать проверку поля captcha в беке, минимальная капча, убережет ваши нервы на первое время.
			let xhr = new XMLHttpRequest();
			xhr.open( 'POST', ajax_url );
			xhr.onreadystatechange = () => {
				switch ( xhr.readyState ) {
					case 0:
						text = 'Начинаем...';
					break;
					case 1: 
						text = 'Отправляем...';
					break;
					case 2:
						text = 'Заголовки...';
					break;
					case 3:
						text = 'Получаем...';
					break;
					case 4:
						text = 'Получено';
						target[ 'process' ] = false;
					break;
				}
				if ( xhr.status >= 200 && xhr.status <= 300 ) text = 'Отправлено';
				if ( xhr.status >= 400 ) text = 'Ошибка обработки';
				if ( xhr.status >= 500 ) text = 'Ошибка сервера';

				( <HTMLInputElement> submit ).value = text;
				( <HTMLButtonElement> submit ).innerText = text;
			}
			xhr.send( data );
		}
		return true;
	};

	wnd.onchange = e => {
		let target = e.target;

		/**
		 * Заменяем текст в лейблах привязанных к файловому инпуту на имя файла
		 */
		if ( ( <HTMLInputElement> target ).tagName == 'INPUT' && ( <HTMLInputElement> target ).files ) {
			let labels = ( <HTMLInputElement> target ).labels;
			labels.forEach( label => {
				let filename = ( <HTMLInputElement> target ).files[ 0 ].name;
				label.innerText = filename;
			} );
		}
	};

	wnd.onclick = e => {

		let target = e.target;

		/*
		* Простенькое решение показа модала
		*/
		if ( ( <HTMLAnchorElement> target ).classList.contains( 'modal-init' ) ) {
			let hash 	= ( <HTMLAnchorElement> target ).getAttribute( 'href' ),
				modal 	= dom.querySelector( hash );
			e.preventDefault();
			modal.classList.add( 'active' );
			body.classList.add( 'is-modal' );
			return true;
		}

		/**
		 * При ресетинге формы так же сбрасываем лейблы, если у них указан дефолтный текст
		 */
		if ( ( <HTMLFormElement> target ).type == 'reset' ) {
			let form = ( <HTMLFormElement> target ).form;
			let labels = form.querySelectorAll( 'label' );
			labels.forEach( label => {
				let default_text = label.getAttribute( 'data-default-text' );
				if ( default_text ) label.innerText = default_text;
			} );
		}

		// Перехватываем все хештеговые ссылки и отменяем на них клик
		if ( ( <HTMLAnchorElement> target ).tagName == 'A' && ( <HTMLAnchorElement> target ).href.indexOf( '#' ) == 0 ) {
			e.preventDefault();
		}
		
		return true;
	};
	
} )( window, document, document.body, localStorage );
