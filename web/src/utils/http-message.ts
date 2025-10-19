type HttpMessageResponse<TOther = unknown> = {
  success: boolean;
  message: string;
  other?: TOther;
};

type HttpMessageResponseParams<TOther = unknown> = {
  success?: boolean;
  message: string;
  other?: TOther;
};

export function httpMessageResponse<TOther = unknown>({
  success = true,
  message,
  other = {} as TOther,
}: HttpMessageResponseParams<TOther>): HttpMessageResponse<TOther> {
  return {
    success,
    message,
    other,
  };
}
