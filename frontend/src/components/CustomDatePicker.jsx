import { DatePicker, PickersLayout } from "@mui/x-date-pickers";
import { styled } from "@mui/material/styles";

function CustomDatePicker({ label }) {
  const StyledPickersLayout = styled(PickersLayout)({
    ".MuiPickerDay-root": {
      color: "var(--color-secondary)",
      borderRadius: "var(--border-radius-full)",
      "&:hover": {
        backgroundColor: "var(--color-base)",
      },
      "&:focus,&:focus-visible": {
        backgroundColor: "var(--color-base)",
      },
      "&:is(.Mui-selected)": {
        backgroundColor: "var(--color-accent)",
      },
    },
    ".MuiPickerDay-today": {
      color: "var(--color-primary)",
      fontSize: "var(--text-sm)",
      fontWeight: "700",
      borderRadius: "var(--border-radius-full)",
      outline: "none",
      backgroundColor: "transparent",
      "&:hover": {
        color: "var(--color-primary)",
        backgroundColor: "var(--color-base)",
      },
    },
  });

  return (
    <DatePicker
      label={label}
      slotProps={{
        textField: { size: "small" },
        actionBar: {
          actions: ["clear", "today"],
          sx: {
            flexDirection: "row",
            justifyContent: "space-between",
            padding: "0",
            "& .MuiButton-root": {
              color: "var(--color-secondary)",
              fontSize: "var(--text-xs)",
              fontFamily: "var(--font-family)",

              "&:hover": {
                backgroundColor: "transparent",
                color: "var(--color-primary)",
              },
              "&:focus,&:focus-visible": {
                backgroundColor: "transparent",
                color: "var(--color-primary)",
              },
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
          color: "var(--color-primary)",
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
            borderColor: "var(--base-border-color)",
          },
          "&.Mui-focused:not(.Mui-error) .MuiPickersOutlinedInput-notchedOutline":
            {
              borderColor: "var(--color-accent)",
              borderWidth: "2px",
            },
          "& .MuiPickersSectionList-root": {
            padding: "0",
          },
        },
        "& .MuiFormControl-root .MuiPickersTextField-root": {
          border: "1px solid green",
        },
        "& .MuiFormLabel-root": {
          fontSize: "var(--text-sm)",
          color: "var(--color-primary)",
          opacity: "0.5",
          "&.Mui-focused": {
            color: "var(--color-primary)",
            opacity: "1",
          },
        },
      }}
    />
  );
}

export default CustomDatePicker;
