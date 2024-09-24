import {isAxiosError} from "axios";
import type {ErrorResponse} from "@/dto/error";
import i18next from "i18next";
import type {ToastServiceMethods} from "primevue/toastservice";

export function errorToast(toast: ToastServiceMethods, e: any, message?: string) {
    const t = i18next.t

    let title: string = message || t('error.generic-title')
    let body: string;

    if (isAxiosError(e)) {
        if (e.response) {
            let code = (e.response.data as ErrorResponse).code || "InternalError";
            body = t(`error.server-code.${code}`)
        } else {
            body = t(`error.network-error`)
        }
    } else {
        body = t('error.client-code', {message: e})
    }

    toast.add({
        summary: title,
        detail: body,
        severity: 'error',
        life: 3000
    })
}