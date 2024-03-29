export abstract class ReqResUtil {
  static resultWithTotal<T = unknown>(data: T[], total: number) {
    return { data, total };
  }

  static errorMessage(message: string) {
    return { message };
  }
}
