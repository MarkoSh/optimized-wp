class Tools {
	/*
	 * rand( min, max ) - случайное число от min до max, если не указывать, то даст от 0 до 1000
	 * getCookie( name ) - вернет в виде строки содержимое кукиса
	 * setCookie( name, value, props ) - установит куку, props задавайте в виде объекта
	 * deleteCookie( name ) - удалит куку
	*/

	rand( min: number = 0, max: number = 1000 ): number {
		return Math.floor( Math.random() * ( max - min + 1 ) ) + min;
	}
	getCookie( name: string ): string {

		var matches = document.cookie.match( new RegExp(
		  "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
		) );
		return matches ? decodeURIComponent( matches[ 1 ] ) : undefined;
	}
	setCookie( name: string, value: string, props ): void {

		props = props || {};
	
		var exp = props.expires;
	
		if ( typeof exp == "number" && exp ) {
	
			var d = new Date();
	
			d.setTime( d.getTime() + exp * 1000 );
	
			exp = props.expires = d;
	
		}
	
		if( exp && exp.toUTCString ) { props.expires = exp.toUTCString(); }
	
		value = encodeURIComponent( value );
	
		var updatedCookie = name + "=" + value;
	
		for( var propName in props ) {
	
			updatedCookie += "; " + propName;
	
			var propValue = props[ propName ];
	
			if ( propValue !== true ) { updatedCookie += "=" + propValue; }
		}
	
		document.cookie = updatedCookie;
	
	}
	deleteCookie( name: string ) {

		this.setCookie( name, null, { expires: -1 } );
	
	}
}

var tools = new Tools(); // Глобальный объект пусть будет, функции должны быть доступны везде

( function () {
	
} )();
