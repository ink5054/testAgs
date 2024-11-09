export class StringUtils {
    static replaceNonNumbers(str: string): string {
        return str.replace(/\D/g, '');
    }
}