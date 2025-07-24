import type Application from "./app";

export default interface User {
    user_id: string;
    name: string;
    username: string;
    app: string;
    email: string;
    telephone: string;
    is_active: boolean;
    role_id: string;
    photo: string;
    lastLogin:string;
    gender: string;
    access_apps: Application[];
}