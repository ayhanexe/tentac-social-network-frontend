import { IUser } from "../../types/auth/authTypes";
import AutoCRUD from "../../utils/AutoCRUD";
import path from "path-browserify";

export default class UserService extends AutoCRUD<IUser, string> {
    constructor() {
        const apiUrl:string = path.join(`${process.env.REACT_APP_API_BASE}`, 'Users');
        
        super(apiUrl);
    }
}
