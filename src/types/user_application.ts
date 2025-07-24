import type App from "./app";

export interface UserApplication {
    user_application_id: string;
    user_id: string;
    app_id: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    Application: App;
}