declare module Electron {
  //OpenDialogReturnValue type was missing cancled option
  interface OpenDialogReturnValue {
    /**
     * whether or not the dialog was canceled.
     */
    canceled: boolean;
    /**
     * If the dialog is canceled this will be undefined.
     */
    filePath?: string;
    /**
     * Base64 encoded string which contains the security scoped bookmark data for the
     * saved file. securityScopedBookmarks must be enabled for this to be present.
     */
    bookmark?: string;
  }
}
