( ( wnd, dom, body, ls ) => {
	
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
	
			const matches = document.cookie.match( new RegExp(
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
			const regex = new RegExp( '[?&]' + name + '(=([^&#]*)|&|#|$)' );
			const results = regex.exec( url );
			if ( ! results ) return null;
			if ( ! results[ 2 ] ) return '';
			return decodeURIComponent( results[2].replace( /\+/g, ' ' ) );
		}
	}
	
} )( window, document, document.body, localStorage );
