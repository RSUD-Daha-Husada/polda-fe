export interface UserForm {
    user_id: string;
    name: string;
    email: string;
    username: string;
    password: string;
    telephone: string;
    gender: string;
    role_id: string;
    photo: string | File;
    application_ids: string[];
}