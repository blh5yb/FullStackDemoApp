export class User {
    constructor(public name: string, public email: string, public id: string, 
        private _token: string, private _tokenExpirationDate: Date, 
        private _refreshToken: string
    ) {
    }

    get token() {
        if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
            return null;
        }
        return this._token;
    } // getter property to write code that can't be over written
    get tokenExpirationDate() {
        return this._tokenExpirationDate ? this._tokenExpirationDate : null
    }
    get refreshToken(){
        return this._refreshToken ? this._refreshToken : null;
    }
}