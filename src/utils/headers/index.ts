class HeadersUtil {
  private static instance: HeadersUtil;

  private constructor() {}

  public static getInstance(): HeadersUtil {
    if (!HeadersUtil.instance) {
      HeadersUtil.instance = new HeadersUtil();
    }
    return HeadersUtil.instance;
  }

  // Auth is cookie-based, so no Authorization header is needed
  public getDefault(): Record<string, string> {
    return {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
  }

  // Axios fills in the multipart boundary for FormData bodies
  public getMultipart(): Record<string, string> {
    return { Accept: 'application/json', 'Content-Type': 'multipart/form-data' };
  }
}

export default HeadersUtil.getInstance();
