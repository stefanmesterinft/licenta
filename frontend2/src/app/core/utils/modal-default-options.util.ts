export const ModalDefaultOptions = (params?: {
  size?: 'sm' | 'md' | 'lg' | 'xl',
  data?: any
}): any => {

  return {
    keyboard: true,
    ignoreBackdropClick: true,
    class: `modal-dialog-centered modal-secondary modal-${(params && params.size) ? params.size : 'lg'}`,
    initialState: (params && params.data) ? params.data : {}
  }
}