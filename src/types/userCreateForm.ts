export interface CreateUserForm {
    name: string;
    username: string;
    password: string;
    gender: string;
    email: string;
    telephone: string;
    role_id: string;
    is_active: boolean;
    created_by: string;
    photo: File | null;
}
