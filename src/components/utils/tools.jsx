import { toast } from "react-toastify";

export const showToast = (type, msg) => {
    switch (type) {
        case 'SUCCESS':
            toast.success(msg,)
            break;

        case 'ERROR':
            toast.error(msg)
            break;

        default:
            return false;
    }
}