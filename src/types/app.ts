export default interface Application {
    application_id: string;
    name: string;
    icon: string;
    redirect_uri: string;
    logout_url: string;
    is_active: boolean;
}