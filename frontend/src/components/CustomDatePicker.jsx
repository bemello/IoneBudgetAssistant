import { DatePicker, PickersLayout } from "@mui/x-date-pickers";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";

function CustomDatePicker({
  label,
  disablePortal = false,
  value,
  onChange,
  views = ["year", "month", "day"],
}) {
  const style = getComputedStyle(document.body);
  const primaryColor = style.getPropertyValue("--color-primary-hex");
  const secondaryColor = style.getPropertyValue("--color-secondary-hex");
  const tertiaryColor = style.getPropertyValue("--color-tertiary-hex");
  const accentColor = style.getPropertyValue("--color-accent-hex");
  const borderColor = style.getPropertyValue("--base-border-color");

  const width = "16rem";
  const height = "18rem";

  const customTheme = createTheme({
    palette: {
      calendarButton: {
        main: "hsl(from " + primaryColor + " h s l / 0.75)",
      },
    },
  });

  const StyledPickersLayout = styled(PickersLayout)({
    backgroundColor: "oklch(from " + secondaryColor + " 0.75 c h / 1)",
    borderRadius: "var(--border-radius-lg)",
    height: height,
    width: width,
    overflow: "hidden",

    ".MuiDayCalendar-weekDayLabel": {
      color: tertiaryColor,
      fontWeight: "700",
      height: "1.75rem",
      width: "1.75rem",
      fontSize: "var(--text-xs)",
    },
    ".MuiPickerDay-root": {
      color: primaryColor,
      fontSize: "var(--text-xs)",
      borderRadius: "var(--border-radius-full)",
      height: "1.75rem",
      width: "1.75rem",
      "&:hover": {
        backgroundColor: secondaryColor,
      },
      "&:focus-visible": {
        backgroundColor: secondaryColor,
      },
      "&:is(.Mui-selected)": {
        backgroundColor: accentColor,
      },
    },
    ".MuiPickerDay-today": {
      color: primaryColor,
      fontSize: "var(--text-sm)",
      fontWeight: "700",
      borderRadius: "var(--border-radius-full)",
      outline: "none",
      backgroundColor: "transparent",
      "&:hover": {
        color: primaryColor,
        backgroundColor: secondaryColor,
      },
    },
    "& .MuiDateCalendar-root": {
      width: width,
      height: "auto",
    },
    "& .MuiPickersCalendarHeader-root": {
      paddingLeft: "12px",
      paddingRight: "0",
    },
    "& .MuiDayCalendar-slideTransition": {
      minHeight: "10rem",
    },
  });

  return (
    <ThemeProvider theme={customTheme}>
      <DatePicker
        label={label}
        value={value}
        views={views}
        onChange={onChange}
        slotProps={{
          textField: {
            size: "small",
            sx: {
              justifyContent: "center",
              "& .MuiInputLabel-root": {
                color: primaryColor,
                opacity: 0.75,
                fontSize: "var(--text-sm)",
              },
              "& .MuiPickersOutlinedInput-root": {
                border: "1px solid",
                borderColor: borderColor,
                height: "var(--input-height)",
                borderRadius: "var(--border-radius-md)",
                "&:hover": {
                  borderColor: secondaryColor,
                  "& .MuiPickersOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                },
                "&.Mui-focused:not(.Mui-error) ": {
                  outline: "2px solid",
                  outlineColor: secondaryColor,
                  "& .MuiPickersOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                },
                "& .MuiPickersSectionList-root": {
                  color: primaryColor,
                  opacity: 0.75,
                  fontSize: "var(--text-sm)",
                },
              },
            },
          },
          openPickerButton: {
            color: "calendarButton",
            sx: {
              "&:hover": {
                color: secondaryColor,
              },
            },
          },
          actionBar: {
            actions: ["clear", "today"],
            sx: {
              flexDirection: "row",
              justifyContent: "space-between",
              padding: "0",
              "& .MuiButton-root": {
                color: tertiaryColor,
                fontSize: "var(--text-xs)",
                fontFamily: "var(--font-family)",

                "&:hover": {
                  backgroundColor: "transparent",
                  color: primaryColor,
                },
                "&:focus-visible": {
                  backgroundColor: "transparent",
                  color: primaryColor,
                },
              },
            },
          },
          popper: {
            disablePortal: disablePortal,
            sx: {
              width: width,
              zIndex: 1000,
              overflow: "hidden",
              ".MuiPaper-root": {
                width: width,
                height: height,
                backgroundColor: "transparent",
                borderRadius: "var(--border-radius-lg)",
              },
            },
          },
          layout: {
            sx: {
              color: tertiaryColor,
              button: {
                color: tertiaryColor,
              },
            },
          },
        }}
        slots={{
          layout: StyledPickersLayout,
        }}
        sx={{
          ".MuiPickersInputBase-root": {
            borderRadius: "var(--border-radius-md)",
            color: primaryColor,
            fontSize: "var(--text-sm)",
            fontWeight: "var(--font-weight-medium)",
            fontFamily: "var(--font-family)",
            minHeight: "2.5rem",
          },
          "& .MuiPickersOutlinedInput-root": {
            "& fieldset": {
              borderColor: "var(--base-border-color)",
              minHeight: "var(--input-height)",
              padding: "0",

              "& > legend": {
                width: "auto",
                marginLeft: "calc(var(--default-spacing-unit) * 1.5)",
              },
            },
            "&:hover fieldset": {
              borderColor: primaryColor,
            },
            "&.Mui-focused:not(.Mui-error) .MuiPickersOutlinedInput-notchedOutline":
              {
                borderColor: secondaryColor,
                borderWidth: "2px",
              },
            "& .MuiPickersSectionList-root": {
              padding: "0",
            },
          },
        }}
      />
    </ThemeProvider>
  );
}

export default CustomDatePicker;
