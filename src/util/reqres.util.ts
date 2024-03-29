export abstract class ReqResUtil {
  static resultWithTotal<T = unknown>(data: T[], total: number) {
    return { data, total };
  }
}
