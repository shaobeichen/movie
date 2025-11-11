import { ElMessage, type MessageParams } from "element-plus";

export function useToast(options: MessageParams) {
    if (import.meta.server) return
    return ElMessage(options)
}
