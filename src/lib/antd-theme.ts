import type { ThemeConfig } from "antd";

export const antdTheme: ThemeConfig = {
  token: {
    colorPrimary: "#0D56D6",
    colorInfo: "#00A1DE",
    colorSuccess: "#28a745",
    colorError: "#dc3545",
    colorWarning: "#FA951F",
    colorText: "#5B5B5B",
    colorTextHeading: "#00151D",
    colorBgLayout: "#ECF1F5",
    colorBorder: "#d7e2ea",
    fontFamily: "var(--font-archivo), Archivo, sans-serif",
    borderRadius: 10,
    controlHeight: 50,
    controlHeightLG: 56,
  },
  components: {
    Button: {
      fontWeight: 700,
      borderRadius: 10,
      controlHeight: 50,
      paddingInline: 22,
    },
    Input: {
      borderRadius: 10,
    },
    Card: {
      borderRadiusLG: 14,
    },
  },
};
